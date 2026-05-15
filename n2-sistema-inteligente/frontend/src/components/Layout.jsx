import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const links = [
    { to: "/", label: "Camada I — PLN" },
    { to: "/fuzzy", label: "Camada II — Fuzzy" },
    { to: "/recomendacao", label: "Camada III — Recomendação" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        background: "var(--bg2)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--accent)" }}>
          N2 · Sistema Inteligente IMDB
        </span>
        <nav style={{ display: "flex", gap: "0.25rem" }}>
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} style={({ isActive }) => ({
              padding: "0.4rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--text2)",
              background: isActive ? "rgba(232,184,109,0.1)" : "transparent",
              border: isActive ? "1px solid rgba(232,184,109,0.25)" : "1px solid transparent",
              transition: "all 0.15s",
            })}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1, padding: "2rem", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}
