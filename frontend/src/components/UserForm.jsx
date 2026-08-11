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
  const [roleId, setRoleId] = useState(1);
  const [departmentId, setDepartmentId] = useState(1);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName);
      setLastName(editingUser.lastName);
      setEmail(editingUser.email);
      setPhone(editingUser.phone || "");
      setRoleId(editingUser.roleId);
      setDepartmentId(editingUser.departmentId);
      setPassword("");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRoleId(1);
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
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h2>{editingUser ? "Edit User" : "Create User"}</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder={
            editingUser
              ? "Leave blank to keep current password"
              : "Password"
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editingUser}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Role ID"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="number"
          placeholder="Department ID"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
        />
      </div>

      <button type="submit">
        {editingUser ? "Update User" : "Create User"}
      </button>

      {editingUser && (
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