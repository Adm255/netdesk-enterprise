import { useEffect, useState } from "react";
import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket,
} from "../api/tickets";

import Navbar from "../components/Navbar";
import TicketForm from "../components/TicketForm";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);

  const loadTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data.tickets);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load tickets."
      );
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (ticketData) => {
    try {
      if (editingTicket) {
        await updateTicket(
          editingTicket.id,
          ticketData
        );

        setEditingTicket(null);
      } else {
        await createTicket(ticketData);
      }

      await loadTickets();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed."
      );
    }
  };

  const handleDeleteTicket = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTicket(id);
      await loadTickets();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete ticket."
      );
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <TicketForm
          onCreate={handleCreateTicket}
          editingTicket={editingTicket}
          onCancelEdit={() => setEditingTicket(null)}
        />

        <hr />

        <h1>Tickets</h1>

        <hr />

        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <h3>{ticket.title}</h3>

              <p>{ticket.description}</p>

              <p>
                <strong>Status:</strong>{" "}
                {ticket.status}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {ticket.priority}
              </p>

              <p>
                <strong>Assigned To:</strong>{" "}
                {ticket.assignedTo
                  ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                  : "Unassigned"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() =>
                    handleEditTicket(ticket)
                  }
                >
                  Edit
                </button>

                <button
                  style={{
                    background: "#dc2626",
                    color: "white",
                  }}
                  onClick={() =>
                    handleDeleteTicket(ticket.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}