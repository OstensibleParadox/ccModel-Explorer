import { useState } from 'react';
import {
  getMidpointsWithContext,
  SLIDER_KEYS,
} from '../utils/matchEngine';
import { getMidpoints as getFrameworkMidpoints } from '../utils/aiMatchEngine';
import { getCommonLawMidpointsWithContext } from '../utils/commonLawResolver';

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

function normalizeThreshold(value, fallbackValue) {
  const parsed = Number(value);
  const safeValue = Number.isFinite(parsed) ? parsed : fallbackValue;
  return Math.min(100, Math.max(0, Math.round(safeValue)));
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
  sliderLocks = {},
  onSliderLockToggle,
  onSliderLockThresholdChange,
  ui,
  mode = 'property',
  aiFrameworks = [],
  onSliderPreset,
}) {
  const [openLockRows, setOpenLockRows] = useState({});
  const annotationsByDimension = sliderAnnotations.reduce(
    (dimensionMap, annotation) => {
      dimensionMap[annotation.dimension] ??= [];
      dimensionMap[annotation.dimension].push(annotation);
      return dimensionMap;
    },
    {}
  );

  function toggleLockRow(key) {
    setOpenLockRows((currentRows) => ({
      ...currentRows,
      [key]: !currentRows[key],
    }));
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
                onClick={() => onChange(RESET_VALUES)}
              >
                {ui.sliderPanel.resetAll}
              </button>
            </div>
            <div className="preset-pill-row">
              {commonLawEstates.map((estate) => (
                <button
                  key={estate.id}
                  type="button"
                  className="preset-pill"
                  onClick={() =>
                    onChange(
                      getCommonLawMidpointsWithContext(
                        estate,
                        activeCommonLawJurisdiction
                      )
                    )
                  }
                >
                  {estate.name}
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
                  className="preset-pill civil"
                  onClick={() =>
                    onChange(
                      getMidpointsWithContext(
                        estate,
                        activeCivilJurisdiction,
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
      )}

      {mode === 'ai' && (
        <div className="preset-stack">
          <div className="preset-section">
            <div className="preset-section-header">
              <span className="preset-title">Framework Presets</span>
              <button
                type="button"
                className="reset-button"
                onClick={() => onChange(RESET_VALUES)}
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
          const lockedAnnotations = rowAnnotations.filter(
            ({ severity }) => severity === 'locked'
          );
          const infoAnnotations = rowAnnotations.filter(
            ({ severity }) => severity !== 'locked'
          );
          const lockState = sliderLocks[key] ?? {
            enabled: false,
            threshold: null,
          };
          const thresholdValue = normalizeThreshold(lockState.threshold, value);

          return (
            <div
              key={key}
              className={`slider-row ${lockedAnnotations.length ? 'slider-row--locked' : ''}`}
            >
              <div className="slider-header">
                <div className="slider-title-stack">
                  <label className="slider-label" htmlFor={`slider-${key}`}>
                    {label}
                  </label>
                </div>
                <div className="slider-header-tools">
                  {mode === 'property' ? (
                    <button
                      type="button"
                      className={`slider-lock-button ${
                        lockState.enabled ? 'is-enabled' : ''
                      }`}
                      aria-expanded={openLockRows[key] ? 'true' : 'false'}
                      aria-label={`${ui.sliderPanel.lockButton}: ${label}`}
                      onClick={() => toggleLockRow(key)}
                    >
                      🔒
                    </button>
                  ) : null}
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

              {mode === 'property' && (openLockRows[key] || lockState.enabled) ? (
                <div className="slider-lock-controls">
                  <label className="slider-lock-switch">
                    <input
                      type="checkbox"
                      checked={lockState.enabled}
                      onChange={(event) =>
                        onSliderLockToggle(
                          key,
                          event.target.checked,
                          thresholdValue
                        )
                      }
                    />
                    <span className="slider-lock-switch-ui" aria-hidden="true" />
                    <span>{ui.sliderPanel.lockEnable}</span>
                  </label>

                  <label className="slider-lock-threshold">
                    <span>{ui.sliderPanel.lockThreshold}</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      inputMode="numeric"
                      value={thresholdValue}
                      onChange={(event) =>
                        onSliderLockThresholdChange(
                          key,
                          normalizeThreshold(event.target.value, value)
                        )
                      }
                    />
                  </label>
                </div>
              ) : null}

              {lockedAnnotations.length > 0 ? (
                <div className="slider-lock-note-list">
                  {lockedAnnotations.map(({ message }, index) => (
                    <div
                      key={`${key}-lock-${index}-${message}`}
                      className="slider-lock-note"
                    >
                      <span className="slider-lock-indicator" aria-hidden="true" />
                      <span>{message}</span>
                    </div>
                  ))}
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
