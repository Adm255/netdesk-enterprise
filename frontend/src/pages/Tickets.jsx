import { useEffect, useState } from "react";

import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket,
} from "../api/tickets";

import { getUsers } from "../api/users";

import Navbar from "../components/Navbar";
import TicketForm from "../components/TicketForm";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);

  const [technicians, setTechnicians] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedToId, setAssignedToId] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Convert backend/Zod validation errors into a clean message for users.
  const getErrorMessage = (error, fallback) => {
    const rawMessage = error?.response?.data?.message;

    if (Array.isArray(rawMessage)) {
      const messages = rawMessage
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.message
        )
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    if (typeof rawMessage === "string") {
      try {
        const parsed = JSON.parse(rawMessage);

        if (Array.isArray(parsed)) {
          const messages = parsed
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.message
            )
            .filter(Boolean);

          if (messages.length > 0) {
            return messages.join(" ");
          }
        }
      } catch {
        // The backend returned a normal text message.
      }

      return rawMessage;
    }

    return fallback;
  };

  // --------------------------------------------------
  // LOAD TECHNICIANS
  // --------------------------------------------------

  const loadTechnicians = async () => {
    try {
      const data = await getUsers();

      const technicianUsers = data.users.filter(
        (user) => user.roleId === 3
      );

      setTechnicians(technicianUsers);
    } catch (error) {
      console.error("Failed to load technicians:", error);
    }
  };

  // --------------------------------------------------
  // LOAD TICKETS
  // --------------------------------------------------

  const loadTickets = async () => {
    try {
      setLoading(true);

      let assignedFilter;

      if (assignedToId === "unassigned") {
        assignedFilter = "unassigned";
      } else if (assignedToId) {
        assignedFilter = Number(assignedToId);
      } else {
        assignedFilter = undefined;
      }

      const data = await getTickets({
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        assignedToId: assignedFilter,
        page,
        limit: 10,
      });

      setTickets(data.tickets);

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          total: data.tickets.length,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        getErrorMessage(error, "Unable to load tickets.")
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadTechnicians();
  }, []);

  useEffect(() => {
    loadTickets();
  }, [
    search,
    status,
    priority,
    assignedToId,
    page,
  ]);

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  const handleCreateTicket = async (ticketData) => {
    try {
      setMessage("");
      setErrorMessage("");

      if (editingTicket) {
        const response = await updateTicket(
          editingTicket.id,
          ticketData
        );

        setEditingTicket(null);

        setMessage(
          response?.message ||
            "Ticket updated successfully."
        );
      } else {
        const response = await createTicket(ticketData);

        setMessage(
          response?.message ||
            "Ticket created successfully."
        );
      }

      await loadTickets();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        getErrorMessage(error, "Ticket operation failed.")
      );
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDeleteTicket = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setErrorMessage("");

      const response = await deleteTicket(id);

      setMessage(
        response?.message ||
          "Ticket deleted successfully."
      );

      await loadTickets();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        getErrorMessage(error, "Failed to delete ticket.")
      );
    }
  };

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  const handleEditTicket = (ticket) => {
    setMessage("");
    setErrorMessage("");

    setEditingTicket(ticket);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setAssignedToId("");
    setPage(1);
  };

  // --------------------------------------------------
  // FORMATTERS
  // --------------------------------------------------

  const formatStatus = (ticketStatus) => {
    return ticketStatus
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusStyle = (ticketStatus) => {
    const stylesByStatus = {
      OPEN: {
        background: "rgba(245,158,11,0.12)",
        color: "#f59e0b",
        border: "1px solid rgba(245,158,11,0.25)",
      },

      IN_PROGRESS: {
        background: "rgba(139,92,246,0.12)",
        color: "#a78bfa",
        border: "1px solid rgba(139,92,246,0.25)",
      },

      RESOLVED: {
        background: "rgba(34,197,94,0.12)",
        color: "#4ade80",
        border: "1px solid rgba(34,197,94,0.25)",
      },

      CLOSED: {
        background: "rgba(100,116,139,0.15)",
        color: "#94a3b8",
        border: "1px solid rgba(100,116,139,0.25)",
      },
    };

    return {
      ...styles.badge,
      ...stylesByStatus[ticketStatus],
    };
  };

  const getPriorityStyle = (ticketPriority) => {
    const stylesByPriority = {
      LOW: {
        background: "rgba(59,130,246,0.12)",
        color: "#60a5fa",
        border: "1px solid rgba(59,130,246,0.25)",
      },

      MEDIUM: {
        background: "rgba(245,158,11,0.12)",
        color: "#fbbf24",
        border: "1px solid rgba(245,158,11,0.25)",
      },

      HIGH: {
        background: "rgba(249,115,22,0.12)",
        color: "#fb923c",
        border: "1px solid rgba(249,115,22,0.25)",
      },

      URGENT: {
        background: "rgba(239,68,68,0.12)",
        color: "#f87171",
        border: "1px solid rgba(239,68,68,0.25)",
      },
    };

    return {
      ...styles.badge,
      ...stylesByPriority[ticketPriority],
    };
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <header style={styles.pageHeader}>
          <div>
            <p style={styles.eyebrow}>
              IT SERVICE MANAGEMENT
            </p>

            <h1 style={styles.pageTitle}>
              Support Tickets
            </h1>

            <p style={styles.pageSubtitle}>
              Create, assign, track and manage support
              requests.
            </p>
          </div>

          <div style={styles.ticketCount}>
            <span style={styles.ticketCountNumber}>
              {pagination.total}
            </span>

            <span style={styles.ticketCountLabel}>
              Total Tickets
            </span>
          </div>
        </header>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div style={styles.successMessage}>
            <span style={styles.messageIcon}>✓</span>
            <span>{message}</span>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {errorMessage && (
          <div style={styles.errorMessage}>
            <span style={styles.messageIcon}>✕</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================================================
            CREATE / EDIT FORM
        ================================================== */}

        <TicketForm
          onCreate={handleCreateTicket}
          editingTicket={editingTicket}
          onCancelEdit={() => {
            setEditingTicket(null);
            setMessage("");
            setErrorMessage("");
          }}
        />

        {/* ==================================================
            TICKET LIST
        ================================================== */}

        <section style={styles.listSection}>

          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.eyebrow}>
                TICKET MANAGEMENT
              </p>

              <h2 style={styles.sectionTitle}>
                All Tickets
              </h2>
            </div>

            {pagination.total > 0 && (
              <span style={styles.resultText}>
                {pagination.total} ticket
                {pagination.total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* ==================================================
              FILTER CARD
          ================================================== */}

          <div style={styles.filterCard}>

            <div style={styles.filterHeader}>

              <div>
                <h3 style={styles.filterTitle}>
                  Filter Tickets
                </h3>

                <p style={styles.filterSubtitle}>
                  Find tickets by title, status,
                  priority or technician.
                </p>
              </div>

              {(search ||
                status ||
                priority ||
                assignedToId) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={styles.clearButton}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* IMPORTANT:
                Responsive grid.
                Desktop = 4 columns.
                Smaller screens = fewer columns.
            */}

            <div style={styles.filterGrid}>

              <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>
                  Search
                </span>

                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={styles.searchInput}
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="">
                  All Statuses
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>

                <option value="CLOSED">
                  Closed
                </option>
              </select>

              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="">
                  All Priorities
                </option>

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </select>

              <select
                value={assignedToId}
                onChange={(e) => {
                  setAssignedToId(e.target.value);
                  setPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="">
                  All Technicians
                </option>

                <option value="unassigned">
                  Unassigned
                </option>

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

          {/* ==================================================
              TICKET RESULTS
          ================================================== */}

          <div style={styles.resultsArea}>

            {loading ? (
              <div style={styles.stateCard}>

                <div style={styles.loadingDot} />

                <h3 style={styles.stateTitle}>
                  Loading tickets
                </h3>

                <p style={styles.stateText}>
                  Retrieving the latest support
                  requests...
                </p>

              </div>
            ) : tickets.length === 0 ? (

              <div style={styles.stateCard}>

                <div style={styles.emptyIcon}>
                  —
                </div>

                <h3 style={styles.stateTitle}>
                  No tickets found
                </h3>

                <p style={styles.stateText}>
                  Try adjusting your filters or
                  create a new support ticket.
                </p>

              </div>

            ) : (

              tickets.map((ticket) => (

                <article
                  key={ticket.id}
                  style={styles.ticketCard}
                >

                  {/* Ticket heading */}

                  <div style={styles.ticketTop}>

                    <div style={styles.ticketMain}>

                      <div style={styles.ticketId}>
                        TICKET #{ticket.id}
                      </div>

                      <h3 style={styles.ticketTitle}>
                        {ticket.title}
                      </h3>

                    </div>

                    <div style={styles.ticketBadges}>

                      <span
                        style={getStatusStyle(
                          ticket.status
                        )}
                      >
                        {formatStatus(
                          ticket.status
                        )}
                      </span>

                      <span
                        style={getPriorityStyle(
                          ticket.priority
                        )}
                      >
                        {ticket.priority}
                      </span>

                    </div>

                  </div>

                  {/* Description */}

                  <p style={styles.ticketDescription}>
                    {ticket.description}
                  </p>

                <div style={styles.ticketMeta}>

  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>
      Reported By
    </span>

    <span style={styles.metaValue}>
      {ticket.createdBy
        ? `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}`
        : "Unknown"}
    </span>
  </div>

  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>
      Department
    </span>

    <span style={styles.metaValue}>
      {ticket.createdBy?.department?.name || "Unknown"}
    </span>
  </div>

  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>
      Assigned To
    </span>

    <span style={styles.metaValue}>
      {ticket.assignedTo
        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
        : "Unassigned"}
    </span>
  </div>

  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>
      Priority
    </span>

    <span style={styles.metaValue}>
      {ticket.priority}
    </span>
  </div>

  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>
      Status
    </span>

    <span style={styles.metaValue}>
      {formatStatus(ticket.status)}
    </span>
  </div>

</div>

                  {/* Actions */}

                  <div style={styles.ticketActions}>

                    <button
                      type="button"
                      onClick={() =>
                        handleEditTicket(ticket)
                      }
                      style={styles.editButton}
                    >
                      Edit Ticket
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTicket(
                          ticket.id
                        )
                      }
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))

            )}

          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>

              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage - 1
                  )
                }
                style={{
                  ...styles.paginationButton,
                  ...(page === 1
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Previous
              </button>

              <span style={styles.paginationText}>
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page === pagination.totalPages
                }
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage + 1
                  )
                }
                style={{
                  ...styles.paginationButton,
                  ...(page ===
                  pagination.totalPages
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Next
              </button>

            </div>
          )}

        </section>

      </main>
    </>
  );
}

/* ==========================================================
   STYLES
========================================================== */

const styles = {
  page: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "42px 30px 70px",
    boxSizing: "border-box",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "30px",
    marginBottom: "38px",
  },

  eyebrow: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    color: "#60a5fa",
  },

  pageTitle: {
    margin: "0",
    fontSize: "42px",
    lineHeight: "1.1",
    fontWeight: "800",
    letterSpacing: "-1px",
    color: "#f8fafc",
  },

  pageSubtitle: {
    margin: "10px 0 0",
    fontSize: "16px",
    color: "#8fa3bf",
    lineHeight: "1.6",
  },

  ticketCount: {
    minWidth: "120px",
    padding: "17px 22px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.20)",
    background:
      "linear-gradient(145deg, rgba(30,41,59,0.65), rgba(15,23,42,0.55))",
    textAlign: "center",
    boxSizing: "border-box",
  },

  ticketCountNumber: {
    display: "block",
    fontSize: "30px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  ticketCountLabel: {
    display: "block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#8fa3bf",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    margin: "0 auto 24px",
    padding: "13px 18px",
    maxWidth: "760px",
    borderRadius: "10px",
    border: "1px solid rgba(34,197,94,0.25)",
    background: "rgba(34,197,94,0.10)",
    color: "#4ade80",
    fontSize: "14px",
    fontWeight: "700",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    margin: "0 auto 24px",
    padding: "13px 18px",
    maxWidth: "760px",
    borderRadius: "10px",
    border: "1px solid rgba(239,68,68,0.25)",
    background: "rgba(239,68,68,0.10)",
    color: "#f87171",
    fontSize: "14px",
    fontWeight: "700",
  },

  messageIcon: {
    fontSize: "15px",
    fontWeight: "900",
  },

  listSection: {
    marginTop: "52px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: "0",
    fontSize: "30px",
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: "-0.5px",
  },

  resultText: {
    fontSize: "13px",
    color: "#8fa3bf",
  },

  /* ----------------------------------------------------------
     FILTER CARD
  ---------------------------------------------------------- */

  filterCard: {
    width: "100%",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.18)",
    background:
      "linear-gradient(145deg, rgba(20,27,42,0.82), rgba(15,23,35,0.82))",
    marginBottom: "24px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  filterTitle: {
    margin: "0",
    fontSize: "19px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  filterSubtitle: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#70839f",
    lineHeight: "1.5",
  },

  /*
    FIXED FILTER GRID

    The previous version used:

    minmax(240px, 1.5fr)
    repeat(3, minmax(150px, 1fr))

    which could force the last select outside
    the available width.

    This version allows every column to shrink.
  */

  filterGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    width: "100%",
    minWidth: 0,
  },

  searchWrapper: {
    position: "relative",
    width: "100%",
    minWidth: 0,
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    opacity: "0.65",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "13px 14px 13px 60px",
    borderRadius: "9px",
    border: "1px solid #2b3a52",
    background: "#101722",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },

  filterSelect: {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "9px",
    border: "1px solid #2b3a52",
    background: "#101722",
    color: "#f8fafc",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  clearButton: {
    flexShrink: 0,
    padding: "9px 14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* ----------------------------------------------------------
     RESULTS
  ---------------------------------------------------------- */

  resultsArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  ticketCard: {
    width: "100%",
    padding: "26px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.17)",
    background:
      "linear-gradient(145deg, rgba(20,27,42,0.78), rgba(15,23,35,0.78))",
    boxSizing: "border-box",
  },

  ticketTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
  },

  ticketMain: {
    minWidth: 0,
    flex: "1 1 auto",
  },

  ticketId: {
    marginBottom: "8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.3px",
    color: "#60a5fa",
  },

  ticketTitle: {
    margin: "0",
    fontSize: "21px",
    lineHeight: "1.3",
    fontWeight: "800",
    color: "#f8fafc",
    wordBreak: "break-word",
  },

  ticketBadges: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "8px",
    flexShrink: 0,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  ticketDescription: {
    margin: "20px 0",
    maxWidth: "900px",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#8fa3bf",
    wordBreak: "break-word",
  },

  ticketMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "34px",
    padding: "17px 0",
    borderTop: "1px solid rgba(148,163,184,0.12)",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
  },

  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "110px",
  },

  metaLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    color: "#64748b",
    fontWeight: "700",
  },

  metaValue: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#dbeafe",
  },

  ticketActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "18px",
  },

  editButton: {
    padding: "10px 17px",
    borderRadius: "8px",
    border: "none",
    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 6px 16px rgba(37,99,235,0.20)",
  },

  deleteButton: {
    padding: "10px 17px",
    borderRadius: "8px",
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.08)",
    color: "#f87171",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  /* ----------------------------------------------------------
     LOADING / EMPTY
  ---------------------------------------------------------- */

  stateCard: {
    padding: "60px 25px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.14)",
    background:
      "linear-gradient(145deg, rgba(20,27,42,0.65), rgba(15,23,35,0.65))",
    textAlign: "center",
  },

  loadingDot: {
    width: "10px",
    height: "10px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#60a5fa",
  },

  emptyIcon: {
    marginBottom: "12px",
    fontSize: "28px",
    color: "#64748b",
    opacity: "0.6",
  },

  stateTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  stateText: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#70839f",
    lineHeight: "1.5",
  },

  /* ----------------------------------------------------------
     PAGINATION
  ---------------------------------------------------------- */

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "28px",
  },

  paginationButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: "0.35",
    cursor: "not-allowed",
  },

  paginationText: {
    fontSize: "13px",
    color: "#8fa3bf",
  },
};