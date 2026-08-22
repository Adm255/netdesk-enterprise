import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsers } from "../api/users";

const DEPARTMENTS = [
  "Information Technology",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
  "Sales & Marketing",
];

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
  const [reporterId, setReporterId] = useState("");
  const [department, setDepartment] = useState("");

  const [technicians, setTechnicians] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUsers();
        const userList = data.users || [];
        setUsers(userList);

        const technicianUsers = userList.filter(
          (user) => user.roleId === 3
        );

        setTechnicians(technicianUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (editingTicket) {
      setTitle(editingTicket.title || "");
      setDescription(editingTicket.description || "");
      setPriority(editingTicket.priority || "LOW");
      setStatus(editingTicket.status || "OPEN");

      setAssignedToId(
        editingTicket.assignedToId
          ? String(editingTicket.assignedToId)
          : ""
      );

      const currentReporter =
        editingTicket.createdBy?.id ||
        editingTicket.reporterId ||
        editingTicket.reporter?.id;
      setReporterId(currentReporter ? String(currentReporter) : "");

      const currentDepartment =
        editingTicket.department?.name ||
        editingTicket.department ||
        editingTicket.createdBy?.department?.name ||
        editingTicket.createdBy?.department ||
        "";
      setDepartment(
        typeof currentDepartment === "string" ? currentDepartment : ""
      );
    } else {
      resetForm();
    }
  }, [editingTicket]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("LOW");
    setStatus("OPEN");
    setAssignedToId("");
    setReporterId("");
    setDepartment("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onCreate({
        title,
        description,
        priority,
        status,
        assignedToId: assignedToId ? Number(assignedToId) : null,
        reporterId: reporterId ? Number(reporterId) : null,
        createdBy: reporterId ? Number(reporterId) : null,
        department: department || undefined,
      });

      toast.success(
        editingTicket
          ? "Ticket updated successfully!"
          : "Ticket created successfully!"
      );

      if (!editingTicket) {
        resetForm();
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save ticket.");
    }
  };

  return (
    <section style={styles.wrapper}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.iconBox}>
          <span style={styles.icon}>T</span>
        </div>

        <div>
          <p style={styles.eyebrow}>
            {editingTicket
              ? "TICKET MANAGEMENT"
              : "SUPPORT REQUEST"}
          </p>

          <h2 style={styles.title}>
            {editingTicket
              ? "Edit Ticket"
              : "Create New Ticket"}
          </h2>

          <p style={styles.subtitle}>
            {editingTicket
              ? "Update the ticket details, priority, status and assignment."
              : "Create a support request and assign it to a technician."}
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* TITLE */}
        <div style={styles.field}>
          <label style={styles.label}>Ticket Title</label>

          <input
            type="text"
            name="ticket-title"
            autoComplete="off"
            placeholder="e.g. Office Wi-Fi connection issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={styles.field}>
          <label style={styles.label}>Description</label>

          <textarea
            name="ticket-description"
            autoComplete="off"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
            style={styles.textarea}
          />
        </div>

        {/* REPORTED BY + DEPARTMENT */}
        <div style={{ ...styles.grid, marginBottom: "24px" }}>
          <div style={styles.field}>
            <label style={styles.label}>Reported By</label>

            <select
              value={reporterId}
              onChange={(e) => setReporterId(e.target.value)}
              style={styles.select}
            >
              <option value="">Current Authenticated User</option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Department</label>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRIORITY + TECHNICIAN */}
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.select}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Assign Technician
            </label>

            <select
              value={assignedToId}
              onChange={(e) =>
                setAssignedToId(e.target.value)
              }
              style={styles.select}
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
        </div>

        {/* STATUS */}
        {editingTicket && (
          <div style={styles.field}>
            <label style={styles.label}>Ticket Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="RESOLVED">
                Resolved
              </option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button
            type="submit"
            style={styles.primaryButton}
          >
            {editingTicket
              ? "Update Ticket"
              : "Create Ticket"}
          </button>

          {editingTicket && (
            <button
              type="button"
              onClick={onCancelEdit}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: "920px",
    margin: "0 auto 48px",
    padding: "38px",
    boxSizing: "border-box",

    border: "1px solid #243653",
    borderRadius: "20px",

    background:
      "linear-gradient(145deg, #111b2d 0%, #0f1726 100%)",

    boxShadow:
      "0 20px 50px rgba(0, 0, 0, 0.25)",
  },

  /* HEADER */
  header: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "36px",
  },

  iconBox: {
    width: "54px",
    height: "54px",
    flexShrink: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",

    boxShadow:
      "0 8px 24px rgba(37, 99, 235, 0.25)",
  },

  icon: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "800",
  },

  eyebrow: {
    margin: "0 0 7px",
    color: "#60a5fa",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: "0",
    color: "#f8fafc",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#8295b2",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  /* FIELDS */
  field: {
    marginBottom: "24px",
  },

  label: {
    display: "block",
    marginBottom: "9px",

    color: "#b9c7dc",
    fontSize: "13px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    height: "50px",
    boxSizing: "border-box",

    padding: "0 15px",

    border: "1px solid #2a3a54",
    borderRadius: "11px",

    background: "#0d1623",
    color: "#f8fafc",

    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",

    padding: "14px 15px",

    border: "1px solid #2a3a54",
    borderRadius: "11px",

    background: "#0d1623",
    color: "#f8fafc",

    fontSize: "14px",
    lineHeight: "1.6",

    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  },

  select: {
    width: "100%",
    height: "50px",
    boxSizing: "border-box",

    padding: "0 15px",

    border: "1px solid #2a3a54",
    borderRadius: "11px",

    background: "#0d1623",
    color: "#f8fafc",

    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  /* TWO COLUMNS */
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  /* ACTIONS */
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",

    marginTop: "8px",
    paddingTop: "8px",
  },

  primaryButton: {
    minWidth: "150px",
    height: "46px",

    padding: "0 22px",

    border: "none",
    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",

    color: "#ffffff",

    fontSize: "14px",
    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 22px rgba(37, 99, 235, 0.25)",
  },

  secondaryButton: {
    height: "46px",

    padding: "0 22px",

    border: "1px solid #34445d",
    borderRadius: "10px",

    background: "#172235",
    color: "#cbd5e1",

    fontSize: "14px",
    fontWeight: "600",

    cursor: "pointer",
  },
};