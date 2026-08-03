const prisma = require("../../config/prisma");

const commentInclude = {
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  }
};

const createComment = async (data) => {
  return prisma.ticketComment.create({
    data,
    include: commentInclude
  });
};

const findCommentsByTicketId = async (ticketId) => {
  return prisma.ticketComment.findMany({
    where: {
      ticketId: Number(ticketId)
    },
    include: commentInclude,
    orderBy: {
      createdAt: "asc"
    }
  });
};

const findCommentById = async (commentId) => {
  return prisma.ticketComment.findUnique({
    where: {
      id: Number(commentId)
    },
    include: commentInclude
  });
};

const updateComment = async (commentId, data) => {
  return prisma.ticketComment.update({
    where: {
      id: Number(commentId)
    },
    data,
    include: commentInclude
  });
};

const deleteComment = async (commentId) => {
  return prisma.ticketComment.delete({
    where: {
      id: Number(commentId)
    },
    include: commentInclude
  });
};

module.exports = {
  createComment,
  findCommentsByTicketId,
  findCommentById,
  updateComment,
  deleteComment
};