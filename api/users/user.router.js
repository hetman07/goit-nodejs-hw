const express = require("express");
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

module.exports = router;
