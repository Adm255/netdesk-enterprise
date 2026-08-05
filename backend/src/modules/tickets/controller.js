const {
  createNewTicket,
  getAllTickets,
  getTicketById,
  updateExistingTicket,
  deleteExistingTicket
} = require("./service");

const createTicket = async (req, res) => {
  try {
    const ticket = await createNewTicket(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully.",
      ticket
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getTickets = async (req, res) => {
  try {
    const result = await getAllTickets(req.query);

    return res.status(200).json({
      success: true,
      tickets: result.tickets,
      pagination: result.pagination
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);

    return res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await updateExistingTicket(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully.",
      ticket
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

const deleteTicket = async (req, res) => {
  try {
    const ticket = await deleteExistingTicket(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully.",
      ticket
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

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket
};