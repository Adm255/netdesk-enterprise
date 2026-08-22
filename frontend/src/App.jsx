import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";
import Users from "./pages/Users";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1e293b",
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/tickets"
          element={
            token ? (
              <Tickets />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users"
          element={
            token ? (
              <Users />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;