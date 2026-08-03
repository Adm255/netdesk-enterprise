const {
  createComment,
  findCommentsByTicketId,
  findCommentById,
  updateComment,
  deleteComment
} = require("./repository");

const prisma = require("../../config/prisma");
const ROLES = require("../../constants/roles");

const addCommentToTicket = async (
  ticketId,
  authorId,
  commentData
) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: Number(ticketId)
    }
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  if (
    !commentData.content ||
    !commentData.content.trim()
  ) {
    throw new Error("Comment content is required.");
  }

  return await createComment({
    content: commentData.content.trim(),
    ticketId: Number(ticketId),
    authorId: Number(authorId)
  });
};

const getTicketComments = async (ticketId) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: Number(ticketId)
    }
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  return await findCommentsByTicketId(ticketId);
};

const updateExistingComment = async (
  ticketId,
  commentId,
  userId,
  commentData
) => {
  const comment = await findCommentById(commentId);

  if (!comment || comment.ticketId !== Number(ticketId)) {
    throw new Error("Comment not found.");
  }

  if (comment.authorId !== Number(userId)) {
    throw new Error("You can only update your own comments.");
  }

  if (
    !commentData.content ||
    !commentData.content.trim()
  ) {
    throw new Error("Comment content is required.");
  }

  return await updateComment(commentId, {
    content: commentData.content.trim()
  });
};

const deleteExistingComment = async (
  ticketId,
  commentId,
  userId,
  roleId
) => {
  const comment = await findCommentById(commentId);

  if (!comment || comment.ticketId !== Number(ticketId)) {
    throw new Error("Comment not found.");
  }

  const isAuthor =
    comment.authorId === Number(userId);

  const isAdmin =
    Number(roleId) === ROLES.ADMIN;

  if (!isAuthor && !isAdmin) {
    throw new Error(
      "You do not have permission to delete this comment."
    );
  }

  return await deleteComment(commentId);
};

module.exports = {
  addCommentToTicket,
  getTicketComments,
  updateExistingComment,
  deleteExistingComment
};