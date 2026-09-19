import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CommandDashboard } from "@/components/command-dashboard";
import "@/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Application root element was not found.");

function App() {
  const path = window.location.pathname;

  // Redirect bare / → /admin
  if (path === "/" || path === "") {
    window.history.replaceState({}, "", "/admin");
    return <CommandDashboard />;
  }

  // Allow /admin
  if (path === "/admin" || path === "/admin/") {
    return <CommandDashboard />;
  }

  // Block everything else — 403 forbidden screen
  return (
    <div style={{
      minHeight: "100vh", background: "#080f1e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <img src="/Nepal_Police_logo.png" alt="Nepal Police" style={{ width: 72, opacity: .7 }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: "#a01c2c", lineHeight: 1 }}>403</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginTop: 8 }}>
          Access Restricted
        </div>
        <div style={{ fontSize: 13, color: "#8a91b0", marginTop: 6 }}>
          This area is only accessible to authorised personnel.
        </div>
        <a href="/admin" style={{
          display: "inline-block", marginTop: 20,
          background: "#a01c2c", color: "#fff",
          padding: "9px 24px", fontWeight: 700, fontSize: 13,
          textDecoration: "none",
        }}>
          Go to Admin Portal
        </a>
      </div>
    </div>
  );
}

createRoot(root).render(<StrictMode><App /></StrictMode>);
