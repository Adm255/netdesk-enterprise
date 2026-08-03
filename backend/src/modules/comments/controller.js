const {
  addCommentToTicket,
  getTicketComments,
  updateExistingComment,
  deleteExistingComment
} = require("./service");

const createComment = async (req, res) => {
  try {
    const comment = await addCommentToTicket(
      req.params.ticketId,
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment
    });
  } catch (error) {
    const statusCode =
      error.message === "Ticket not found." ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await getTicketComments(
      req.params.ticketId
    );

    return res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    const statusCode =
      error.message === "Ticket not found." ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await updateExistingComment(
      req.params.ticketId,
      req.params.commentId,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      comment
    });
  } catch (error) {
    let statusCode = 400;

    if (error.message === "Comment not found.") {
      statusCode = 404;
    } else if (
      error.message === "You can only update your own comments."
    ) {
      statusCode = 403;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await deleteExistingComment(
      req.params.ticketId,
      req.params.commentId,
      req.user.id,
      req.user.roleId
    );

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
      comment
    });
  } catch (error) {
    let statusCode = 400;

    if (error.message === "Comment not found.") {
      statusCode = 404;
    } else if (
      error.message ===
      "You do not have permission to delete this comment."
    ) {
      statusCode = 403;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};