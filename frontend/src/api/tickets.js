import api from "./axios";

export const getTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const createTicket = async (ticket) => {
  const response = await api.post("/tickets", ticket);
  return response.data;
};

export const updateTicket = async (id, ticket) => {
  const response = await api.put(`/tickets/${id}`, ticket);
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};