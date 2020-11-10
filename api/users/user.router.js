const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "public/images/" });
const router = express.Router();
const UserController = require("./user.controller");

router.post(
  "/auth/register",
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
router.post(
  "/public/images",
  upload.single("avatar"),
  UserController.minifyImage,
  UserController.returnImage,
);

module.exports = router;
