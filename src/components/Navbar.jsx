import "./Navbar.css";

function Navbar({ data, isRunning }) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2C8 7 5 10 5 14a7 7 0 0014 0c0-4-3-7-7-12z" />
            <path d="M9 15a3 3 0 006 0" />
          </svg>
        </div>
        <div>
          <div className="brand-name">Hydro<span>Edge</span></div>
          <div className="brand-sub">Generation Intelligence</div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="status-pill pill-online"><span className="pulse-dot" />{data.connectionStatus}</div>
        <div className={`status-pill ${isRunning ? "pill-running" : "pill-idle"}`}>
          {isRunning ? "● Generating" : "○ Standby"}
        </div>
        <div className="time-chip">Last sync<strong>{data.lastUpdated || "Connecting…"}</strong></div>
      </div>
    </header>
  );
}

export default Navbar;
