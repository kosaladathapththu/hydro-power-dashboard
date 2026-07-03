import "./SummaryStrip.css";

function SummaryStrip({ data }) {
  const cards = [
    { label: "Grid Export", value: data.gridPower_kW.toFixed(1), unit: "kW", sub: data.breakerClosed ? "Feeding utility grid" : "Grid breaker open", accent: "kpi-power" },
    { label: "Generator Speed", value: data.genSpeed_rpm.toFixed(0), unit: "RPM", sub: data.genSpeed_rpm > 480 ? "Synchronous speed" : "Rotor ramping", accent: "kpi-rpm" },
    { label: "Water Flow", value: data.flowRate_m3s.toFixed(2), unit: "m³/s", sub: `${data.gateOpening_pct}% guide vane`, accent: "kpi-energy" },
    { label: "Total Energy", value: (data.energyTotal_kWh / 1000).toFixed(1), unit: "MWh", sub: "Lifetime export", accent: "kpi-total" },
  ];
  return (
    <section className="summary-strip">
      {cards.map((card) => (
        <div className={`kpi-tile ${card.accent}`} key={card.label}>
          <div className="kpi-label">{card.label}</div>
          <div className="kpi-val">{card.value}<span className="kpi-unit">{card.unit}</span></div>
          <div className="kpi-sub">{card.sub}</div>
        </div>
      ))}
    </section>
  );
}

export default SummaryStrip;
