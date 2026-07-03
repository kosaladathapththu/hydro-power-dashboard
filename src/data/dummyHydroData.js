export const hydroDashboardData = {
  plantName: "Hydro Unit · Monitoring Dashboard",
  connectionStatus: "Online",
  turbineState_raw: 8,

  energyTotal_kWh: 4548592,
  genSpeed_rpm: 498.765,
  penstockPressure_bar: 12.389,
  hydPressure_bar: 160.699,
  hydOilLevel_cm: 35.106,
  genPower_kW: 216.78,

  windTempU_C: 51.6,
  windTempV_C: 50.798,
  windTempW_C: 52.3,

  bearingDE_C: 35.1,
  bearingNDErad_C: 48.918,
  bearingNDEax_C: 65.8,

  headWaterLevel_cm: 301.152,

  genCurrentL1_A: 331.1,
  genCurrentL2_A: 325.45,
  genCurrentL3_A: 322.1,

  chartData: [
    { time: "08:00", power: 150, rpm: 420, pressure: 10.5 },
    { time: "09:00", power: 175, rpm: 455, pressure: 11.2 },
    { time: "10:00", power: 190, rpm: 470, pressure: 11.8 },
    { time: "11:00", power: 216, rpm: 498, pressure: 12.3 },
    { time: "12:00", power: 230, rpm: 520, pressure: 12.8 },
    { time: "13:00", power: 210, rpm: 490, pressure: 12.1 },
  ],

  events: [
    {
      time: "10:22 AM",
      type: "Info",
      message: "Generator speed stable at rated RPM",
    },
    {
      time: "10:48 AM",
      type: "Normal",
      message: "Hydraulic pressure within nominal range",
    },
    {
      time: "11:05 AM",
      type: "Info",
      message: "Power generation active — peak efficiency",
    },
  ],
};