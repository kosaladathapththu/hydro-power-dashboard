import { useEffect, useState } from "react";
import "./PlantProcess.css";

const format = (value, digits = 0) => Number(value || 0).toFixed(digits);

function LiveCallout({ className, title, value, unit, active, onClick, onDoubleClick }) {
  return (
    <button
      className={`twin-callout ${className} ${active ? "active" : ""}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={onDoubleClick ? "Double-click to inspect" : undefined}
    >
      <span><i />{title}</span>
      <strong>{value}<small>{unit}</small></strong>
    </button>
  );
}

function PlantProcess({ data }) {
  const [selected, setSelected] = useState("turbine");
  const [inverterOpen, setInverterOpen] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [lockTurning, setLockTurning] = useState(false);
  const waterActive = data.flowRate_m3s > 0.04;
  const rotating = data.genSpeed_rpm > 15;
  const powerActive = data.gridPower_kW > 1;
  const spinSeconds = Math.max(0.55, 5 - (data.genSpeed_rpm / 500) * 4);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setInverterOpen(false);
        setDoorOpen(false);
        setLockTurning(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const inspectInverter = () => {
    setSelected("inverter");
    setDoorOpen(false);
    setLockTurning(false);
    setInverterOpen(true);
  };

  const operateAllenLock = () => {
    if (lockTurning) return;
    if (doorOpen) {
      setDoorOpen(false);
      window.setTimeout(() => setLockTurning(false), 850);
      return;
    }
    setLockTurning(true);
    window.setTimeout(() => setDoorOpen(true), 520);
    window.setTimeout(() => setLockTurning(false), 1050);
  };

  const equipment = {
    intake: {
      step: "01", name: "Intake & penstock", state: waterActive ? "Flowing" : "Gate closed",
      primary: `${format(data.flowRate_m3s, 2)} m³/s`,
      details: [`${format(data.head_m, 1)} m net head`, `${format(data.penstockPressure_bar, 2)} bar pressure`, `${format(data.gateOpening_pct)}% guide vane`],
    },
    turbine: {
      step: "02", name: "Turbine-generator", state: rotating ? "Rotating" : "Stopped",
      primary: `${format(data.genSpeed_rpm)} RPM`,
      details: [`${format(data.genPower_kW, 1)} kW generated`, `${format(data.genFrequency_Hz, 2)} Hz`, `${format(data.bearingDE_C, 1)}°C bearing`],
    },
    inverter: {
      step: "03", name: "Inverter & controls", state: data.genPower_kW > 1 ? "Conditioning" : "Standby",
      primary: `${format(data.inverterEfficiency_pct, 1)}%`,
      details: [`${format(data.genVoltage_V)} V input`, `${format(data.genCurrentL1_A, 1)} A line current`, `${data.operatingMode} governor`],
    },
    transformer: {
      step: "04", name: "Step-up transformer", state: powerActive ? "Energized" : "Ready",
      primary: `${format(data.gridPower_kW, 1)} kW`,
      details: [`${format(data.gridVoltage_V, 1)} V bus`, `${format(data.gridFrequency_Hz, 2)} Hz grid`, `${format(data.powerFactor, 2)} power factor`],
    },
    grid: {
      step: "05", name: "Utility grid", state: powerActive ? "Exporting" : "Isolated",
      primary: powerActive ? `${format(data.gridPower_kW, 1)} kW` : "0 kW",
      details: [data.breakerClosed ? "Breaker closed" : "Breaker open", `${format(data.energyTotal_kWh / 1000, 1)} MWh lifetime`, data.connectionStatus],
    },
  };

  const item = equipment[selected];

  return (
    <section className="digital-twin-card">
      <div className="twin-heading">
        <div>
          <p className="card-eyebrow">Spatial plant model · live telemetry</p>
          <h2>Hydroelectric digital twin</h2>
        </div>
        <div className="twin-status"><span /> LIVE MODEL <b>{data.lastUpdated || "connecting"}</b></div>
      </div>

      <div className="twin-stage" style={{ "--spin-seconds": `${spinSeconds}s`, "--flow-seconds": `${Math.max(1.1, 3.2 - data.flowRate_m3s * 1.7)}s` }}>
        <img src="/hydro-digital-twin-v1.png" alt="Isometric digital twin of the hydroelectric plant" />
        <div className="twin-vignette" />

        <svg className="twin-routes" viewBox="0 0 1000 563" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="blueGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="greenGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path className="route-base water-route" d="M177 119 C235 151 265 205 318 260 S395 319 463 351" />
          <path className={`route-energy water-route ${waterActive ? "moving" : ""}`} d="M177 119 C235 151 265 205 318 260 S395 319 463 351" filter="url(#blueGlow)" />
          <path className="route-base tail-route" d="M462 382 C386 419 317 472 206 507" />
          <path className={`route-energy tail-route ${waterActive ? "moving" : ""}`} d="M462 382 C386 419 317 472 206 507" filter="url(#blueGlow)" />
          <path className="route-base power-route" d="M526 356 C617 370 660 341 714 296 S785 246 842 235" />
          <path className={`route-energy power-route ${data.genPower_kW > 1 ? "moving" : ""}`} d="M526 356 C617 370 660 341 714 296 S785 246 842 235" filter="url(#greenGlow)" />
          <path className="route-base grid-route" d="M842 235 C856 185 862 137 881 85" />
          <path className={`route-energy grid-route ${powerActive ? "moving" : ""}`} d="M842 235 C856 185 862 137 881 85" filter="url(#greenGlow)" />
        </svg>

        <div className={`machine-pulse ${rotating ? "spinning" : ""}`}><span /><i /></div>
        <div className={`breaker-indicator ${powerActive ? "energized" : ""}`}><i /></div>
        <button
          className="inverter-map-hotspot"
          onClick={() => setSelected("inverter")}
          onDoubleClick={inspectInverter}
          aria-label="Double-click to inspect inverter"
        >
          <i /><span>DOUBLE CLICK TO INSPECT</span>
        </button>

        <LiveCallout className="callout-intake" title="WATER INTAKE" value={format(data.flowRate_m3s, 2)} unit="m³/s" active={selected === "intake"} onClick={() => setSelected("intake")} />
        <LiveCallout className="callout-turbine" title="TURBINE UNIT" value={format(data.genSpeed_rpm)} unit="RPM" active={selected === "turbine"} onClick={() => setSelected("turbine")} />
        <LiveCallout className="callout-inverter" title="INVERTER · DOUBLE CLICK" value={format(data.inverterEfficiency_pct, 1)} unit="%" active={selected === "inverter"} onClick={() => setSelected("inverter")} onDoubleClick={inspectInverter} />
        <LiveCallout className="callout-transformer" title="TRANSFORMER" value={format(data.gridPower_kW, 1)} unit="kW" active={selected === "transformer"} onClick={() => setSelected("transformer")} />
        <LiveCallout className="callout-grid" title="GRID EXPORT" value={format(data.gridPower_kW, 1)} unit="kW" active={selected === "grid"} onClick={() => setSelected("grid")} />

        <div className="twin-water-key"><span className={waterActive ? "flowing" : ""} /> WATER FLOW</div>
        <div className="twin-power-key"><span className={powerActive ? "flowing" : ""} /> POWER FLOW</div>
      </div>

      <div className="equipment-console">
        <div className="equipment-tabs">
          {Object.entries(equipment).map(([key, value]) => (
            <button
              key={key}
              className={selected === key ? "selected" : ""}
              onClick={() => setSelected(key)}
              onDoubleClick={key === "inverter" ? inspectInverter : undefined}
              title={key === "inverter" ? "Double-click to inspect inverter" : undefined}
            >
              <span>{value.step}</span><div><b>{value.name}</b><small>{value.state}</small></div>
            </button>
          ))}
        </div>
        <div className="equipment-inspector">
          <div><span className="inspector-status"><i />{item.state}</span><strong>{item.primary}</strong><small>{item.name}</small></div>
          <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        </div>
      </div>

      {inverterOpen && (
        <div className="inverter-modal" role="dialog" aria-modal="true" aria-label="Inverter internal inspection">
          <button className="modal-backdrop" aria-label="Close inverter inspection" onClick={() => setInverterOpen(false)} />
          <div className="inverter-dialog">
            <div className="inverter-dialog-head">
              <div>
                <p className="card-eyebrow">Equipment inspection · INV-01</p>
                <h3>Power conditioning inverter</h3>
              </div>
              <div className="inverter-head-actions">
                <span className="collecting-badge"><i /> COLLECTING DATA</span>
                <button className="modal-close" onClick={() => setInverterOpen(false)} aria-label="Close">×</button>
              </div>
            </div>

            <div className="inverter-dialog-body">
              <div className="cabinet-zone">
                <div className="cabinet-scene">
                  <div className="cabinet-body">
                    <div className="cabinet-interior">
                      <div className="dc-section">
                        <span className="component-label">DC BUS</span>
                        <i className="busbar positive" /><i className="busbar negative" />
                        <div className="capacitor-bank">{[1,2,3,4].map((n) => <b key={n} />)}</div>
                      </div>
                      <div className="power-section">
                        <span className="component-label">IGBT POWER MODULES</span>
                        <div className="igbt-grid">{[1,2,3,4,5,6].map((n) => <b key={n}><i /></b>)}</div>
                      </div>
                      <div className="control-board">
                        <span className="component-label">DSP CONTROL</span>
                        <b className="processor">DSP</b>
                        <i /><i /><i /><i />
                      </div>
                      <div className="cooling-fans">
                        {[1,2].map((n) => <div className={data.genPower_kW > 1 ? "fan running" : "fan"} key={n}><i /><i /><i /><b /></div>)}
                      </div>
                      <div className="terminal-strip">{[1,2,3,4,5,6,7,8].map((n) => <i key={n} />)}</div>
                      <div className="internal-cables"><i /><i /><i /></div>
                    </div>
                    <div className={`cabinet-door ${doorOpen ? "open" : ""}`}>
                      <div className="door-vents">{[1,2,3,4,5,6,7].map((n) => <i key={n} />)}</div>
                      <div className="door-screen">
                        <span>INV-01</span><b>{format(data.gridPower_kW, 1)}</b><small>kW OUTPUT</small>
                      </div>
                      <div className="door-leds"><i /><i /><i /></div>
                      <div className="door-handle" />
                      <button
                        className={`allen-door-lock ${lockTurning ? "turning" : ""} ${doorOpen ? "unlocked" : ""}`}
                        onClick={operateAllenLock}
                        aria-label={doorOpen ? "Close inverter door" : "Turn Allen key and open inverter door"}
                        title="Click the Allen key to unlock the door"
                      >
                        <span className="lock-bezel"><i /></span>
                        <span className="allen-key"><i /><b /></span>
                        <small>{doorOpen ? "UNLOCKED" : "TURN TO OPEN"}</small>
                      </button>
                      <strong>HYDRO DRIVE</strong>
                    </div>
                  </div>
                </div>
                <p className="cabinet-hint">
                  {doorOpen ? "Door unlocked · click the Allen key again to close" : "Click the Allen key fitted to the door lock"}
                </p>
              </div>

              <div className="inverter-live-panel">
                <div className="panel-heading">
                  <div><span className="live-dot" /> LIVE REGISTERS</div>
                  <small>Updated {data.lastUpdated}</small>
                </div>
                <div className="inverter-metrics">
                  <div><span>Generator input</span><strong>{format(data.genPower_kW, 1)} <small>kW</small></strong><i style={{ "--level": `${Math.min(100, data.genPower_kW / 3)}%` }} /></div>
                  <div><span>DC link voltage</span><strong>{format(data.genVoltage_V * 1.41, 0)} <small>V DC</small></strong><i style={{ "--level": `${Math.min(100, data.genVoltage_V / 5)}%` }} /></div>
                  <div><span>AC output</span><strong>{format(data.gridPower_kW, 1)} <small>kW</small></strong><i style={{ "--level": `${Math.min(100, data.gridPower_kW / 3)}%` }} /></div>
                  <div><span>Line current L1</span><strong>{format(data.genCurrentL1_A, 1)} <small>A</small></strong><i style={{ "--level": `${Math.min(100, data.genCurrentL1_A / 4)}%` }} /></div>
                  <div><span>Conversion efficiency</span><strong>{format(data.inverterEfficiency_pct, 1)} <small>%</small></strong><i style={{ "--level": `${data.inverterEfficiency_pct}%` }} /></div>
                  <div><span>Power factor</span><strong>{format(data.powerFactor, 2)} <small>PF</small></strong><i style={{ "--level": `${data.powerFactor * 100}%` }} /></div>
                </div>

                <div className="phase-monitor">
                  <div className="phase-title"><span>Three-phase output</span><b>{format(data.gridFrequency_Hz, 2)} Hz</b></div>
                  {[
                    ["L1", data.genCurrentL1_A, "#f87171"],
                    ["L2", data.genCurrentL2_A, "#fbbf24"],
                    ["L3", data.genCurrentL3_A, "#60a5fa"],
                  ].map(([phase, current, color]) => (
                    <div className="phase-line" key={phase}>
                      <span style={{ color }}>{phase}</span><i><b style={{ width: `${Math.min(100, current / 4)}%`, background: color }} /></i><strong>{format(current, 1)} A</strong>
                    </div>
                  ))}
                </div>

                <div className="data-collector">
                  <div><span>Protocol</span><b>Modbus TCP</b></div>
                  <div><span>Poll rate</span><b>1 second</b></div>
                  <div><span>Registers</span><b>18 / 18 OK</b></div>
                  <div><span>Gateway</span><b>EDGE-01</b></div>
                </div>
                <div className="inverter-health"><span><i /> No active inverter alarms</span><b>{format(data.windTempU_C, 1)}°C module temp</b></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PlantProcess;
