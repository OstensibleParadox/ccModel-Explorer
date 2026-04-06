export default function ViolationAlert({ violations }) {
  if (!violations || violations.length === 0) return null;

  return (
    <div className="violation-alerts">
      <h2 className="section-title">Doctrinal Violations</h2>
      {violations.map((v) => (
        <div
          key={v.id}
          className={`violation-alert ${v.severity}`}
        >
          <div className="violation-header">
            <span className="violation-icon">
              {v.severity === 'error' ? '\u2716' : '\u26A0'}
            </span>
            <span className="violation-message">{v.message}</span>
            <span className="violation-severity">{v.severity}</span>
          </div>
          <details className="violation-details">
            <summary>Details</summary>
            <p className="violation-explanation">{v.explanation}</p>
            <code className="violation-authority">{v.authority}</code>
          </details>
        </div>
      ))}
    </div>
  );
}
