const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

//создаем модель для коллекции при верификации
const TokenSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1000 * 60 * 60, //срок действ токена 1 час
  },
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Token", TokenSchema);
