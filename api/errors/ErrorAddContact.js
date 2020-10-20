module.exports = class ErrorAddContact extends Error {
  constructor(name) {
    super(name);
    this.status = 400;
    this.stack = "";
    this.message = "missing required name field";
  }
};
