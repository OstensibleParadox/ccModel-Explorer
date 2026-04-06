import { SLIDER_KEYS, SLIDER_META } from '../utils/matchEngine';

export default function SliderPanel({
  sliderValues,
  lockedSliders,
  onSliderChange,
  onLockToggle,
  estates,
  onPresetClick,
  onReset,
}) {
  return (
    <div className="slider-panel">
      <div className="presets-row">
        <button
          className="preset-pill preset-reset"
          onClick={onReset}
        >
          Reset All
        </button>
        {estates.map((estate) => (
          <button
            key={estate.id}
            className="preset-pill"
            onClick={() => onPresetClick(estate)}
          >
            {estate.name}
          </button>
        ))}
      </div>

      <div className="sliders">
        {SLIDER_KEYS.map((key) => {
          const meta = SLIDER_META[key];
          const value = sliderValues[key];
          const locked = lockedSliders[key];
          const pct = value;

          return (
            <div key={key} className={`slider-row ${locked ? 'locked' : ''}`}>
              <button
                className="lock-toggle"
                onClick={() => onLockToggle(key)}
                title={locked ? 'Unlock' : 'Lock'}
                aria-label={`${locked ? 'Unlock' : 'Lock'} ${meta.label}`}
              >
                {locked ? '\u{1F512}' : '\u{1F513}'}
              </button>

              <div className="slider-label">
                <span className="label-name">{meta.label}</span>
              </div>

              <div className="slider-track-wrapper">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  disabled={locked}
                  onChange={(e) => onSliderChange(key, Number(e.target.value))}
                  className="slider-input"
                  style={{
                    '--fill-pct': `${pct}%`,
                  }}
                />
                <div className="slider-endpoints">
                  <span className="endpoint-low">{meta.low}</span>
                  <span className="endpoint-high">{meta.high}</span>
                </div>
              </div>

              <span className="slider-value">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
