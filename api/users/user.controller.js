const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./user.model");

class UserController {
constructor() {
    this.costFactor = 10;
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

  validateEmailUser(req, res, next) {
    const { emailUser } = req.body.email;
    console.log("email", email);
    const findEmail = await UserModel.find({ email: emailUser });
    if (findEmail) {
      throw new ErrorFindUser();
    }
    next();
  }

  async registerUser(req, res, next) {
    try {
      const {password} = req.body;
      const hashedPassword = await bcryptjs.hash(password, this.costFactor);
      const addUser = await UserModel.create({
       ...req.body,
       password: hashedPassword,
    });
    //в return убрать секретные поля password/token
      return res.status(201).json(addUser);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async login(req, res, next) {
      try{
        const { emailUser, passwordUser } = req.body;
        console.log("email", email);
        const findUser = await UserModel.findUserByEmail({ email: emailUser });
        const isPassword = await bcryptjs.compare(passwordUser, findUser.password);

        if (!findEmail || !isPassword) {
          throw new ErrorNotValidateUser();
        }
        const token = await jwt.sign({
            userId: user._id 
        }, process.env.JWT_SECRET, {
            expiresIn: 2 * 24 * 60 * 60,
        });
        await UserModel.updateToken(user._id, token);
        return res.status(200).json({token});

      } catch(err) {
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
}

module.exports = new UserController();
