module.exports = class ErrorMessage extends Error {
  constructor(name) {
    super(name);
    this.status = 404;
    this.stack = "";
    this.message = "Not found";
  }
};
