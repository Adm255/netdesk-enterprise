const express = require("express");

const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");
const ROLES = require("../../constants/roles");

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket
} = require("./controller");

const router = express.Router();

router.post(
  "/",
  authenticate,
  createTicket
);

router.get(
  "/",
  authenticate,
  getTickets
);

router.get(
  "/:id",
  authenticate,
  getTicket
);

router.put(
  "/:id",
  authenticate,
  authorize(
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.TECHNICIAN
  ),
  updateTicket
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  deleteTicket
);

module.exports = router;