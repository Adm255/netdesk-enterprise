const prisma = require("../../config/prisma");

const ticketInclude = {
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  },
  assignedTo: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
    }
  }
};

const createTicket = async (data) => {
  return prisma.ticket.create({
    data,
    include: ticketInclude
  });
};

const findAllTickets = async () => {
  return prisma.ticket.findMany({
    include: ticketInclude,
    orderBy: {
      createdAt: "desc"
    }
  });
};

const findTicketById = async (id) => {
  return prisma.ticket.findUnique({
    where: {
      id: Number(id)
    },
    include: ticketInclude
  });
};

const updateTicket = async (id, data) => {
  return prisma.ticket.update({
    where: {
      id: Number(id)
    },
    data,
    include: ticketInclude
  });
};

const deleteTicket = async (id) => {
  return prisma.ticket.delete({
    where: {
      id: Number(id)
    }
  });
};

module.exports = {
  createTicket,
  findAllTickets,
  findTicketById,
  updateTicket,
  deleteTicket
};