import { hydroDashboardData } from "../data/dummyHydroData";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const jitter = (spread) => (Math.random() - 0.5) * spread;

export const createInitialPlantState = () => ({
  ...hydroDashboardData,
  connectionStatus: "Online",
  operatingMode: "AUTO",
  gateOpening_pct: 68,
  flowRate_m3s: 0,
  head_m: 31.8,
  genSpeed_rpm: 0,
  genPower_kW: 0,
  gridPower_kW: 0,
  inverterEfficiency_pct: 0,
  gridVoltage_V: 400,
  gridFrequency_Hz: 50,
  powerFactor: 0.98,
  breakerClosed: true,
  machineRunning: false,
  energyTotal_kWh: 4548592,
  chartData: [],
  events: [
    { time: new Date().toLocaleTimeString(), type: "Info", message: "Edge controller simulation ready" },
  ],
});

export const stepHydroPlant = (previous, controls) => {
  const running = controls.machineRunning && !controls.emergencyStop;
  const gate = running ? controls.gateOpening_pct : 0;
  const head = clamp(previous.head_m + jitter(0.025), 30.8, 32.4);
  const targetFlow = (gate / 100) * 1.18 * Math.sqrt(head / 31.8);
  const flow = previous.flowRate_m3s + (targetFlow - previous.flowRate_m3s) * 0.22;
  const targetRpm = running ? clamp((flow / 0.8) * 500, 0, 510) : 0;
  const rpm = previous.genSpeed_rpm + (targetRpm - previous.genSpeed_rpm) * 0.18;
  const speedRatio = rpm / 500;
  const turbineEfficiency = clamp(0.9 - Math.abs(0.88 - flow / 1.18) * 0.22, 0.68, 0.91);
  const hydraulicPower = 9.81 * flow * head;
  const generatedPower = running ? hydraulicPower * turbineEfficiency * clamp(speedRatio, 0, 1) : 0;
  const inverterEfficiency = generatedPower > 2 ? clamp(96.8 + generatedPower / 180, 96.8, 98.4) : 0;
  const synchronised = rpm > 480 && Math.abs(rpm / 10 - 50) < 2;
  const gridPower = controls.breakerClosed && synchronised
    ? generatedPower * (inverterEfficiency / 100) * 0.985
    : 0;
  const lineCurrent = gridPower > 0 ? (gridPower * 1000) / (Math.sqrt(3) * 400 * 0.98) : 0;
  const now = new Date();
  const windingBase = 31 + generatedPower * 0.095;

  const point = {
    time: now.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    power: Number(gridPower.toFixed(1)),
    rpm: Number(rpm.toFixed(0)),
    flow: Number(flow.toFixed(2)),
    pressure: Number((head * 0.0981).toFixed(2)),
  };

  return {
    ...previous,
    turbineState_raw: running ? 8 : controls.emergencyStop ? 99 : 2,
    gateOpening_pct: controls.gateOpening_pct,
    machineRunning: running,
    breakerClosed: controls.breakerClosed,
    operatingMode: controls.autoMode ? "AUTO" : "MANUAL",
    flowRate_m3s: flow,
    head_m: head,
    headWaterLevel_cm: head * 100,
    penstockPressure_bar: head * 0.0981 + jitter(0.015),
    hydPressure_bar: running ? 158 + jitter(2) : 22 + jitter(1),
    genSpeed_rpm: rpm,
    genPower_kW: generatedPower,
    gridPower_kW: gridPower,
    inverterEfficiency_pct: inverterEfficiency,
    genVoltage_V: generatedPower > 1 ? 400 + jitter(2) : 0,
    genFrequency_Hz: rpm / 10,
    gridVoltage_V: 400 + jitter(1.4),
    gridFrequency_Hz: 50 + jitter(0.035),
    powerFactor: gridPower > 1 ? 0.98 + jitter(0.006) : 0,
    genCurrentL1_A: clamp(lineCurrent + jitter(1.2), 0, 999),
    genCurrentL2_A: clamp(lineCurrent + jitter(1.2), 0, 999),
    genCurrentL3_A: clamp(lineCurrent + jitter(1.2), 0, 999),
    windTempU_C: windingBase + jitter(0.5),
    windTempV_C: windingBase - 0.8 + jitter(0.5),
    windTempW_C: windingBase + 0.5 + jitter(0.5),
    bearingDE_C: 34 + generatedPower * 0.03 + jitter(0.3),
    bearingNDErad_C: 36 + generatedPower * 0.035 + jitter(0.3),
    bearingNDEax_C: 38 + generatedPower * 0.04 + jitter(0.3),
    energyTotal_kWh: previous.energyTotal_kWh + gridPower / 3600,
    lastUpdated: now.toLocaleTimeString(),
    chartData: [...previous.chartData, point].slice(-24),
  };
};
