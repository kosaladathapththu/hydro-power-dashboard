import "./ElectricalPanel.css";

function getTempColor(v) {
  if (v < 45) return "#22c55e";
  if (v < 60) return "#f59e0b";
  return "#ef4444";
}

function PowerDonut({ power }) {
  const pct = Math.min(100, (power / 300) * 100);
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = (circ * pct) / 100;

  return (
    <svg className="donut-svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx="80" cy="80" r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
      {/* Fill */}
      <circle cx="80" cy="80" r={r} fill="none"
        stroke="url(#donutGrad)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
        transform="rotate(-90 80 80)" />
      {/* Centre text */}
      <text x="80" y="74" textAnchor="middle"
        fontSize="28" fontWeight="800" fill="#f0f9ff">{power.toFixed(0)}</text>
      <text x="80" y="94" textAnchor="middle"
        fontSize="12" fontWeight="700" fill="#22d3ee" letterSpacing="1">kW</text>
      <text x="80" y="112" textAnchor="middle"
        fontSize="10" fill="#8ab4c8">OUTPUT</text>
    </svg>
  );
}

function ElectricalPanel({ data }) {
  const phases = [
    { label: "Current L1", value: data.genCurrentL1_A },
    { label: "Current L2", value: data.genCurrentL2_A },
    { label: "Current L3", value: data.genCurrentL3_A },
  ];

  const temps = [
    { label: "Winding U",       value: data.windTempU_C },
    { label: "Winding V",       value: data.windTempV_C },
    { label: "Winding W",       value: data.windTempW_C },
    { label: "Bearing DE",      value: data.bearingDE_C },
    { label: "Bearing NDE Rad", value: data.bearingNDErad_C },
    { label: "Bearing NDE Ax",  value: data.bearingNDEax_C },
  ];

  return (
    <aside className="card electrical-panel">
      <p className="card-eyebrow">Inverter telemetry</p>
      <h2 className="card-heading">Power quality</h2>

      {/* Power donut */}
      <div className="donut-wrap">
        <PowerDonut power={data.genPower_kW} />
      </div>

      {/* Phase currents */}
      <div className="phase-rows">
        {phases.map((p, i) => (
          <div className="phase-row" key={i}>
            <span>{p.label}</span>
            <strong>{p.value.toFixed(2)} A</strong>
          </div>
        ))}
      </div>

      <div className="power-quality">
        <span><small>Grid voltage</small><b>{data.gridVoltage_V.toFixed(1)} V</b></span>
        <span><small>Frequency</small><b>{data.gridFrequency_Hz.toFixed(2)} Hz</b></span>
        <span><small>Efficiency</small><b>{data.inverterEfficiency_pct.toFixed(1)}%</b></span>
      </div>

      {/* Temperature section */}
      <p className="section-label">Winding & Bearing Temps</p>
      <div className="temp-rows">
        {temps.map((t, i) => (
          <div className="temp-row" key={i}>
            <span>{t.label}</span>
            <div className="temp-right">
              <strong style={{ color: getTempColor(t.value) }}>
                {t.value.toFixed(1)}°C
              </strong>
              <div
                className="temp-bar"
                style={{
                  width: `${Math.min(100, (t.value / 80) * 100)}%`,
                  background: getTempColor(t.value),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ElectricalPanel;
