require("dotenv").config();
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { promises: fsPromises } = require("fs");

const UserModel = require("./user.model");
const TokenModel = require("../token/Token");
const {
  ErrorRegistrUser,
  ErrorFindUser,
  ErrorNotValidateUser,
  UnauthorizedError,
  ErrorUpdateUser,
  ErrorNotFoundUser,
} = require("../errors/ErrorMessage");
const Token = require("../token/Token");

const pathTmp = path.join(__dirname, "../../public/tmp");

class UserController {
  constructor() {
    this.costFactor = 10;
  }

  get validateUniqueEmail() {
    return this._validateUniqueEmail.bind(this);
  }

  get login() {
    return this._login.bind(this);
  }

  get registerUser() {
    return this._registerUser.bind(this);
  }

  validateEmailPassword(req, res, next) {
    const validationRules = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ErrorRegistrUser();
    }

    next();
  }

  async findUserByEmail(email) {
    const findUser = await UserModel.findOne({ email: email });
    return findUser;
  }

  async _validateUniqueEmail(req, res, next) {
    try {
      const { email } = req.body;

      const user = await this.findUserByEmail(email);

      if (user) {
        throw new ErrorFindUser();
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async _registerUser(req, res, next) {
    try {
      const delFile = await fsPromises.readdir(pathTmp, err => {
        if (err) {
          console.error("error ReadDIR", err);
        }
      });

      const { password } = req.body;
      const hashedPassword = await bcryptjs.hash(password, 10);
      const addUser = await UserModel.create({
        ...req.body,
        password: hashedPassword,
        avatarURL: `http://localhost:3000/images/${delFile[0]}`,
      });
      delFile.map(async file => await fsPromises.unlink(`${pathTmp}/${file}`));

      const tokenData = await this.generateOneTimePassword(addUser._id);

      await this.sendVerificationEmail(tokenData.token, addUser.email);
      //в return убрать секретные поля password/token
      return res.status(201).json({
        users: {
          email: addUser.email,
          subscription: addUser.subscription,
          avatarURL: addUser.avatarURL,
        },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async generateOneTimePassword(userId) {
    //генерируем токен для верификации
    const token = await crypto.randomBytes(16).toString("hex");
    //добавляем временный токен для верификации нового пользователя
    const tokenData = await TokenModel.create({
      token,
      userId,
    });
    return tokenData;
  }

  async sendVerificationEmail(token, email) {
    try {
      const msg = {
        to: email, // Change to your recipient
        from: "pvp071984@gmail.com", // Change to your verified sender
        subject: "Sending with SendGrid is Fun",

        html: `Please verify your email by this <a href=http://localhost:3000/auth/verify/${token}>link</a>`,
      };

      await sgMail.send(msg);
      console.log("Email sent");
    } catch (err) {
      console.error("sendVerification: ", err);
    }
  }

  async verifycationUser(req, res) {
    const {
      params: { verificationToken },
    } = req;

    const tokenData = await TokenModel.findOne({
      token: verificationToken,
    });

    if (!tokenData) {
      return res.status(401).json({ message: "Your token is invalid" });
    }
    const findUser = await UserModel.findById(tokenData.userId);

    if (!findUser) {
      return res.status(401).json({ message: "Your token is invalid" });
    }

    findUser.verificationToken = true;
    await findUser.save();

    //удалить из коллекци токенов уже верифицированную запись
    const deleteTokenData = await TokenModel.findByIdAndDelete(tokenData._id);

    return res.status(200).send("Your account is verified");
  }

  async _login(req, res, next) {
    try {
      const { email, password } = req.body;

      const findUser = await this.findUserByEmail(email);

      if (findUser) {
        const isPassword = await bcryptjs.compare(password, findUser.password);

        if (!isPassword) {
          throw new ErrorNotValidateUser();
        }
      }
      if (!findUser) {
        throw new ErrorNotValidateUser();
      }

      const token = await jwt.sign(
        {
          id: findUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 2 * 24 * 60 * 60,
        },
      );
      await UserModel.findByIdAndUpdate(findUser._id, { token });
      return res.status(200).json({
        token,
        user: {
          email: findUser.email,
          subscription: findUser.subscription,
        },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  //middleware для валидации token
  async authorize(req, res, next) {
    try {
      // 1. витягнути токен користувача з заголовка Authorization
      const authorizationHeader = req.get("Authorization") || "";
      const token = authorizationHeader.replace("Bearer ", "");

      // 2. витягнути id користувача з пейлоада або вернути користувачу
      // помилку зі статус кодом 401
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError());
      }

      // 3. витягнути відповідного користувача. Якщо такого немає - викинути
      // помилку зі статус кодом 401
      // userModel - модель користувача в нашій системі
      const user = await UserModel.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }

      // 4. Якщо все пройшло успішно - передати запис користувача і токен в req
      // і передати обробку запиту на наступний middleware
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { _id } = req.user;

      const findUser = await UserModel.findByIdAndUpdate(
        _id,
        {
          $set: {
            token: "",
          },
        },
        {
          new: true,
        },
      );

      return res.status(204).send("No Content");
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async current(req, res, next) {
    try {
      const { _id } = req.user;

      const findUser = await UserModel.findById(_id);

      return res.status(200).json({
        email: findUser.email,
        subscription: findUser.subscription,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  validateUpdateUser(req, res, next) {
    const validationRules = Joi.object({
      subscription: Joi.string().valid("free", "pro", "premium").required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ErrorUpdateUser();
    }
    next();
  }

  //обновление subscription user
  async updateUserSub(req, res, next) {
    try {
      const { _id } = req.user;
      const sub = req.body.subscription;
      //delete req.body.email;
      const findUser = await UserModel.findByIdAndUpdate(
        _id,
        {
          $set: { subscription: sub },
        },
        {
          new: true,
        },
      );

      return res.status(200).json({
        user: {
          email: findUser.email,
          subscription: findUser.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
