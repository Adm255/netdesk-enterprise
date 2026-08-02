const express = require("express");

const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");
const ROLES = require("../../constants/roles");

const {
  getUsers,
  getUser,
  createUser
} = require("./controller");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  getUsers
);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  createUser
);

router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  getUser
);

module.exports = router;