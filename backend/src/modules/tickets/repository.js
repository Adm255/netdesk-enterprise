const prisma = require("../../config/prisma");

const ticketInclude = {
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      department: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },

  assignedTo: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      department: {
        select: {
          id: true,
          name: true
        }
      }
    }
  }
};

const createTicket = async (data) => {
  return prisma.ticket.create({
    data,
    include: ticketInclude
  });
};

const findAllTickets = async ({
  page = 1,
  limit = 10,
  status,
  priority,
  assignedToId,
  search
} = {}) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (assignedToId !== undefined) {
    where.assignedToId = Number(assignedToId);
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      }
    ];
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: ticketInclude,
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),

    prisma.ticket.count({
      where
    })
  ]);

  return {
    tickets,
    total
  };
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