export default function ModeSwitcher({ mode, onChange, ui }) {
  return (
    <div
      className="mode-switcher"
      role="group"
      aria-label={ui.modeSwitcher.aria}
    >
      <button
        type="button"
        className={`mode-tab ${mode === 'property' ? 'is-active' : ''}`}
        aria-pressed={mode === 'property'}
        onClick={() => onChange('property')}
      >
        {ui.modeSwitcher.property}
      </button>
      <button
        type="button"
        className={`mode-tab ${mode === 'ai' ? 'is-active' : ''}`}
        aria-pressed={mode === 'ai'}
        onClick={() => onChange('ai')}
      >
        {ui.modeSwitcher.ai}
      </button>
    </div>
  );
}
