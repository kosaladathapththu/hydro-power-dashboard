# HydroSCADA — Live Monitoring Dashboard

Modern React SCADA dashboard for a hydropower plant with animated Kaplan turbine, live charts, and sensor panels.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
src/
├── data/
│   └── dummyHydroData.js      # Static baseline sensor values
├── services/
│   └── hydroApi.js            # Data fetching (mock or Node-RED)
├── components/
│   ├── Navbar.jsx / .css
│   ├── SummaryStrip.jsx / .css
│   ├── HeroTurbine.jsx / .css  ← animated Kaplan runner SVG
│   ├── HydraulicPanel.jsx / .css
│   ├── ElectricalPanel.jsx / .css
│   ├── TrendSection.jsx / .css
│   └── EventPanel.jsx / .css
├── App.jsx / .css             # Root layout + 3s polling
├── index.css                  # Global reset, variables, keyframes
└── main.jsx                   # Entry point
```

## Connect to Node-RED

Open `src/services/hydroApi.js` and swap the export:

```js
// Comment out the mock export and uncomment:
export const getHydroDashboardData = async () => {
  const response = await fetch("http://YOUR-SERVER-IP:1880/hydro-dashboard");
  return response.json();
};
```

Your Node-RED endpoint should return JSON matching this shape:

```json
{
  "plantName": "...",
  "connectionStatus": "Online",
  "turbineState_raw": 8,
  "genPower_kW": 216.78,
  "genSpeed_rpm": 498.765,
  "energyTotal_kWh": 4548592,
  "penstockPressure_bar": 12.389,
  "hydPressure_bar": 160.699,
  "hydOilLevel_cm": 35.1,
  "headWaterLevel_cm": 301.15,
  "genCurrentL1_A": 331.1,
  "genCurrentL2_A": 325.45,
  "genCurrentL3_A": 322.1,
  "windTempU_C": 51.6,
  "windTempV_C": 50.8,
  "windTempW_C": 52.3,
  "bearingDE_C": 35.1,
  "bearingNDErad_C": 48.9,
  "bearingNDEax_C": 65.8,
  "chartData": [ ... ],
  "events": [ ... ]
}
```

## Polling Interval

Change the 3-second refresh in `App.jsx`:

```js
const interval = setInterval(load, 3000); // change ms here
```