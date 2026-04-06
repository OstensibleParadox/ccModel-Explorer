import EstateEngine from './EstateEngine';
import CivilLawEngine from './CivilLawEngine';
import { getConvergenceColor } from '../utils/convergenceEngine';

function formatConvergenceLevel(level) {
  return level
    .split('_')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function getCivilDisplayName(estate) {
  return (
    estate.names.de ??
    estate.names.tw ??
    estate.names.prc ??
    estate.names.jp ??
    estate.id
  );
}

export default function DualTrackView({
  commonLawMatches,
  civilLawMatches,
  convergenceResults,
  activeJurisdiction,
}) {
  return (
    <section className="dual-track-view">
      <div className="dual-track-columns">
        <EstateEngine matches={commonLawMatches} title="Common Law Track" />
        <CivilLawEngine
          matches={civilLawMatches}
          title="Civil Law Track"
          activeJurisdiction={activeJurisdiction}
        />
      </div>

      <section className="convergence-panel">
        <div className="track-heading">
          <p className="track-kicker">Bridgework</p>
          <h2 className="track-title">Convergence Panel</h2>
        </div>

        <div className="convergence-grid">
          {convergenceResults.map(
            ({
              civilEstate,
              commonLawEstate,
              level,
              message,
              divergence,
              bothInTopN,
            }) => (
              <article
                key={civilEstate.id}
                className="convergence-card"
                style={{ '--level-color': getConvergenceColor(level) }}
              >
                <div className="convergence-header">
                  <span className="convergence-level">
                    <span className="convergence-dot" />
                    {formatConvergenceLevel(level)}
                  </span>
                  <span
                    className={`convergence-alignment ${
                      bothInTopN ? 'aligned' : 'split'
                    }`}
                  >
                    {bothInTopN ? 'Top-3 aligned' : 'Not co-ranked'}
                  </span>
                </div>

                <p className="convergence-pair">
                  {getCivilDisplayName(civilEstate)} to{' '}
                  {commonLawEstate?.name ?? 'No stable common-law analogue'}
                </p>
                <p className="convergence-message">{message}</p>
                <p className="convergence-divergence">{divergence}</p>
              </article>
            )
          )}
        </div>
      </section>
    </section>
  );
}
