import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardStats } from "../api/dashboard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main style={styles.page}>
          <div style={styles.loadingCard}>
            <div style={styles.spinner} />
            <p>Loading dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Navbar />

        <main style={styles.page}>
          <div style={styles.errorCard}>
            <span style={styles.errorLabel}>SYSTEM ERROR</span>
            <h2>Unable to load dashboard</h2>
            <p>
              Dashboard statistics could not be retrieved. Please try again.
            </p>
          </div>
        </main>
      </>
    );
  }

  const ticketCards = [
    {
      title: "Total Tickets",
      value: stats.tickets.totalTickets,
      description: "All support requests",
      type: "total",
    },
    {
      title: "Open",
      value: stats.tickets.status.open,
      description: "Awaiting action",
      type: "open",
    },
    {
      title: "In Progress",
      value: stats.tickets.status.inProgress,
      description: "Currently being handled",
      type: "progress",
    },
    {
      title: "Resolved",
      value: stats.tickets.status.resolved,
      description: "Successfully resolved",
      type: "resolved",
    },
    {
      title: "Closed",
      value: stats.tickets.status.closed,
      description: "Completed tickets",
      type: "closed",
    },
  ];

  const userCards = [
    {
      title: "Total Users",
      value: stats.users.totalUsers,
      description: "Registered accounts",
      type: "users",
    },
    {
      title: "Active Users",
      value: stats.users.activeUsers,
      description: "Currently active",
      type: "active",
    },
    {
      title: "Technicians",
      value: stats.users.technicians,
      description: "Support team members",
      type: "technicians",
    },
  ];

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        {/* Header */}
        <section style={styles.header}>
          <div>
            <div style={styles.breadcrumb}>NETDESK / OVERVIEW</div>

            <h1 style={styles.title}>Dashboard</h1>

            <p style={styles.subtitle}>
              Monitor support activity, tickets, and users from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Sign out
          </button>
        </section>

        {/* Ticket Overview */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Ticket Overview</h2>
              <p style={styles.sectionDescription}>
                Current status of support requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tickets")}
              style={styles.textButton}
            >
              View all tickets →
            </button>
          </div>

          <div style={styles.ticketGrid}>
            {ticketCards.map((card) => (
              <div
                key={card.title}
                style={{
                  ...styles.statCard,
                  ...styles[`${card.type}Card`],
                }}
              >
                <div style={styles.statHeader}>
                  <span style={styles.statLabel}>{card.title}</span>

                  <span
                    style={{
                      ...styles.indicator,
                      ...styles[`${card.type}Indicator`],
                    }}
                  />
                </div>

                <div style={styles.statValue}>{card.value}</div>

                <p style={styles.statDescription}>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Overview */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>User Overview</h2>
              <p style={styles.sectionDescription}>
                Accounts and support team availability.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/users")}
              style={styles.textButton}
            >
              Manage users →
            </button>
          </div>

          <div style={styles.userGrid}>
            {userCards.map((card) => (
              <div key={card.title} style={styles.userCard}>
                <div style={styles.userIcon}>
                  {card.type === "users"
                    ? "U"
                    : card.type === "active"
                    ? "A"
                    : "T"}
                </div>

                <div style={styles.userContent}>
                  <span style={styles.statLabel}>{card.title}</span>

                  <div style={styles.userValue}>{card.value}</div>

                  <p style={styles.statDescription}>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Quick Actions</h2>
              <p style={styles.sectionDescription}>
                Go directly to the main management areas.
              </p>
            </div>
          </div>

          <div style={styles.actionGrid}>
            <div style={styles.actionCard}>
              <div style={styles.actionIcon}>T</div>

              <div style={styles.actionContent}>
                <span style={styles.actionCategory}>TICKETS</span>

                <h3 style={styles.actionTitle}>Support Tickets</h3>

                <p style={styles.actionText}>
                  Create, assign, update, and track support requests.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/tickets")}
                style={styles.primaryButton}
              >
                Open Tickets
              </button>
            </div>

            <div style={styles.actionCard}>
              <div style={styles.actionIcon}>U</div>

              <div style={styles.actionContent}>
                <span style={styles.actionCategory}>USERS</span>

                <h3 style={styles.actionTitle}>User Management</h3>

                <p style={styles.actionText}>
                  Manage employees, technicians, and system users.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/users")}
                style={styles.primaryButton}
              >
                Open Users
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "42px 32px 72px",
  },

  loadingCard: {
    minHeight: "55vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#94a3b8",
    fontSize: "15px",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #1e293b",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    marginBottom: "14px",
  },

  errorCard: {
    marginTop: "60px",
    padding: "32px",
    border: "1px solid #263449",
    borderRadius: "10px",
    background: "#111827",
  },

  errorLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#f87171",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    paddingBottom: "32px",
    borderBottom: "1px solid #1e293b",
  },

  breadcrumb: {
    marginBottom: "10px",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.4px",
  },

  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "40px",
    lineHeight: "1.15",
    letterSpacing: "-0.8px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
  },

  logoutButton: {
    padding: "9px 16px",
    border: "1px solid #334155",
    borderRadius: "6px",
    background: "#111827",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  section: {
    marginTop: "38px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    color: "#f1f5f9",
    fontSize: "21px",
    lineHeight: "1.3",
    fontWeight: "650",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  textButton: {
    border: "none",
    background: "transparent",
    color: "#60a5fa",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    padding: "4px 0",
  },

  ticketGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "12px",
  },

  statCard: {
    minHeight: "142px",
    padding: "20px",
    border: "1px solid #263449",
    borderRadius: "8px",
    background: "#111827",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.16)",
    borderTopWidth: "2px",
  },

  totalCard: {
    borderTopColor: "#3b82f6",
  },

  openCard: {
    borderTopColor: "#f59e0b",
  },

  progressCard: {
    borderTopColor: "#8b5cf6",
  },

  resolvedCard: {
    borderTopColor: "#22c55e",
  },

  closedCard: {
    borderTopColor: "#64748b",
  },

  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "600",
  },

  indicator: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
  },

  totalIndicator: {
    background: "#3b82f6",
  },

  openIndicator: {
    background: "#f59e0b",
  },

  progressIndicator: {
    background: "#8b5cf6",
  },

  resolvedIndicator: {
    background: "#22c55e",
  },

  closedIndicator: {
    background: "#64748b",
  },

  statValue: {
    marginTop: "18px",
    color: "#f8fafc",
    fontSize: "32px",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  statDescription: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  userGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },

  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minHeight: "118px",
    padding: "20px",
    border: "1px solid #263449",
    borderRadius: "8px",
    background: "#111827",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.14)",
  },

  userIcon: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #334155",
    borderRadius: "7px",
    background: "#172033",
    color: "#60a5fa",
    fontSize: "13px",
    fontWeight: "700",
  },

  userContent: {
    minWidth: 0,
  },

  userValue: {
    marginTop: "5px",
    color: "#f8fafc",
    fontSize: "25px",
    lineHeight: "1",
    fontWeight: "700",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    border: "1px solid #263449",
    borderRadius: "8px",
    background: "#111827",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.14)",
  },

  actionIcon: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "7px",
    background: "#172033",
    border: "1px solid #334155",
    color: "#60a5fa",
    fontSize: "13px",
    fontWeight: "700",
  },

  actionContent: {
    flex: 1,
    minWidth: 0,
  },

  actionCategory: {
    display: "block",
    marginBottom: "5px",
    color: "#60a5fa",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.3px",
  },

  actionTitle: {
    margin: 0,
    color: "#f1f5f9",
    fontSize: "16px",
    fontWeight: "650",
  },

  actionText: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.45",
  },

  primaryButton: {
    flexShrink: 0,
    padding: "9px 14px",
    border: "1px solid #2563eb",
    borderRadius: "6px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};