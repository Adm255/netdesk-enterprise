const express = require("express");

const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");
const ROLES = require("../../constants/roles");

const {
  getStats
} = require("./controller");

const router = express.Router();

router.get(
  "/stats",
  authenticate,
  authorize(
    ROLES.ADMIN,
    ROLES.MANAGER
  ),
  getStats
);

module.exports = router;