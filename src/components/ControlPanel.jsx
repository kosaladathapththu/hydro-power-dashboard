import "./ControlPanel.css";

function ControlPanel({ controls, onChange, onStartStop, onEmergency }) {
  return (
    <section className="card control-panel">
      <div className="control-title">
        <div>
          <p className="card-eyebrow">Operator controls</p>
          <h2 className="card-heading">Plant control</h2>
        </div>
        <span className={`mode-chip ${controls.autoMode ? "auto" : ""}`}>{controls.autoMode ? "AUTO" : "MANUAL"}</span>
      </div>

      <label className="gate-control">
        <span><b>Guide vane opening</b><strong>{controls.gateOpening_pct}%</strong></span>
        <input type="range" min="0" max="100" value={controls.gateOpening_pct}
          onChange={(event) => onChange({ gateOpening_pct: Number(event.target.value), autoMode: false })} />
        <div className="range-scale"><span>Closed</span><span>Rated</span><span>100%</span></div>
      </label>

      <div className="control-switches">
        <button className={`switch-row ${controls.breakerClosed ? "selected" : ""}`}
          onClick={() => onChange({ breakerClosed: !controls.breakerClosed })}>
          <span><i /> Grid breaker</span><b>{controls.breakerClosed ? "CLOSED" : "OPEN"}</b>
        </button>
        <button className={`switch-row ${controls.autoMode ? "selected" : ""}`}
          onClick={() => onChange({ autoMode: !controls.autoMode, gateOpening_pct: controls.autoMode ? controls.gateOpening_pct : 68 })}>
          <span><i /> Governor mode</span><b>{controls.autoMode ? "AUTO" : "MANUAL"}</b>
        </button>
      </div>

      <div className="control-actions">
        <button className={controls.machineRunning ? "stop-button" : "start-button"} onClick={onStartStop}>
          <span>{controls.machineRunning ? "■" : "▶"}</span>{controls.machineRunning ? "Stop unit" : "Start unit"}
        </button>
        <button className="estop-button" onClick={onEmergency}>Emergency stop</button>
      </div>
      <p className="control-note">Simulation mode · controls follow safe ramp rates</p>
    </section>
  );
}

export default ControlPanel;

