import "./EventPanel.css";

const badgeClass = {
  Info:   "badge-info",
  Normal: "badge-normal",
  Warn:   "badge-warn",
  Alarm:  "badge-alarm",
};

function EventPanel({ events }) {
  return (
    <section className="card event-panel">
      <p className="card-eyebrow">System Events</p>
      <h2 className="card-heading">Event Log</h2>

      <div className="event-list">
        {events.map((event, i) => (
          <div className="event-row" key={i}>
            <div className="event-time">{event.time}</div>
            <div>
              <span className={`event-badge ${badgeClass[event.type] ?? "badge-info"}`}>
                {event.type}
              </span>
              <p className="event-msg">{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventPanel;
