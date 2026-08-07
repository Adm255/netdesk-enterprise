import { useEffect, useState } from "react";

export default function TicketForm({
  onCreate,
  editingTicket,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  useEffect(() => {
    if (editingTicket) {
      setTitle(editingTicket.title);
      setDescription(editingTicket.description);
      setPriority(editingTicket.priority);
    } else {
      setTitle("");
      setDescription("");
      setPriority("LOW");
    }
  }, [editingTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onCreate({
      title,
      description,
      priority,
    });

    if (!editingTicket) {
      setTitle("");
      setDescription("");
      setPriority("LOW");
    }
  };

return (
  <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
    <h2>
      {editingTicket ? "Edit Ticket" : "Create Ticket"}
    </h2>

    <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: "300px", padding: "10px" }}
      />
    </div>

      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          style={{ width: "300px", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>

      <button type="submit">
        {editingTicket ? "Update Ticket" : "Create Ticket"}
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