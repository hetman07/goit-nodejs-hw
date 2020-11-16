const express = require("express");

const router = express.Router();
const UserController = require("./user.controller");
const UserMiddleware = require("./user.middleware");

router.post(
  "/auth/register",
  UserMiddleware.generatorAvatar, //созд аватарки при регистр
  UserController.validateEmailPassword,
  UserController.validateUniqueEmail,

  UserController.registerUser,
);

router.post(
  "/auth/login",
  UserController.validateEmailPassword,
  UserController.login,
);

router.post("/auth/logout", UserController.authorize, UserController.logout);

router.get("/users/current", UserController.authorize, UserController.current);

router.patch(
  "/users",
  UserController.authorize,
  UserController.validateUpdateUser,
  UserController.updateUserSub,
);

//router для загрузки и сохранения статических файлов
router.get(
  "/public/images",
  //UserMiddleware.upload.none(),
  //UserMiddleware.upload.single("avatar"), //метод single ждет одну картинку avatar в теле запроса будет наш файл для загрузки
  UserMiddleware.generatorAvatar,
  UserMiddleware.minifyImage,
  UserMiddleware.returnImage,
);

module.exports = router;
