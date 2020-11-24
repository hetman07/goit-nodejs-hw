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
  avatarURL: {
    type: String,
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
  verificationToken: {
    type: Boolean,
    default: false,
  },
});

UserSchema.static.updateToken = updateToken;

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

module.exports = mongoose.model("User", UserSchema);
