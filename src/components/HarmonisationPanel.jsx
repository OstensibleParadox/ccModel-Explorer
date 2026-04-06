const INSTRUMENT_ORDER = ['CISG', 'UNCITRAL', 'UNIDROIT', 'Cape Town'];

export default function HarmonisationPanel({ bothTracksMatch, instruments, ui }) {
  if (!bothTracksMatch) {
    return (
      <section className="harmonisation-panel harmonisation-panel--idle track-panel">
        <div className="track-heading">
          <p className="track-kicker">{ui.harmonisation.kicker}</p>
          <h2 className="track-title">{ui.harmonisation.title}</h2>
        </div>
        <p className="harmonisation-placeholder">
          {ui.harmonisation.idle}
        </p>
      </section>
    );
  }

  const grouped = INSTRUMENT_ORDER.reduce((acc, name) => {
    const group = instruments.filter((entry) => entry.instrument === name);
    if (group.length > 0) acc[name] = group;
    return acc;
  }, {});

  const hasAny = Object.keys(grouped).length > 0;

  return (
    <section className="harmonisation-panel track-panel">
      <div className="track-heading">
        <p className="track-kicker">{ui.harmonisation.kicker}</p>
        <h2 className="track-title">{ui.harmonisation.title}</h2>
      </div>

      {hasAny ? (
        <div className="instrument-groups">
          {INSTRUMENT_ORDER.filter((name) => grouped[name]).map((name) => (
            <div key={name} className="instrument-group">
              <h3 className="instrument-group-name">{name}</h3>
              {grouped[name].map((entry) => (
                <article
                  key={entry.id}
                  className={`instrument-card${entry.isOvershoot ? ' instrument-card--overshoot' : ''}`}
                >
                  {entry.isOvershoot ? (
                    <span className="overshoot-label">{ui.harmonisation.overshoot}</span>
                  ) : null}
                  <div className="instrument-header">
                    <span className="article-badge">{entry.article}</span>
                    <strong className="instrument-title">{entry.title}</strong>
                  </div>
                  <p className="instrument-summary">{entry.summary}</p>
                  <div className="instrument-bridge">
                    <span className="bridge-cl">{entry.bridgesCommonLaw}</span>
                    <span className="bridge-arrow" aria-hidden="true">↔</span>
                    <span className="bridge-civil">{entry.bridgesCivilLaw}</span>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="harmonisation-placeholder">
          {ui.harmonisation.empty}
        </p>
      )}
    </section>
  );
}
