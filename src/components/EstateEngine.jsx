export default function EstateEngine({ matches }) {
  const top3 = matches.slice(0, 3);

  return (
    <div className="estate-engine">
      <h2 className="section-title">Matching Estates</h2>
      <div className="match-cards">
        {top3.map(({ estate, score }, i) => {
          const pct = Math.round(score * 100);
          const isTop = i === 0;

          return (
            <div
              key={estate.id}
              className={`match-card ${isTop ? 'top-match' : ''}`}
            >
              <div className="match-header">
                <h3 className="estate-name">{estate.name}</h3>
                <span className="match-pct">{pct}%</span>
              </div>

              <div className="match-bar-track">
                <div
                  className="match-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="estate-description">{estate.description}</p>

              {estate.subtypes && (
                <div className="estate-subtypes">
                  {estate.subtypes.map((st) => (
                    <span key={st} className="subtype-tag">{st}</span>
                  ))}
                </div>
              )}

              <div className="estate-authority">
                <code>{estate.key_authority}</code>
              </div>

              {estate.notes && (
                <p className="estate-notes">{estate.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
