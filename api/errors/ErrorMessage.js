exports.ErrorFindUser = class ErrorFindUser extends Error {
  constructor(name) {
    super(name);
    this.status = 409;
    this.stack = "";
    this.message = "Email in use";
  }
};

exports.ErrorRegistrUser = class ErrorRegistrUser extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Ошибка от Joi или другой валидационной библиотеки";
  }
};

exports.ErrorNotValidateUser = class ErrorNotValidateUser extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Email or password is wrong";
  }
};

exports.UnauthorizedError = class UnauthorizedError extends Error {
  constructor(name) {
    super(name);
    this.status = 401;
    this.stack = "";
    this.message = "User not authorized";
  }
};

exports.ErrorUpdateUser = class ErrorUpdateUser extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Subscription is wrong.";
  }
};
