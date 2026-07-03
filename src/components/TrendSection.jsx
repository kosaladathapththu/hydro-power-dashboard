import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "./TrendSection.css";

const tooltipStyle = {
  contentStyle: {
    background: "#061726",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
  },
  labelStyle: { color: "#8ab4c8" },
};

function TrendSection({ chartData }) {
  return (
    <section className="card trend-section">
      <p className="card-eyebrow">Live Trends</p>
      <h2 className="card-heading">Power, RPM & Pressure</h2>

      <div className="trend-grid">
        {/* Power chart */}
        <div className="chart-box">
          <h3>Generated Power (kW)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#5a7a8a" tick={{ fontSize: 10 }} />
              <YAxis stroke="#5a7a8a" tick={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="power"
                stroke="#22d3ee"
                fill="url(#powerFill)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* RPM + Pressure chart */}
        <div className="chart-box">
          <h3>RPM & Pressure</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#5a7a8a" tick={{ fontSize: 10 }} />
              <YAxis stroke="#5a7a8a" tick={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone" dataKey="rpm"
                stroke="#4ade80" strokeWidth={2.5} dot={false}
              />
              <Line
                type="monotone" dataKey="pressure"
                stroke="#fbbf24" strokeWidth={2.5} dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default TrendSection;