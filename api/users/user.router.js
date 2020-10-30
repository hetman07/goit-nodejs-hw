const express = require("express");
const userController = require("./user.controller");
const router = express.Router();
const UserController = require("./user.controller");

router.post(
  "/register",
  UserController.validateEmailPassword,
  UserController.validateEmailUser,
  userController.registerUser,
);

router.post(
  "/login",
  UserController.validateEmailPassword,
  UserController.validateLogin,
  userController.login,
);

router.post("/logout");

module.exports = router;
