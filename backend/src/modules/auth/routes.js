const express = require("express");

const { authenticate } = require("../../middleware/auth.middleware");

const {
  register,
  login,
  me
} = require("./controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

module.exports = router;