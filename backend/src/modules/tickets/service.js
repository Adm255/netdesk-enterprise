const {
  createTicket,
  findAllTickets,
  findTicketById,
  updateTicket,
  deleteTicket
} = require("./repository");

const createNewTicket = async (ticketData, userId) => {
  if (!ticketData.title || !ticketData.description) {
    throw new Error("Title and description are required.");
  }

  const ticket = await createTicket({
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority || "MEDIUM",
    status: "OPEN",
    createdById: Number(userId),
    assignedToId: ticketData.assignedToId
      ? Number(ticketData.assignedToId)
      : null
  });

  return ticket;
};

const getAllTickets = async () => {
  return await findAllTickets();
};

const getTicketById = async (id) => {
  const ticket = await findTicketById(Number(id));

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  return ticket;
};

const updateExistingTicket = async (id, ticketData) => {
  const existingTicket = await findTicketById(Number(id));

  if (!existingTicket) {
    throw new Error("Ticket not found.");
  }

  const updateData = {};

  if (ticketData.title !== undefined) {
    updateData.title = ticketData.title;
  }

  if (ticketData.description !== undefined) {
    updateData.description = ticketData.description;
  }

  if (ticketData.priority !== undefined) {
    updateData.priority = ticketData.priority;
  }

  if (ticketData.status !== undefined) {
    updateData.status = ticketData.status;
  }

  if (ticketData.assignedToId !== undefined) {
    updateData.assignedToId =
      ticketData.assignedToId === null
        ? null
        : Number(ticketData.assignedToId);
  }

  return await updateTicket(id, updateData);
};

const deleteExistingTicket = async (id) => {
  const existingTicket = await findTicketById(Number(id));

  if (!existingTicket) {
    throw new Error("Ticket not found.");
  }

  await deleteTicket(id);

  return existingTicket;
};

module.exports = {
  createNewTicket,
  getAllTickets,
  getTicketById,
  updateExistingTicket,
  deleteExistingTicket
};