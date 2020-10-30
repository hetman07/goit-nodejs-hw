module.exports = class ErrorMessage extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Not found";
  }
};

module.exports = class ErrorFindUser extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Email in use";
  }
};

module.exports = class ErrorRegistrUser extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Ошибка от Joi или другой валидационной библиотеки";
  }
};

module.exports = class ErrorNotValidateUser extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Email or password is wrong";
  }
};

module.exports = class UnauthorizedError extends Error {
  constructor(name) {
    super(name);
    this.status = 401;
    this.stack = "";
    this.message = "User not authorized";
  }
};
