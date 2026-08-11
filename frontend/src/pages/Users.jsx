import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import UserForm from "../components/UserForm";

import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from "../api/users";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setError("");

      const data = await getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (user) => {
    try {
      setMessage("");
      setError("");

      let response;

      if (editingUser) {
        response = await updateUser(editingUser.id, user);
        setEditingUser(null);
      } else {
        response = await createUser(user);
      }

      setMessage(
        response.message ||
          (editingUser
            ? "User updated successfully."
            : "User created successfully.")
      );

      await loadUsers();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Operation failed."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await deleteUser(id);

      setMessage(
        response.message || "User deleted successfully."
      );

      await loadUsers();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <UserForm
          onSubmit={handleSubmit}
          editingUser={editingUser}
          onCancelEdit={() => setEditingUser(null)}
        />

        {message && (
          <p
            style={{
              color: "#22c55e",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              color: "#ef4444",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <hr />

        <h1>Users</h1>

        <hr />

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <h3>
                {user.firstName} {user.lastName}
              </h3>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Phone:</strong> {user.phone || "-"}
              </p>

              <p>
                <strong>Role ID:</strong> {user.roleId}
              </p>

              <p>
                <strong>Department ID:</strong>{" "}
                {user.departmentId}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {user.status ? "Active" : "Inactive"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => {
                    setMessage("");
                    setError("");
                    setEditingUser(user);
                  }}
                >
                  Edit
                </button>

                <button
                  style={{
                    background: "#dc2626",
                    color: "white",
                  }}
                  onClick={() => handleDelete(user.id)}
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