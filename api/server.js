const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./routers/contact.router");
require("dotenv").config();

const PORT = process.env.PORT;

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddleware();
    this.initRouters();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json);
    // this.server.use(cors({ origin: `http://localhost:${PORT}` }));
    // this.server.use(morgan("dev"));
  }

  initRouters() {
    this.server.use("/", contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }
};
