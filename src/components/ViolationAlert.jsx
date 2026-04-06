const ICONS = {
  error: '⚠',
  warning: '⚠',
  info: 'ℹ',
};

export default function ViolationAlert({ violations }) {
  if (!violations.length) {
    return null;
  }

  return (
    <section className="violations-panel">
      <div className="track-heading">
        <p className="track-kicker">Doctrinal Checks</p>
        <h2 className="track-title">Violation Alerts</h2>
      </div>

      <div className="violations-list">
        {violations.map((violation) => (
          <article
            key={violation.id}
            className={`violation-alert ${violation.severity}`}
          >
            <span className="violation-icon" aria-hidden="true">
              {ICONS[violation.severity]}
            </span>
            <div className="violation-content">
              <p className="violation-title">{violation.message}</p>
              {violation.detail ? (
                <p className="violation-detail">{violation.detail}</p>
              ) : null}
            </div>
            <span className="violation-badge">{violation.severity}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
