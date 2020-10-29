const mongoose = require("mongoose"); //подкл.к БД исп метод connect()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./contacts/contact.router");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRouters();
    await this.connectDb();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(cors({ origin: `http://localhost:${PORT}` }));
    this.server.use(express.json());
    this.server.use(morgan("dev"));
  }

  async connectDb() {
    try {
      const db = await mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
    } catch (err) {
      console.error(err.message);
      return process.exit(1);
    }
  }

  initRouters() {
    this.server.use("/api/contacts", contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }
};
