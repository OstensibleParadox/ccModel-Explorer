export default function EstateEngine({
  matches,
  title = 'Common Law Track',
  limit = 5,
}) {
  const visibleMatches = matches.slice(0, limit);

  return (
    <section className="track-panel">
      <div className="track-heading">
        <p className="track-kicker">Ranked Matches</p>
        <h2 className="track-title">{title}</h2>
      </div>

      <div className="match-card-list">
        {visibleMatches.map(({ estate, score }, index) => {
          const percentage = Math.round(score * 100);

          return (
            <article
              key={estate.id}
              className={`match-card ${index === 0 ? 'top-match' : ''}`}
            >
              <div className="match-header">
                <div>
                  <p className="match-rank">#{index + 1} common-law fit</p>
                  <h3 className="estate-name">{estate.name}</h3>
                </div>
                <span className="match-pct">{percentage}%</span>
              </div>

              <div className="match-bar">
                <div
                  className="match-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="estate-description">{estate.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
