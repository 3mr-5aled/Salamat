const app = require("../src/app");
const dbConnection = require("../src/config/database.config");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
dbConnection();

module.exports = app;
