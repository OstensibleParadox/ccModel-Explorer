import {
  getMidpoints,
  getMidpointsWithContext,
  SLIDER_KEYS,
  SLIDER_META,
} from '../utils/matchEngine';

const RESET_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));
const JURISDICTION_OPTIONS = [
  { value: null, label: 'None' },
  { value: 'de', label: 'DE' },
  { value: 'jp', label: 'JP' },
  { value: 'tw', label: 'TW' },
  { value: 'prc', label: 'PRC', civil: true },
];
const ASSET_TYPE_OPTIONS = [
  { value: 'land', label: 'Land' },
  { value: 'movables', label: 'Movables' },
  { value: 'intangibles', label: 'Intangibles' },
];

function getCivilPresetLabel(estate) {
  return (
    estate.names.de ??
    estate.names.tw ??
    estate.names.prc ??
    estate.names.jp ??
    estate.id
  );
}

export default function SliderPanel({
  values,
  onChange,
  commonLawEstates,
  civilLawEstates,
  activeJurisdiction,
  onJurisdictionChange,
  activeAssetType,
  onAssetTypeChange,
  sliderAnnotations = [],
}) {
  const annotationsByDimension = sliderAnnotations.reduce(
    (dimensionMap, annotation) => {
      dimensionMap[annotation.dimension] ??= [];
      dimensionMap[annotation.dimension].push(annotation);
      return dimensionMap;
    },
    {}
  );

  return (
    <section className="slider-panel">
      <div className="panel-heading">
        <p className="panel-kicker">Bundle Controls</p>
        <h2 className="track-title">Seven-Dimension Slider Matrix</h2>
        <p className="panel-copy">
          Move the bundle directly, or snap to a preset estate and compare
          how both traditions classify the same profile.
        </p>
      </div>

      <div className="context-stack">
        <div className="context-selector">
          <span className="preset-title">Jurisdiction Context</span>
          <div className="preset-pill-row context-pill-row">
            {JURISDICTION_OPTIONS.map(({ value, label, civil }) => {
              const isActive = activeJurisdiction === value;

              return (
                <button
                  key={value ?? 'none'}
                  type="button"
                  className={`preset-pill context-pill ${civil ? 'civil' : ''} ${
                    isActive ? 'is-active' : ''
                  }`}
                  aria-pressed={isActive}
                  onClick={() => onJurisdictionChange(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {activeJurisdiction === 'prc' ? (
          <div className="context-selector">
            <span className="preset-title">PRC Asset Type</span>
            <div className="preset-pill-row context-pill-row">
              {ASSET_TYPE_OPTIONS.map(({ value, label }) => {
                const isActive = activeAssetType === value;

                return (
                  <button
                    key={value}
                    type="button"
                    className={`preset-pill civil context-pill ${
                      isActive ? 'is-active' : ''
                    }`}
                    aria-pressed={isActive}
                    onClick={() => onAssetTypeChange(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="preset-stack">
        <div className="preset-section">
          <div className="preset-section-header">
            <span className="preset-title">Common Law</span>
            <button
              type="button"
              className="reset-button"
              onClick={() => onChange(RESET_VALUES)}
            >
              Reset All
            </button>
          </div>
          <div className="preset-pill-row">
            {commonLawEstates.map((estate) => (
              <button
                key={estate.id}
                type="button"
                className="preset-pill"
                onClick={() => onChange(getMidpoints(estate))}
              >
                {estate.name}
              </button>
            ))}
          </div>
        </div>

        <div className="preset-section">
          <div className="preset-section-header">
            <span className="preset-title">Civil Law</span>
          </div>
          <div className="preset-pill-row">
            {civilLawEstates.map((estate) => (
              <button
                key={estate.id}
                type="button"
                className="preset-pill civil"
                onClick={() =>
                  onChange(
                    getMidpointsWithContext(
                      estate,
                      activeJurisdiction,
                      activeAssetType
                    )
                  )
                }
              >
                {getCivilPresetLabel(estate)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sliders">
        {SLIDER_META.map(({ key, label, lowLabel, highLabel }) => {
          const value = values[key];
          const rowAnnotations = annotationsByDimension[key] ?? [];
          const lockedAnnotation = rowAnnotations.find(
            ({ severity }) => severity === 'locked'
          );
          const infoAnnotations = rowAnnotations.filter(
            ({ severity }) => severity !== 'locked'
          );

          return (
            <div
              key={key}
              className={`slider-row ${lockedAnnotation ? 'slider-row--locked' : ''}`}
            >
              <div className="slider-header">
                <div>
                  <label className="slider-label" htmlFor={`slider-${key}`}>
                    {label}
                  </label>
                </div>
                <output className="slider-value" htmlFor={`slider-${key}`}>
                  {value}
                </output>
              </div>

              <input
                id={`slider-${key}`}
                type="range"
                min="0"
                max="100"
                value={value}
                className="slider-input"
                style={{ '--fill-pct': `${value}%` }}
                onChange={(event) =>
                  onChange({
                    ...values,
                    [key]: Number(event.target.value),
                  })
                }
              />

              <div className="slider-endpoints">
                <span>{lowLabel}</span>
                <span>{highLabel}</span>
              </div>

              {lockedAnnotation ? (
                <div className="slider-lock-note">
                  <span className="slider-lock-indicator" aria-hidden="true" />
                  <span>{lockedAnnotation.message}</span>
                </div>
              ) : null}

              {infoAnnotations.length > 0 ? (
                <div className="slider-annotation-list">
                  {infoAnnotations.map(({ message, severity }, index) => (
                    <div
                      key={`${key}-${index}-${message}`}
                      className={`slider-annotation-chip slider-annotation-chip--${severity}`}
                    >
                      {message}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
