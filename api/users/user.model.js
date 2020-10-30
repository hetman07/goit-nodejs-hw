const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
    required: true,
  },
  token: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("User", UserSchema);
