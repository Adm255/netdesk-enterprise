const express = require("express");

const authRoutes = require("../modules/auth/routes");
const dashboardRoutes = require("../modules/dashboard/routes");
const ticketsRoutes = require("../modules/tickets/routes");
const usersRoutes = require("../modules/users/routes");
const commentsRoutes = require("../modules/comments/routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/tickets", ticketsRoutes);
router.use("/users", usersRoutes);
router.use("/comments", commentsRoutes);

module.exports = router;