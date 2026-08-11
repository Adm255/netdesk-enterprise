import { useEffect, useState } from "react";
import { getUsers } from "../api/users";

export default function TicketForm({
  onCreate,
  editingTicket,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [status, setStatus] = useState("OPEN");
  const [assignedToId, setAssignedToId] = useState("");

  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const data = await getUsers();

        const technicianUsers = data.users.filter(
          (user) => user.roleId === 3
        );

        setTechnicians(technicianUsers);
      } catch (error) {
        console.error(
          "Failed to load technicians:",
          error
        );
      }
    };

    loadTechnicians();
  }, []);

  useEffect(() => {
    if (editingTicket) {
      setTitle(editingTicket.title);
      setDescription(editingTicket.description);
      setPriority(editingTicket.priority);
      setStatus(editingTicket.status);
      setAssignedToId(
        editingTicket.assignedToId
          ? String(editingTicket.assignedToId)
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("LOW");
      setStatus("OPEN");
      setAssignedToId("");
    }
  }, [editingTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onCreate({
      title,
      description,
      priority,
      status,
      assignedToId: assignedToId
        ? Number(assignedToId)
        : null,
    });

    if (!editingTicket) {
      setTitle("");
      setDescription("");
      setPriority("LOW");
      setStatus("OPEN");
      setAssignedToId("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "30px" }}
    >
      <h2>
        {editingTicket
          ? "Edit Ticket"
          : "Create Ticket"}
      </h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
          style={{
            width: "300px",
            padding: "10px",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          required
          style={{
            width: "300px",
            padding: "10px",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          style={{ padding: "10px" }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>

      {editingTicket && (
        <div style={{ marginBottom: "15px" }}>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            style={{ padding: "10px" }}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">
              IN PROGRESS
            </option>
            <option value="RESOLVED">
              RESOLVED
            </option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <select
          value={assignedToId}
          onChange={(e) =>
            setAssignedToId(e.target.value)
          }
          style={{ padding: "10px" }}
        >
          <option value="">Unassigned</option>

          {technicians.map((technician) => (
            <option
              key={technician.id}
              value={technician.id}
            >
              {technician.firstName}{" "}
              {technician.lastName}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">
        {editingTicket
          ? "Update Ticket"
          : "Create Ticket"}
      </button>

      {editingTicket && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

