import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import UserForm from "../components/UserForm";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../api/users";

const ROLE_NAMES = {
  1: "Administrator",
  2: "Manager",
  3: "Technician",
  4: "Employee",
};

const DEPARTMENT_NAMES = {
  1: "Information Technology",
  2: "Human Resources",
  3: "Finance",
  4: "Operations",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
        response = await updateUser(
          editingUser.id,
          user
        );

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
        response.message ||
          "User deleted successfully."
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`
          .toLowerCase();

      const email =
        (user.email || "").toLowerCase();

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        String(user.roleId) === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          user.status === true) ||
        (statusFilter === "inactive" &&
          user.status === false);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <>
      <Navbar />

      {/* RESPONSIVE STYLES */}
      <style>
        {`
          .users-container {
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
            padding: 36px 28px 70px;
            box-sizing: border-box;
            color: #e5edf8;
          }

          .users-section {
            margin-top: 28px;
          }

          .users-section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
            margin-bottom: 22px;
          }

          .users-filter-panel {
            display: grid;
            grid-template-columns:
              minmax(260px, 1.8fr)
              minmax(160px, 1fr)
              minmax(160px, 1fr)
              auto;
            gap: 12px;
            align-items: end;
            margin-bottom: 24px;
            padding: 18px;
            border-radius: 14px;
            border: 1px solid #26364e;
            background:
              linear-gradient(145deg, #141c2b, #101722);
            box-shadow:
              0 14px 35px rgba(0, 0, 0, 0.18);
            box-sizing: border-box;
            width: 100%;
          }

          .users-filter-field {
            min-width: 0;
            width: 100%;
          }

          .users-filter-input,
          .users-filter-select {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          }

          .users-grid {
            display: grid;
            grid-template-columns:
              repeat(auto-fit, minmax(320px, 1fr));
            gap: 18px;
          }

          .user-card {
            min-width: 0;
            overflow: hidden;
          }

          .user-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
          }

          .user-email {
            word-break: break-word;
          }

          .user-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
          }

          .user-detail-value {
            text-align: right;
            overflow-wrap: anywhere;
          }

          .user-actions {
            display: flex;
            gap: 10px;
          }

          .user-action-button {
            flex: 1;
            min-width: 0;
          }

          @media (max-width: 900px) {
            .users-filter-panel {
              grid-template-columns: 1fr 1fr;
            }

            .users-filter-field:first-child {
              grid-column: 1 / -1;
            }
          }

          @media (max-width: 620px) {
            .users-container {
              padding: 24px 16px 50px;
            }

            .users-section {
              margin-top: 24px;
            }

            .users-section-header {
              align-items: flex-start;
              flex-direction: column;
              gap: 16px;
            }

            .users-filter-panel {
              grid-template-columns: 1fr;
              padding: 16px;
              gap: 14px;
            }

            .users-filter-field:first-child {
              grid-column: auto;
            }

            .users-filter-input,
            .users-filter-select {
              width: 100%;
            }

            .users-grid {
              grid-template-columns: 1fr;
            }

            .user-card {
              padding: 20px !important;
            }

            .user-header {
              flex-direction: column;
              align-items: flex-start;
            }

            .user-detail {
              align-items: flex-start;
              flex-direction: column;
              gap: 4px;
            }

            .user-detail-value {
              text-align: left;
            }

            .user-actions {
              flex-direction: column;
            }

            .user-action-button {
              width: 100%;
            }
          }

          @media (max-width: 400px) {
            .users-container {
              padding-left: 12px;
              padding-right: 12px;
            }

            .users-filter-panel {
              padding: 14px;
            }

            .user-card {
              padding: 17px !important;
            }
          }
        `}
      </style>

      <main className="users-container">

        {/* USER FORM */}
        <UserForm
          onSubmit={handleSubmit}
          editingUser={editingUser}
          onCancelEdit={() => {
            setEditingUser(null);
            setMessage("");
            setError("");
          }}
        />

        {/* SUCCESS MESSAGE */}
        {message && (
          <div style={styles.successMessage}>
            ✓ {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* USERS SECTION */}
        <section className="users-section">

          {/* HEADER */}
          <div className="users-section-header">

            <div>
              <p style={styles.eyebrow}>
                ACCOUNT MANAGEMENT
              </p>

              <h1 style={styles.title}>
                Users
              </h1>

              <p style={styles.subtitle}>
                Manage NetDesk users and support
                team members.
              </p>
            </div>

            <div style={styles.userCount}>
              <strong>
                {filteredUsers.length}
              </strong>

              <span>
                {filteredUsers.length === 1
                  ? "User"
                  : "Users"}
              </span>
            </div>

          </div>

          {/* SEARCH & FILTERS */}
          <div className="users-filter-panel">

            {/* SEARCH */}
            <div className="users-filter-field">
              <label style={styles.filterLabel}>
                Search users
              </label>

              <input
                className="users-filter-input"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={styles.searchInput}
              />
            </div>

            {/* ROLE */}
            <div className="users-filter-field">
              <label style={styles.filterLabel}>
                Role
              </label>

              <select
                className="users-filter-select"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                style={styles.filterSelect}
              >
                <option value="all">
                  All Roles
                </option>

                <option value="1">
                  Administrator
                </option>

                <option value="2">
                  Manager
                </option>

                <option value="3">
                  Technician
                </option>

                <option value="4">
                  Employee
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div className="users-filter-field">
              <label style={styles.filterLabel}>
                Status
              </label>

              <select
                className="users-filter-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={styles.filterSelect}
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* CLEAR */}
            <button
              type="button"
              onClick={clearFilters}
              style={styles.clearButton}
            >
              Clear
            </button>

          </div>

          {/* USERS */}
          {filteredUsers.length === 0 ? (
            <div style={styles.emptyState}>

              <h3 style={styles.emptyTitle}>
                {users.length === 0
                  ? "No users found"
                  : "No matching users"}
              </h3>

              <p style={styles.emptyText}>
                {users.length === 0
                  ? "Create a user to get started."
                  : "Try changing your search or filters."}
              </p>

            </div>
          ) : (

            <div className="users-grid">

              {filteredUsers.map((user) => (

                <div
                  key={user.id}
                  className="user-card"
                  style={styles.userCard}
                >

                  {/* USER HEADER */}
                  <div
                    className="user-header"
                    style={styles.userHeader}
                  >

                    <div>
                      <h3 style={styles.userName}>
                        {user.firstName}{" "}
                        {user.lastName}
                      </h3>

                      <p
                        className="user-email"
                        style={styles.userEmail}
                      >
                        {user.email}
                      </p>
                    </div>

                    <span
                      style={
                        user.status
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {user.status
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* DETAILS */}
                  <div style={styles.userDetails}>

                    <div
                      className="user-detail"
                      style={styles.detail}
                    >
                      <span style={styles.detailLabel}>
                        Phone
                      </span>

                      <span
                        className="user-detail-value"
                        style={styles.detailValue}
                      >
                        {user.phone ||
                          "Not provided"}
                      </span>
                    </div>

                    <div
                      className="user-detail"
                      style={styles.detail}
                    >
                      <span style={styles.detailLabel}>
                        Role
                      </span>

                      <span
                        className="user-detail-value"
                        style={styles.detailValue}
                      >
                        {ROLE_NAMES[user.roleId] ||
                          "Unknown"}
                      </span>
                    </div>

                    <div
                      className="user-detail"
                      style={styles.detail}
                    >
                      <span style={styles.detailLabel}>
                        Department
                      </span>

                      <span
                        className="user-detail-value"
                        style={styles.detailValue}
                      >
                        {DEPARTMENT_NAMES[
                          user.departmentId
                        ] || "Unknown"}
                      </span>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div
                    className="user-actions"
                    style={styles.actions}
                  >

                    <button
                      className="user-action-button"
                      onClick={() => {
                        setMessage("");
                        setError("");
                        setEditingUser(user);

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      style={styles.editButton}
                    >
                      Edit
                    </button>

                    <button
                      className="user-action-button"
                      onClick={() =>
                        handleDelete(user.id)
                      }
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>
      </main>
    </>
  );
}

const styles = {
  eyebrow: {
    margin: "0 0 7px",
    color: "#60a5fa",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.6px",
  },

  title: {
    margin: "0",
    color: "#f8fafc",
    fontSize: "32px",
    lineHeight: 1.15,
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#8fa3bf",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  userCount: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "76px",
    minHeight: "68px",
    padding: "9px 14px",
    borderRadius: "12px",
    background:
      "linear-gradient(145deg, #151f31, #101722)",
    border: "1px solid #2b3a52",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
  },

  filterLabel: {
    display: "block",
    marginBottom: "7px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#9fb1c9",
  },

  searchInput: {
    padding: "12px 13px",
    borderRadius: "9px",
    border: "1px solid #2b3a52",
    background: "#0f1724",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
  },

  filterSelect: {
    padding: "12px 13px",
    borderRadius: "9px",
    border: "1px solid #2b3a52",
    background: "#0f1724",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: "14px",
    outline: "none",
  },

  clearButton: {
    padding: "12px 18px",
    border: "1px solid #334155",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap",
    minHeight: "43px",
  },

  userCard: {
    border: "1px solid #26364e",
    borderRadius: "16px",
    padding: "22px",
    background:
      "linear-gradient(145deg, rgba(20,29,45,0.98), rgba(15,22,34,0.98))",
    boxShadow:
      "0 14px 35px rgba(0,0,0,0.20)",
    transition:
      "transform 0.2s ease, border-color 0.2s ease",
    boxSizing: "border-box",
  },

  userHeader: {
    marginBottom: "20px",
  },

  userName: {
    margin: "0",
    color: "#f8fafc",
    fontSize: "18px",
    lineHeight: 1.3,
    fontWeight: "750",
  },

  userEmail: {
    margin: "5px 0 0",
    color: "#8296b3",
    fontSize: "13px",
  },

  activeBadge: {
    padding: "5px 9px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.10)",
    color: "#4ade80",
    border:
      "1px solid rgba(34,197,94,0.25)",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  inactiveBadge: {
    padding: "5px 9px",
    borderRadius: "999px",
    background: "rgba(239,68,68,0.10)",
    color: "#f87171",
    border:
      "1px solid rgba(239,68,68,0.25)",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",
    padding: "16px 0",
    borderTop: "1px solid #243247",
    borderBottom: "1px solid #243247",
  },

  detail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  detailLabel: {
    fontSize: "12px",
    color: "#7186a3",
    flexShrink: 0,
  },

  detailValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#dbe7f5",
  },

  actions: {
    marginTop: "18px",
  },

  editButton: {
    padding: "10px",
    border: "1px solid #334155",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.035)",
    color: "#dbe7f5",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    padding: "10px",
    border: "1px solid #dc2626",
    borderRadius: "9px",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  successMessage: {
    maxWidth: "820px",
    margin: "0 auto 25px",
    padding: "13px 16px",
    borderRadius: "10px",
    background:
      "rgba(34,197,94,0.10)",
    border:
      "1px solid rgba(34,197,94,0.28)",
    color: "#4ade80",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
  },

  errorMessage: {
    maxWidth: "820px",
    margin: "0 auto 25px",
    padding: "13px 16px",
    borderRadius: "10px",
    background:
      "rgba(239,68,68,0.10)",
    border:
      "1px solid rgba(239,68,68,0.28)",
    color: "#f87171",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
  },

  emptyState: {
    padding: "55px 30px",
    textAlign: "center",
    borderRadius: "16px",
    border: "1px solid #26364e",
    background:
      "linear-gradient(145deg, #141c2b, #101722)",
    color: "#8296b3",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#dbe7f5",
  },

  emptyText: {
    margin: 0,
    color: "#8296b3",
  },
};