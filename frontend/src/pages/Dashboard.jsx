import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../api/dashboard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!stats) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <button
          style={{ float: "right" }}
          onClick={handleLogout}
        >
          Logout
        </button>

        <h1>NetDesk Dashboard</h1>

        <hr />

        <h2>Tickets</h2>

        <p>Total Tickets: {stats.tickets.totalTickets}</p>
        <p>Open: {stats.tickets.status.open}</p>
        <p>In Progress: {stats.tickets.status.inProgress}</p>
        <p>Resolved: {stats.tickets.status.resolved}</p>
        <p>Closed: {stats.tickets.status.closed}</p>

        <hr />

        <h2>Users</h2>

        <p>Total Users: {stats.users.totalUsers}</p>
        <p>Active Users: {stats.users.activeUsers}</p>
        <p>Technicians: {stats.users.technicians}</p>
      </div>
    </>
  );
}