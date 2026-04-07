import { SLIDER_KEYS } from '../utils/matchEngine';
import { getMidpoints as getFrameworkMidpoints } from '../utils/aiMatchEngine';

const RESET_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));
const COMMON_LAW_CONTEXT_OPTIONS = [
  { value: null, code: 'none' },
  { value: 'uk', code: 'UK' },
  { value: 'us', code: 'US' },
];
const CIVIL_LAW_CONTEXT_OPTIONS = [
  { value: null, code: 'none' },
  { value: 'de', code: 'DE' },
  { value: 'jp', code: 'JP' },
  { value: 'tw', code: 'TW' },
  { value: 'prc', code: 'PRC', civil: true },
];
const ASSET_TYPE_OPTIONS = [
  { value: 'land' },
  { value: 'movables' },
  { value: 'intangibles' },
];
function getCivilPresetLabel(estate) {
  return (
    estate.displayName ??
    estate.names.de ??
    estate.names.tw ??
    estate.names.prc ??
    estate.names.jp ??
    estate.id
  );
}

function getFillPercentage(value, min, max) {
  const range = max - min;

  if (range <= 0) {
    return 100;
  }

  return ((value - min) / range) * 100;
}

export default function SliderPanel({
  values,
  onChange,
  commonLawEstates,
  civilLawEstates,
  activeCommonLawJurisdiction,
  onCommonLawJurisdictionChange,
  activeCivilJurisdiction,
  onCivilLawJurisdictionChange,
  activeAssetType,
  onAssetTypeChange,
  sliderAnnotations = [],
  sliderBounds = {},
  panelNote = null,
  sliderMeta = [],
  selectedPreset = null,
  lockedArrangement = null,
  onPresetClick,
  onReset,
  arrangementViolations = [],
  closestAlternative = null,
  onOpenViolationModal,
  ui,
  mode = 'property',
  aiFrameworks = [],
}) {
  const annotationsByDimension = sliderAnnotations.reduce(
    (dimensionMap, annotation) => {
      dimensionMap[annotation.dimension] ??= [];
      dimensionMap[annotation.dimension].push(annotation);
      return dimensionMap;
    },
    {}
  );

  const violationsByDimension = arrangementViolations.reduce(
    (dimensionMap, violation) => {
      dimensionMap[violation.dimension] = violation;
      return dimensionMap;
    },
    {}
  );

  function resolveEstateName(estate) {
    return estate.displayName ?? estate.name ?? getCivilPresetLabel(estate);
  }

  function getPresetPillClass(estateId, track, baseClass) {
    const isSelected =
      selectedPreset?.id === estateId && selectedPreset?.track === track;
    const isLocked =
      lockedArrangement?.id === estateId && lockedArrangement?.track === track;
    const classes = [baseClass];
    if (isSelected) classes.push('is-selected');
    if (isLocked) classes.push('is-locked');
    return classes.join(' ');
  }

  function getLockedEstateName() {
    if (!lockedArrangement) return '';
    const estates =
      lockedArrangement.track === 'common' ? commonLawEstates : civilLawEstates;
    const current = estates.find((e) => e.id === lockedArrangement.id);
    return current ? resolveEstateName(current) : resolveEstateName(lockedArrangement.estate);
  }

  function formatViolationMessage() {
    const estateName = getLockedEstateName();

    if (closestAlternative) {
      return ui.sliderPanel.becomeMessage(
        estateName,
        resolveEstateName(closestAlternative.estate)
      );
    }

    return ui.sliderPanel.illegalMessage(estateName);
  }

  return (
    <section className="slider-panel">
      <div className="panel-heading">
        <p className="panel-kicker">{ui.sliderPanel.kicker}</p>
        <h2 className="track-title">{ui.sliderPanel.title}</h2>
        <p className="panel-copy">{ui.sliderPanel.copy}</p>
        {panelNote ? (
          <div
            className="panel-inline-note"
            title={panelNote.detail ?? panelNote.message}
          >
            <span className="panel-inline-note-icon" aria-hidden="true">
              i
            </span>
            <span>{panelNote.message}</span>
          </div>
        ) : null}
      </div>

      {mode === 'property' && (
        <div className="context-stack">
          <div className="context-selector">
            <span className="preset-title">{ui.sliderPanel.commonLawContext}</span>
            <div className="preset-pill-row context-pill-row">
              {COMMON_LAW_CONTEXT_OPTIONS.map(({ value, code }) => {
                const isActive = activeCommonLawJurisdiction === value;
                const label =
                  code === 'none' ? ui.jurisdictionOptions.none : code;

                return (
                  <button
                    key={value ?? 'common-none'}
                    type="button"
                    className={`preset-pill context-pill ${
                      isActive ? 'is-active' : ''
                    }`}
                    aria-pressed={isActive}
                    onClick={() => onCommonLawJurisdictionChange(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="context-selector">
            <span className="preset-title">{ui.sliderPanel.civilLawContext}</span>
            <div className="preset-pill-row context-pill-row">
              {CIVIL_LAW_CONTEXT_OPTIONS.map(({ value, code, civil }) => {
                const isActive = activeCivilJurisdiction === value;
                const label =
                  code === 'none' ? ui.jurisdictionOptions.none : code;

                return (
                  <button
                    key={value ?? 'civil-none'}
                    type="button"
                    className={`preset-pill context-pill ${civil ? 'civil' : ''} ${
                      isActive ? 'is-active' : ''
                    }`}
                    aria-pressed={isActive}
                    onClick={() => onCivilLawJurisdictionChange(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeCivilJurisdiction === 'prc' ? (
            <div className="context-selector">
              <span className="preset-title">{ui.sliderPanel.prcAssetType}</span>
              <div className="preset-pill-row context-pill-row">
                {ASSET_TYPE_OPTIONS.map(({ value }) => {
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
                      {ui.assetTypes[value]}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {mode === 'property' && (
        <div className="preset-stack">
          <div className="preset-section">
            <div className="preset-section-header">
              <span className="preset-title">{ui.sliderPanel.commonLaw}</span>
              <button
                type="button"
                className="reset-button"
                onClick={onReset}
              >
                {ui.sliderPanel.resetAll}
              </button>
            </div>
            <div className="preset-pill-row">
              {commonLawEstates.map((estate) => (
                <button
                  key={estate.id}
                  type="button"
                  className={getPresetPillClass(estate.id, 'common', 'preset-pill')}
                  aria-pressed={
                    (selectedPreset?.id === estate.id && selectedPreset?.track === 'common') ||
                    (lockedArrangement?.id === estate.id && lockedArrangement?.track === 'common')
                  }
                  onClick={() => onPresetClick(estate, 'common')}
                >
                  {estate.name}
                  {lockedArrangement?.id === estate.id &&
                    lockedArrangement?.track === 'common' && (
                      <span className="preset-lock-icon" aria-label="Locked">
                        🔒
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          <div className="preset-section">
            <div className="preset-section-header">
              <span className="preset-title">{ui.sliderPanel.civilLaw}</span>
            </div>
            <div className="preset-pill-row">
              {civilLawEstates.map((estate) => (
                <button
                  key={estate.id}
                  type="button"
                  className={getPresetPillClass(estate.id, 'civil', 'preset-pill civil')}
                  aria-pressed={
                    (selectedPreset?.id === estate.id && selectedPreset?.track === 'civil') ||
                    (lockedArrangement?.id === estate.id && lockedArrangement?.track === 'civil')
                  }
                  onClick={() => onPresetClick(estate, 'civil')}
                >
                  {getCivilPresetLabel(estate)}
                  {lockedArrangement?.id === estate.id &&
                    lockedArrangement?.track === 'civil' && (
                      <span className="preset-lock-icon" aria-label="Locked">
                        🔒
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          {lockedArrangement && (
            <div className="independent-track-note">
              <span className="independent-track-note-icon" aria-hidden="true">i</span>
              <span>{ui.sliderPanel.independentTrackNote}</span>
            </div>
          )}
        </div>
      )}

      {mode === 'ai' && (
        <div className="preset-stack">
          <div className="preset-section">
            <div className="preset-section-header">
              <span className="preset-title">{ui.aiMode.frameworkPresets}</span>
              <button
                type="button"
                className="reset-button"
                onClick={onReset}
              >
                {ui.sliderPanel.resetAll}
              </button>
            </div>
            <div className="preset-pill-row">
              {aiFrameworks
                .filter((f) => !f.special)
                .map((framework) => (
                  <button
                    key={framework.id}
                    type="button"
                    className="preset-pill preset-pill--ai"
                    onClick={() => onChange(getFrameworkMidpoints(framework))}
                  >
                    {framework.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="sliders">
        {sliderMeta.map(({ key, label, lowLabel, highLabel }) => {
          const value = values[key];
          const bounds = sliderBounds[key] ?? { min: 0, max: 100 };
          const fillPct = Math.max(
            0,
            Math.min(100, getFillPercentage(value, bounds.min, bounds.max))
          );
          const boundMarkers = [
            ...(bounds.min > 0
              ? [{ type: 'min', value: bounds.min, label: bounds.min }]
              : []),
            ...(bounds.max < 100
              ? [{ type: 'max', value: bounds.max, label: bounds.max }]
              : []),
          ];
          const rowAnnotations = annotationsByDimension[key] ?? [];
          const violation = violationsByDimension[key] ?? null;

          return (
            <div
              key={key}
              className={`slider-row ${violation ? 'has-violation' : ''}`}
            >
              <div className="slider-header">
                <div className="slider-title-stack">
                  <label className="slider-label" htmlFor={`slider-${key}`}>
                    {label}
                  </label>
                </div>
                <div className="slider-header-tools">
                  <output className="slider-value" htmlFor={`slider-${key}`}>
                    {value}
                  </output>
                </div>
              </div>

              <div className="slider-input-shell">
                <span className="slider-track-base" aria-hidden="true" />

                {boundMarkers.map(({ type, value: markerValue, label: markerLabel }) => (
                  <span
                    key={`${key}-${type}`}
                    className={`slider-bound-marker slider-bound-marker--${type}`}
                    style={{ '--bound-position': `${markerValue}%` }}
                    aria-hidden="true"
                  >
                    <span className="slider-bound-marker-line" />
                    <span className="slider-bound-marker-label">{markerLabel}</span>
                  </span>
                ))}

                <input
                  id={`slider-${key}`}
                  type="range"
                  min={bounds.min}
                  max={bounds.max}
                  value={value}
                  className="slider-input"
                  style={{
                    '--fill-pct': `${fillPct}%`,
                    '--bound-min-pct': `${bounds.min}%`,
                    '--bound-max-pct': `${bounds.max}%`,
                  }}
                  onChange={(event) =>
                    onChange({
                      ...values,
                      [key]: Number(event.target.value),
                    })
                  }
                />
              </div>

              <div className="slider-endpoints">
                <span>{lowLabel}</span>
                <span>{highLabel}</span>
              </div>

              {violation && lockedArrangement && (
                <div className="arrangement-violation-alert">
                  <span className="violation-icon" aria-hidden="true">!</span>
                  <span className="violation-message">
                    {formatViolationMessage(violation)}
                  </span>
                  {onOpenViolationModal && (
                    <button
                      type="button"
                      className="violation-why-button"
                      onClick={() => onOpenViolationModal(key)}
                    >
                      {ui.sliderPanel.whyButton}
                    </button>
                  )}
                </div>
              )}

              {rowAnnotations.length > 0 ? (
                <div className="slider-annotation-list">
                  {rowAnnotations.map(({ message, severity }, index) => (
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
