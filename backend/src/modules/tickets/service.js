const {
  createTicket,
  findAllTickets,
  findTicketById,
  updateTicket,
  deleteTicket,
} = require("./repository");

const {
  createTicketSchema,
  updateTicketSchema,
} = require("../../validators/ticketValidator");

const VALID_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const VALID_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const createNewTicket = async (ticketData, userId) => {
  const validatedData = createTicketSchema.parse({
    ...ticketData,
    createdById: Number(userId),
    status: "OPEN",
  });

  const ticket = await createTicket({
    title: validatedData.title,
    description: validatedData.description,
    priority: validatedData.priority,
    status: "OPEN",
    createdById: validatedData.createdById,
    assignedToId:
      validatedData.assignedToId ?? null,
  });

  return ticket;
};

const getAllTickets = async (query = {}) => {
  const page =
    query.page === undefined ? 1 : Number(query.page);

  const limit =
    query.limit === undefined ? 10 : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer.");
  }

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new Error("Limit must be between 1 and 100.");
  }

  const status = query.status
    ? query.status.toUpperCase()
    : undefined;

  const priority = query.priority
    ? query.priority.toUpperCase()
    : undefined;

  if (status && !VALID_STATUSES.includes(status)) {
    throw new Error("Invalid ticket status.");
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new Error("Invalid ticket priority.");
  }

  let assignedToId;

  if (query.assignedToId !== undefined) {
    assignedToId = Number(query.assignedToId);

    if (
      !Number.isInteger(assignedToId) ||
      assignedToId < 1
    ) {
      throw new Error("Invalid assignedToId.");
    }
  }

  const search =
    typeof query.search === "string"
      ? query.search.trim()
      : undefined;

  const result = await findAllTickets({
    page,
    limit,
    status,
    priority,
    assignedToId,
    search,
  });

  return {
    tickets: result.tickets,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
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

  const validatedData =
    updateTicketSchema.parse(ticketData);

  const updateData = {};

  if (validatedData.title !== undefined) {
    updateData.title = validatedData.title;
  }

  if (validatedData.description !== undefined) {
    updateData.description =
      validatedData.description;
  }

  if (validatedData.priority !== undefined) {
    updateData.priority = validatedData.priority;
  }

  if (validatedData.status !== undefined) {
    updateData.status = validatedData.status;
  }

  if (validatedData.assignedToId !== undefined) {
    updateData.assignedToId =
      validatedData.assignedToId;
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
  deleteExistingTicket,
};