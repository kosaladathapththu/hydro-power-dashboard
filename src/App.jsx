import { useEffect, useRef, useState } from "react";
import { createInitialPlantState, stepHydroPlant } from "./services/hydroApi";
import Navbar from "./components/Navbar";
import SummaryStrip from "./components/SummaryStrip";
import PlantProcess from "./components/PlantProcess";
import HydraulicPanel from "./components/HydraulicPanel";
import ElectricalPanel from "./components/ElectricalPanel";
import TrendSection from "./components/TrendSection";
import EventPanel from "./components/EventPanel";
import "./App.css";

function App() {
  const [data, setData] = useState(createInitialPlantState);
  const controlsRef = useRef({ gateOpening_pct: 68, breakerClosed: true, autoMode: true, machineRunning: true, emergencyStop: false });
  useEffect(() => {
    const interval = setInterval(() => setData((previous) => stepHydroPlant(previous, controlsRef.current)), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <Navbar data={data} isRunning={data.machineRunning} />
      <main className="dashboard-body">
        <div className="page-intro">
          <div><p>Mahaweli Hydro Station · Unit 01</p><h1>Generation overview</h1></div>
          <div className="edge-chip"><span /> EDGE-01 · 24 ms latency</div>
        </div>
        <section className="hero-overview">
          <PlantProcess data={data} />
          <aside className="hero-kpis">
            <p className="side-section-label">Live plant output</p>
            <SummaryStrip data={data} isRunning={data.machineRunning} />
          </aside>
        </section>
        <section className="detail-grid">
          <HydraulicPanel data={data} />
          <ElectricalPanel data={data} />
        </section>
        <section className="bottom-grid">
          <TrendSection chartData={data.chartData} />
          <EventPanel events={data.events} />
        </section>
      </main>
    </div>
  );
}

export default App;
