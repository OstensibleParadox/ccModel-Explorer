export default function EigenTooltip({
  visible,
  x,
  y,
  name,
  category,
  distance,
  categoryLabel,
  distanceLabel,
}) {
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
        </>
      ) : null}
    </div>
  );
}
