import { getMidpoints, SLIDER_KEYS, SLIDER_META } from '../utils/matchEngine';

const RESET_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));

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
}) {
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
                onClick={() => onChange(getMidpoints(estate))}
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

          return (
            <div key={key} className="slider-row">
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
