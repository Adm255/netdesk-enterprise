import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  preview: {
    host: "0.0.0.0",
    allowedHosts: ["netdesk-enterprise-1.onrender.com"],
  },
});