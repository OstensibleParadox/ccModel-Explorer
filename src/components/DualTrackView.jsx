import EstateEngine from './EstateEngine';
import CivilLawEngine from './CivilLawEngine';
import { getConvergenceLevelLabel } from '../i18n';
import { getConvergenceColor } from '../utils/convergenceEngine';

function getCivilDisplayName(estate) {
  return (
    estate.displayName ??
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
  locale,
  ui,
}) {
  return (
    <section className="dual-track-view">
      <div className="dual-track-columns">
        <EstateEngine
          matches={commonLawMatches}
          title={ui.tracks.commonLaw}
          locale={locale}
          ui={ui}
        />
        <CivilLawEngine
          matches={civilLawMatches}
          title={ui.tracks.civilLaw}
          activeJurisdiction={activeJurisdiction}
          locale={locale}
          ui={ui}
        />
      </div>

      <section className="convergence-panel">
        <div className="track-heading">
          <p className="track-kicker">{ui.convergence.kicker}</p>
          <h2 className="track-title">{ui.convergence.title}</h2>
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
                    {getConvergenceLevelLabel(level, locale)}
                  </span>
                  <span
                    className={`convergence-alignment ${
                      bothInTopN ? 'aligned' : 'split'
                    }`}
                  >
                    {bothInTopN ? ui.convergence.aligned : ui.convergence.split}
                  </span>
                </div>

                <p className="convergence-pair">
                  {getCivilDisplayName(civilEstate)} →{' '}
                  {commonLawEstate?.name ?? ui.convergence.noAnalogue}
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
