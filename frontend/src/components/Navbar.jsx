import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenWidth <= 640;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    ...styles.link,
    ...(isActive(path) ? styles.activeLink : {}),
  });

  const mobileLinkStyle = (path) => ({
    ...styles.mobileLink,
    ...(isActive(path) ? styles.mobileActiveLink : {}),
  });

  return (
    <nav style={styles.navbar}>
      <div
        style={{
          ...styles.container,
          padding: isMobile ? "12px 16px" : "13px 24px",
        }}
      >
        {/* BRAND */}
        <Link to="/dashboard" style={styles.brand}>
          <span style={styles.brandIcon}>N</span>

          <span style={styles.brandText}>
            Net<span style={styles.brandAccent}>Desk</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        {!isMobile ? (
          <div style={styles.links}>
            <Link to="/dashboard" style={linkStyle("/dashboard")}>
              Dashboard
            </Link>

            <Link to="/tickets" style={linkStyle("/tickets")}>
              Tickets
            </Link>

            <Link to="/users" style={linkStyle("/users")}>
              Users
            </Link>
          </div>
        ) : (
          /* MOBILE MENU BUTTON */
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            style={styles.menuButton}
          >
            <span
              style={{
                ...styles.menuLine,
                transform: menuOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            />

            <span
              style={{
                ...styles.menuLine,
                opacity: menuOpen ? 0 : 1,
              }}
            />

            <span
              style={{
                ...styles.menuLine,
                transform: menuOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* MOBILE NAVIGATION */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <Link
            to="/dashboard"
            style={mobileLinkStyle("/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            to="/tickets"
            style={mobileLinkStyle("/tickets")}
          >
            Tickets
          </Link>

          <Link
            to="/users"
            style={mobileLinkStyle("/users")}
          >
            Users
          </Link>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    background: "rgba(8, 13, 24, 0.96)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "42px",
    boxSizing: "border-box",
  },

  /* BRAND */
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#f8fafc",
    textDecoration: "none",
    fontSize: "19px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
    whiteSpace: "nowrap",
  },

  brandIcon: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "9px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
  },

  brandText: {
    color: "#f8fafc",
  },

  brandAccent: {
    color: "#60a5fa",
  },

  /* DESKTOP LINKS */
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  link: {
    position: "relative",
    color: "#94a3b8",
    textDecoration: "none",
    padding: "9px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    transition:
      "background 0.2s ease, color 0.2s ease",
  },

  activeLink: {
    color: "#f8fafc",
    background: "rgba(37, 99, 235, 0.16)",
    boxShadow:
      "inset 0 0 0 1px rgba(96, 165, 250, 0.16)",
  },

  /* MOBILE BUTTON */
  menuButton: {
    marginLeft: "auto",
    width: "40px",
    height: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.035)",
    cursor: "pointer",
    padding: 0,
  },

  menuLine: {
    width: "17px",
    height: "2px",
    borderRadius: "999px",
    background: "#e2e8f0",
    transition:
      "transform 0.2s ease, opacity 0.2s ease",
  },

  /* MOBILE MENU */
  mobileMenu: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 16px 16px",
    background: "rgba(8, 13, 24, 0.98)",
    borderTop:
      "1px solid rgba(148, 163, 184, 0.08)",
    boxShadow: "0 12px 26px rgba(0, 0, 0, 0.22)",
  },

  mobileLink: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "4px",
    padding: "11px 13px",
    borderRadius: "8px",
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },

  mobileActiveLink: {
    color: "#f8fafc",
    background: "rgba(37, 99, 235, 0.16)",
    boxShadow:
      "inset 0 0 0 1px rgba(96, 165, 250, 0.16)",
  },
};