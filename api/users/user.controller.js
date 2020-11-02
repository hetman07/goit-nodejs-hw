const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./user.model");
const {
  ErrorRegistrUser,
  ErrorFindUser,
  ErrorNotValidateUser,
  UnauthorizedError,
} = require("../errors/ErrorMessage");

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

  async registerUser(req, res, next) {
    try {
      const { password } = req.body;
      const hashedPassword = await bcryptjs.hash(password, 10);
      const addUser = await UserModel.create({
        ...req.body,
        password: hashedPassword,
      });
      //в return убрать секретные поля password/token
      return res.status(201).json({
        users: {
          email: addUser.email,
          subscription: addUser.subscription,
        },
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
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
}

module.exports = new UserController();