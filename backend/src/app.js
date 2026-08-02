const express = require("express");
const cors = require("cors");

const authModule = require("./modules/auth");
const usersModule = require("./modules/users");
const ticketsModule = require("./modules/tickets");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NetDesk API",
    version: "1.0.0-alpha",
    message: "Welcome to NetDesk Enterprise API"
  });
});

app.use("/api/v1/auth", authModule.routes);
app.use("/api/v1/users", usersModule.routes);
app.use("/api/v1/tickets", ticketsModule.routes);

module.exports = app;