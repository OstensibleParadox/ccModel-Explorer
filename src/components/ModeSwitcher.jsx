export default function ModeSwitcher({ mode, onChange }) {
  return (
    <div className="mode-switcher" role="group" aria-label="Explorer mode">
      <button
        type="button"
        className={`mode-tab ${mode === 'property' ? 'is-active' : ''}`}
        aria-pressed={mode === 'property'}
        onClick={() => onChange('property')}
      >
        Property Law Mode
      </button>
      <button
        type="button"
        className={`mode-tab ${mode === 'ai' ? 'is-active' : ''}`}
        aria-pressed={mode === 'ai'}
        onClick={() => onChange('ai')}
      >
        AI Governance Mode
      </button>
    </div>
  );
}
