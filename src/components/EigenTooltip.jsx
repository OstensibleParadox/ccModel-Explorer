export default function EigenTooltip({
  visible,
  x,
  y,
  name,
  category,
  distance,
  categoryLabel,
  distanceLabel,
  featuresLabel,
  features,
}) {
  function formatFeatureValue(value) {
    if (Math.abs(value - Math.round(value)) < 1e-6) {
      return String(Math.round(value));
    }

    return value.toFixed(1);
  }

  return (
    <div
      className="eigen-tooltip"
      style={{
        left: x,
        top: y,
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
      }}
      aria-hidden={!visible}
    >
      {visible ? (
        <>
          <div className="eigen-tooltip-name">{name}</div>
          <div className="eigen-tooltip-meta">
            <span className={`eigen-match-category eigen-match-category--${category}`}>
              {categoryLabel(category)}
            </span>
            <span className="eigen-tooltip-distance">
              {distanceLabel}: {distance.toFixed(1)}
            </span>
          </div>
          {features.length > 0 ? (
            <div className="eigen-tooltip-features">
              <div className="eigen-tooltip-section-label">{featuresLabel}</div>
              <div className="eigen-tooltip-feature-grid">
                {features.map((feature) => (
                  <div key={feature.key} className="eigen-tooltip-feature">
                    <span className="eigen-tooltip-feature-label">
                      {feature.label}
                    </span>
                    <span className="eigen-tooltip-feature-value">
                      {formatFeatureValue(feature.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
