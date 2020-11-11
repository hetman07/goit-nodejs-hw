const Server = require("./api/server");
const mongoose = require("mongoose");

new Server().start();
mongoose.set("debug", true);
