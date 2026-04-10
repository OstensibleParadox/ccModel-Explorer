import {
  computeInspectorReport,
  OVERLAP_THRESHOLD,
  sliderValuesToArray,
} from '../utils/eigenProjection.js';

function formatSigned(value) {
  const normalized = Math.abs(value) < 0.05 ? 0 : value;
  return `${normalized >= 0 ? '+' : ''}${normalized.toFixed(1)}`;
}

function resolveCopy(copyValue, fallback, ...args) {
  if (typeof copyValue === 'function') {
    return copyValue(...args);
  }

  return copyValue ?? fallback;
}

export default function EigenInspector({
  overlaps,
  sliderValues,
  basis,
  ui,
  resolveEntityName,
  categoryLabel,
}) {
  const userSliderArray = sliderValuesToArray(sliderValues);
  const inspectorCopy = ui?.eigenspacePanel?.inspector ?? {};

  return (
    <div
      className={`eigen-info-panel ${overlaps.length > 0 ? 'eigen-info-panel--active' : ''}`}
    >
      {overlaps.length > 0 ? (
        <>
          <p className="eigen-iso-label">
            {ui?.eigenspacePanel?.isomorphicTo ??
              'Your configuration is isomorphic to'}:
          </p>
          <ul className="eigen-match-list">
            {overlaps.map(({ entity, distance }) => {
              const report = computeInspectorReport(userSliderArray, entity, basis);
              const distanceRatio = Math.min(distance / OVERLAP_THRESHOLD, 1);
              const distancePercentage = Math.round(distanceRatio * 100);
              const totalExplainedPct = (report.totalExplained * 100).toFixed(0);
              const residualPct = (report.residual * 100).toFixed(0);

              return (
                <li key={entity.id} className="eigen-match-item eigen-match-item--inspector">
                  <div className="eigen-match-item-header">
                    <span className="eigen-match-name">
                      {resolveEntityName(entity)}
                    </span>
                    <span
                      className={`eigen-match-category eigen-match-category--${entity._category}`}
                    >
                      {categoryLabel(entity._category)}
                    </span>
                    <span className="eigen-match-distance">
                      d={distance.toFixed(1)}
                    </span>
                  </div>

                  <div className="eigen-inspector-columns">
                    <div className="eigen-inspector-technical">
                      <div className="eigen-inspector-section">
                        <div className="eigen-inspector-heading">
                          {resolveCopy(
                            inspectorCopy.overlapRule,
                            'Overlap rule'
                          )}
                        </div>
                        <div className="eigen-inspector-subheading">
                          {resolveCopy(
                            inspectorCopy.distanceThreshold,
                            'Distance / threshold'
                          )}
                        </div>
                        <div className="eigen-inspector-distance-bar">
                          <div
                            className="eigen-inspector-distance-fill"
                            style={{ width: `${distanceRatio * 100}%` }}
                          />
                          <span className="eigen-inspector-threshold-marker" />
                        </div>
                        <div className="eigen-inspector-distance-metric">
                          {distance.toFixed(1)} / {OVERLAP_THRESHOLD.toFixed(1)} (
                          {distancePercentage}%)
                        </div>
                      </div>

                      <div className="eigen-inspector-section">
                        <div className="eigen-inspector-heading">
                          {resolveCopy(
                            inspectorCopy.pcSpaceBreakdown,
                            'PC-space breakdown'
                          )}
                        </div>
                        <div className="eigen-inspector-summary">
                          {resolveCopy(
                            inspectorCopy.topVariance,
                            `Top 3 PCs: ${totalExplainedPct}% of variance`,
                            totalExplainedPct
                          )}
                        </div>
                        {report.pcDeltas.map((pcDelta) => (
                          <div
                            key={pcDelta.component}
                            className="eigen-inspector-pc-row"
                          >
                            <span className="eigen-inspector-pc-label">
                              ΔPC{pcDelta.component}
                            </span>
                            <span className="eigen-inspector-pc-value">
                              Δ = {formatSigned(pcDelta.delta)}
                            </span>
                            <span className="eigen-inspector-pc-variance">
                              ({(pcDelta.explainedVarianceRatio * 100).toFixed(0)}%)
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="eigen-inspector-section">
                        <div className="eigen-inspector-residual">
                          {resolveCopy(
                            inspectorCopy.discardedVariance,
                            `Discarded variance (PC4-PC7): ${residualPct}%`,
                            residualPct
                          )}
                        </div>
                        {report.residual > 0.3 ? (
                          <div className="eigen-inspector-residual eigen-inspector-residual--warning">
                            {resolveCopy(
                              inspectorCopy.residualWarning,
                              `3D projection captures only ${totalExplainedPct}% of structural variance; matches may not reflect higher-dimensional differences.`,
                              totalExplainedPct
                            )}
                          </div>
                        ) : null}
                      </div>

                      <div className="eigen-inspector-cosine-secondary">
                        {resolveCopy(
                          inspectorCopy.cosine7D,
                          'Full 7D cosine similarity'
                        )}{' '}
                        (
                        {resolveCopy(
                          inspectorCopy.cosineSecondary,
                          'descriptive, not the trigger mechanism'
                        )}
                        ): <strong>{report.cosine7D.toFixed(3)}</strong>
                      </div>
                    </div>

                    <div className="eigen-inspector-humanities">
                      <h4 className="humanities-title">
                        {resolveCopy(
                          inspectorCopy.humanitiesExplanation?.title,
                          'What does this mean?'
                        )}
                      </h4>
                      
                      <div className="humanities-block">
                        <strong>{resolveCopy(inspectorCopy.overlapRule, 'Overlap rule')}</strong>
                        <p>{resolveCopy(inspectorCopy.humanitiesExplanation?.distance, "The engine plots your custom sliders and the established legal frameworks as dots in a multi-dimensional space. The shorter the 'Distance', the more similar they are.")}</p>
                      </div>

                      <div className="humanities-block">
                        <strong>{resolveCopy(inspectorCopy.pcSpaceBreakdown, 'PC-space breakdown')}</strong>
                        <p>{resolveCopy(inspectorCopy.humanitiesExplanation?.pcBreakdown, "We compress 7 complex dimensions into 3 primary ones (PC1, 2, 3) so they can be drawn on screen. These three capture most of the legal differences.")}</p>
                      </div>

                      <div className="humanities-block">
                        <strong>{resolveCopy(inspectorCopy.discardedVariance, `Discarded variance (PC4-PC7): ${residualPct}%`, residualPct)}</strong>
                        <p>{resolveCopy(inspectorCopy.humanitiesExplanation?.residual, "The 'discarded' part is the nuance lost when flattening a 7-dimensional concept into a 3D picture. If this is high, the shapes might look close here but differ in details.")}</p>
                      </div>

                      <div className="humanities-block">
                        <strong>{resolveCopy(inspectorCopy.cosine7D, 'Full 7D cosine similarity')}</strong>
                        <p>{resolveCopy(inspectorCopy.humanitiesExplanation?.cosine, "A pure mathematical angle comparison between the two 7D shapes, confirming the match without any compression loss.")}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="eigen-no-match">
          {ui?.eigenspacePanel?.noMatch ??
            'Move sliders to explore the eigenspace'}
        </p>
      )}
    </div>
  );
}
