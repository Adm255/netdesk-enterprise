const prisma = require("../../config/prisma");

const getTicketStatistics = async () => {
  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    lowPriority,
    mediumPriority,
    highPriority,
    urgentPriority
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { status: "RESOLVED" } }),
    prisma.ticket.count({ where: { status: "CLOSED" } }),
    prisma.ticket.count({ where: { priority: "LOW" } }),
    prisma.ticket.count({ where: { priority: "MEDIUM" } }),
    prisma.ticket.count({ where: { priority: "HIGH" } }),
    prisma.ticket.count({ where: { priority: "URGENT" } })
  ]);

  return {
    totalTickets,
    status: {
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      closed: closedTickets
    },
    priority: {
      low: lowPriority,
      medium: mediumPriority,
      high: highPriority,
      urgent: urgentPriority
    }
  };
};

const getUserStatistics = async () => {
  const [
    totalUsers,
    activeUsers,
    technicians
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        status: true
      }
    }),
    prisma.user.count({
      where: {
        roleId: 3
      }
    })
  ]);

  return {
    totalUsers,
    activeUsers,
    technicians
  };
};

const getTechnicianWorkload = async () => {
  const technicians = await prisma.user.findMany({
    where: {
      roleId: 3,
      status: true
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      assignedTickets: {
        select: {
          id: true,
          status: true
        }
      }
    },
    orderBy: {
      firstName: "asc"
    }
  });

  return technicians.map((technician) => {
    const tickets = technician.assignedTickets;

    return {
      id: technician.id,
      firstName: technician.firstName,
      lastName: technician.lastName,
      email: technician.email,
      totalAssigned: tickets.length,
      open: tickets.filter(
        (ticket) => ticket.status === "OPEN"
      ).length,
      inProgress: tickets.filter(
        (ticket) => ticket.status === "IN_PROGRESS"
      ).length,
      resolved: tickets.filter(
        (ticket) => ticket.status === "RESOLVED"
      ).length,
      closed: tickets.filter(
        (ticket) => ticket.status === "CLOSED"
      ).length
    };
  });
};

module.exports = {
  getTicketStatistics,
  getUserStatistics,
  getTechnicianWorkload
};