import { useEffect, useState } from "react";

export default function UserForm({
  onSubmit,
  editingUser,
  onCancelEdit,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(4);
  const [departmentId, setDepartmentId] = useState(1);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setEmail(editingUser.email || "");
      setPhone(editingUser.phone || "");
      setRoleId(editingUser.roleId || 4);
      setDepartmentId(editingUser.departmentId || 1);
      setPassword("");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRoleId(4);
      setDepartmentId(1);
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      firstName,
      lastName,
      email,
      phone,
      roleId: Number(roleId),
      departmentId: Number(departmentId),
    };

    if (password) {
      user.password = password;
    }

    await onSubmit(user);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={styles.form}
      autoComplete="off"
    >
      <div style={styles.formHeader}>
        <p style={styles.eyebrow}>
          {editingUser ? "ACCOUNT MANAGEMENT" : "NEW ACCOUNT"}
        </p>

        <h2 style={styles.title}>
          {editingUser ? "Edit User" : "Create New User"}
        </h2>

        <p style={styles.subtitle}>
          {editingUser
            ? "Update account information and access settings."
            : "Add a new user or support team member to NetDesk."}
        </p>
      </div>

      <div style={styles.fields}>
        {/* FIRST NAME */}
        <div style={styles.field}>
          <label style={styles.label}>First Name</label>

          <input
            type="text"
            name="new-user-first-name"
            autoComplete="off"
            placeholder="e.g. Adam"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {/* LAST NAME */}
        <div style={styles.field}>
          <label style={styles.label}>Last Name</label>

          <input
            type="text"
            name="new-user-last-name"
            autoComplete="off"
            placeholder="e.g. Idriss"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {/* EMAIL */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Email Address</label>

          <input
            type="email"
            name="new-user-email"
            autoComplete="off"
            placeholder="user@netdesk.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {/* PASSWORD */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Password</label>

          <input
            type="password"
            name="new-user-password"
            autoComplete="new-password"
            placeholder={
              editingUser
                ? "Leave blank to keep current password"
                : "Create a secure password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingUser}
            style={styles.input}
          />

          {editingUser && (
            <p style={styles.hint}>
              Leave this field empty if you do not want to
              change the current password.
            </p>
          )}
        </div>

        {/* PHONE */}
        <div style={styles.fieldFull}>
          <label style={styles.label}>Phone Number</label>

          <input
            type="tel"
            name="new-user-phone"
            autoComplete="off"
            placeholder="+250 7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* ROLE */}
        <div style={styles.field}>
          <label style={styles.label}>Role</label>

          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            style={styles.input}
          >
            <option value={1}>Administrator</option>
            <option value={2}>Manager</option>
            <option value={3}>Technician</option>
            <option value={4}>Employee</option>
          </select>
        </div>

        {/* DEPARTMENT */}
        <div style={styles.field}>
          <label style={styles.label}>Department</label>

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            style={styles.input}
          >
            <option value={1}>Information Technology</option>
            <option value={2}>Human Resources</option>
            <option value={3}>Finance</option>
            <option value={4}>Operations</option>
          </select>
        </div>
      </div>

      <div style={styles.actions}>
        <button type="submit" style={styles.primaryButton}>
          {editingUser ? "Update User" : "Create User"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto 50px",
    padding: "40px",
    border: "1px solid rgba(96, 165, 250, 0.15)",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, rgba(20, 27, 42, 0.98), rgba(15, 20, 32, 0.98))",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
    boxSizing: "border-box",
  },

  formHeader: {
    textAlign: "center",
    marginBottom: "36px",
  },

  eyebrow: {
    margin: "0 0 10px",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: "0",
    fontSize: "30px",
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "10px auto 0",
    maxWidth: "520px",
    color: "#8fa3bf",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  fields: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "22px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  fieldFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#b8c7dc",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    borderRadius: "10px",
    border: "1px solid #2b3a52",
    background: "#101722",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },

  hint: {
    margin: "0",
    fontSize: "12px",
    color: "#70839f",
    lineHeight: "1.5",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "32px",
  },

  primaryButton: {
    padding: "13px 22px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
  },

  cancelButton: {
    padding: "13px 22px",
    border: "1px solid #334155",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};