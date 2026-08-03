const express = require("express");

const { authenticate } = require("../../middleware/auth.middleware");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment
} = require("./controller");

const router = express.Router({
  mergeParams: true
});

router.post(
  "/",
  authenticate,
  createComment
);

router.get(
  "/",
  authenticate,
  getComments
);

router.put(
  "/:commentId",
  authenticate,
  updateComment
);

router.delete(
  "/:commentId",
  authenticate,
  deleteComment
);

module.exports = router;