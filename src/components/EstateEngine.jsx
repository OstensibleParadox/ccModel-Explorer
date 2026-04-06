import { formatScore } from '../i18n';

export default function EstateEngine({
  matches,
  title,
  limit = 5,
  locale,
  ui,
}) {
  const visibleMatches = matches.slice(0, limit);

  return (
    <section className="track-panel">
      <div className="track-heading">
        <p className="track-kicker">{ui.tracks.ranked}</p>
        <h2 className="track-title">{title}</h2>
      </div>

      <div className="match-card-list">
        {visibleMatches.map(({ estate, score }, index) => (
          <article
            key={estate.id}
            className={`match-card ${index === 0 ? 'top-match' : ''}`}
          >
            <div className="match-header">
              <div>
                <p className="match-rank">{ui.ranks.commonLaw(index + 1)}</p>
                <h3 className="estate-name">{estate.name}</h3>
              </div>
              <span className="match-pct">{formatScore(score, locale)}</span>
            </div>

            <div className="match-bar">
              <div
                className="match-fill"
                style={{ width: `${Math.round(score * 100)}%` }}
              />
            </div>

            <p className="estate-description">{estate.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
