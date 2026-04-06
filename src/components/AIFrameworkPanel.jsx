import { formatScore } from '../i18n';

const SEVERITY_ICON = {
  error: '!',
  warning: '~',
};

export default function AIFrameworkPanel({
  matches,
  violations,
  frameworks,
  locale,
  ui,
  limit = 5,
}) {
  const visibleMatches = matches.slice(0, limit);
  const noGovernance = frameworks.find((f) => f.special);

  return (
    <div className="ai-framework-panel">
      <section className="track-panel">
        <div className="track-heading">
          <p className="track-kicker">{ui.aiMode.panelKicker}</p>
          <h2 className="track-title">{ui.aiMode.panelTitle}</h2>
          <p className="ai-panel-subtitle">
            {ui.aiMode.panelSubtitle}
          </p>
        </div>

        {violations.length > 0 && (
          <div className="ai-violation-list">
            {violations.map((v) => (
              <div
                key={v.id}
                className={`ai-violation-chip ai-violation-chip--${v.severity}`}
              >
                <span className="ai-violation-icon" aria-hidden="true">
                  {SEVERITY_ICON[v.severity] ?? 'i'}
                </span>
                <div className="ai-violation-body">
                  <strong className="ai-violation-message">{v.message}</strong>
                  <p className="ai-violation-detail">{v.detail}</p>
                  {v.authority && (
                    <p className="ai-violation-authority">{v.authority}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="match-card-list">
          {visibleMatches.map(({ framework, score }, index) => (
            <article
              key={framework.id}
              className={`match-card ${index === 0 ? 'top-match' : ''}`}
            >
              <div className="match-header">
                <div>
                  <p className="match-rank">{ui.aiMode.ranks.framework(index + 1)}</p>
                  <h3 className="estate-name">{framework.name}</h3>
                </div>
                <span className="match-pct">{formatScore(score, locale)}</span>
              </div>

              <div className="match-bar">
                <div
                  className="match-fill"
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>

              <p className="estate-description">{framework.description}</p>

              {framework.notes && (
                <p className="ai-framework-notes">{framework.notes}</p>
              )}

              {framework.authority && (
                <p className="ai-framework-authority">{framework.authority}</p>
              )}
            </article>
          ))}
        </div>

        {noGovernance && (
          <div className="ai-no-governance-note">
            <span className="ai-no-governance-icon" aria-hidden="true">∅</span>
            <div>
              <strong>{ui.aiMode.noGovernanceLabel}: {noGovernance.name}</strong>
              <p>{noGovernance.notes}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
