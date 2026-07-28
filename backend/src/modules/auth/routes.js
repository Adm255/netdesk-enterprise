const express = require("express");

const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");

const ROLES = require("../../constants/roles");

const {
  register,
  login,
  me
} = require("./controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/me",
  authenticate,
  authorize(ROLES.EMPLOYEE),
  me
);

module.exports = router;