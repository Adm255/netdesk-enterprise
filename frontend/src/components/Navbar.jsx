import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#ffffff" : "#cccccc",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    backgroundColor:
      location.pathname === path ? "#2563eb" : "transparent",
    fontWeight: "bold",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "18px 40px",
        background: "#111827",
        borderBottom: "1px solid #374151",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginRight: "40px",
          color: "white",
        }}
      >
        NetDesk
      </h2>

      <Link to="/dashboard" style={linkStyle("/dashboard")}>
        Dashboard
      </Link>

      <Link to="/tickets" style={linkStyle("/tickets")}>
        Tickets
      </Link>
    </nav>
  );
}