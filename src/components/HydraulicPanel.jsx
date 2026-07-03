import "./HydraulicPanel.css";

function HydraulicPanel({ data }) {
  const gaugeHeight = Math.min(92, 58 + (data.head_m - 30) * 10);

  const rows = [
    { label: "Penstock Pressure", value: data.penstockPressure_bar.toFixed(3), unit: "bar", status: "ok" },
    { label: "Hydraulic Pressure", value: data.hydPressure_bar.toFixed(3),    unit: "bar", status: "warn" },
    { label: "Hyd. Oil Level",    value: data.hydOilLevel_cm.toFixed(2),      unit: "cm",  status: "ok" },
    { label: "Flow Rate",         value: data.flowRate_m3s.toFixed(3),        unit: "m³/s", status: data.flowRate_m3s > 0.1 ? "ok" : "warn" },
    { label: "Net Head",          value: data.head_m.toFixed(2),              unit: "m", status: "ok" },
  ];

  return (
    <aside className="card hydraulic-panel">
      <p className="card-eyebrow">Hydraulic Section</p>
      <h2 className="card-heading">Water & Pressure</h2>

      {/* Water gauge */}
      <div className="water-gauge">
        <div className="water-fill" style={{ height: `${gaugeHeight}%` }}>
          <div className="water-surface" />
        </div>
        <span className="gauge-label">{data.head_m.toFixed(1)} m</span>
      </div>

      {/* Data rows */}
      <div className="data-rows">
        {rows.map((row, i) => (
          <div className="data-row" key={i}>
            <div>
              <div className="row-label">{row.label}</div>
              <div className="row-val">
                {row.value} <small>{row.unit}</small>
              </div>
            </div>
            <div className={`status-dot dot-${row.status}`} />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default HydraulicPanel;
