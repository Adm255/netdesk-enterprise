import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.user, response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow} />

      <main style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logo}>N</div>

          <div>
            <div style={styles.brandName}>NetDesk</div>
            <div style={styles.brandSubtitle}>IT Support Management</div>
          </div>
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.welcomeIcon}>
              <span>↗</span>
            </div>

            <p style={styles.eyebrow}>SECURE ACCESS</p>

            <h1 style={styles.title}>Welcome back</h1>

            <p style={styles.subtitle}>
              Sign in to manage support tickets, users, and IT operations.
            </p>
          </div>

          {errorMessage && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>@</span>

                <input
                  type="email"
                  placeholder="admin@netdesk.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>●</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordButton}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                ...(loading ? styles.loginButtonDisabled : {}),
              }}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <span style={styles.arrow}>→</span>
                </>
              )}
            </button>
          </form>

          <div style={styles.security}>
            <span style={styles.lock}>◆</span>
            <span>Secure access to your NetDesk workspace</span>
          </div>
        </section>

        <footer style={styles.footer}>
          <span>NetDesk</span>
          <span style={styles.footerDot}>•</span>
          <span>IT Support Management System</span>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.13), transparent 35%), #090e17",
    color: "#f8fafc",
    boxSizing: "border-box",
    padding: "40px 20px",
  },

  backgroundGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(37,99,235,0.06)",
    filter: "blur(100px)",
    top: "-220px",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },

  container: {
    width: "100%",
    maxWidth: "460px",
    position: "relative",
    zIndex: 1,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "28px",
  },

  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "800",
    boxShadow: "0 10px 25px rgba(37,99,235,0.3)",
  },

  brandName: {
    fontSize: "21px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
  },

  brandSubtitle: {
    marginTop: "2px",
    fontSize: "11px",
    color: "#7185a3",
    letterSpacing: "0.4px",
  },

  card: {
    width: "100%",
    boxSizing: "border-box",
    padding: "36px",
    borderRadius: "20px",
    border: "1px solid rgba(96,165,250,0.14)",
    background:
      "linear-gradient(145deg, rgba(18,27,42,0.98), rgba(12,19,30,0.98))",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02)",
  },

  cardHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },

  welcomeIcon: {
    width: "42px",
    height: "42px",
    margin: "0 auto 18px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(37,99,235,0.12)",
    border: "1px solid rgba(96,165,250,0.18)",
    color: "#60a5fa",
    fontSize: "19px",
    fontWeight: "700",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#60a5fa",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: "0",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.8px",
    color: "#f8fafc",
  },

  subtitle: {
    margin: "10px auto 0",
    maxWidth: "350px",
    color: "#8295b1",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(248,113,113,0.25)",
    background: "rgba(127,29,29,0.18)",
    color: "#fca5a5",
    fontSize: "13px",
  },

  errorIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(248,113,113,0.15)",
    fontSize: "12px",
    fontWeight: "800",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#b8c7dc",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "15px",
    color: "#5f7391",
    fontSize: "13px",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    padding: "0 15px 0 42px",
    borderRadius: "10px",
    border: "1px solid #293950",
    background: "#0d1622",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },

  passwordButton: {
    position: "absolute",
    right: "10px",
    border: "none",
    background: "transparent",
    color: "#6f86a6",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    padding: "7px",
  },

  loginButton: {
    width: "100%",
    height: "48px",
    marginTop: "4px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  loginButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  arrow: {
    fontSize: "18px",
    lineHeight: "1",
  },

  security: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    color: "#617590",
    fontSize: "11px",
  },

  lock: {
    color: "#4f8df7",
    fontSize: "9px",
  },

  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "22px",
    color: "#53657e",
    fontSize: "11px",
  },

  footerDot: {
    color: "#33445c",
  },
};