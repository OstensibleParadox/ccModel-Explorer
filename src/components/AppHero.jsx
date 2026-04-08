import LanguageSwitcher from './LanguageSwitcher';
import ModeSwitcher from './ModeSwitcher';

function AppHero({
  mode,
  locale,
  setLocale,
  setMode,
  showEigenspace,
  setShowEigenspace,
  ui,
}) {
  return (
    <header className="app-hero">
      <div className="hero-shell">
        <div className="hero-copy">
          <p className="hero-kicker">
            {mode === 'ai' ? ui.aiMode.heroKicker : ui.heroKicker}
          </p>
          <h1>ccModel Explorer</h1>
          <p className="hero-text">
            {mode === 'ai' ? ui.aiMode.heroText : ui.heroText}
          </p>
        </div>

        <div className="hero-aside">
          <div className="hero-topbar">
            <LanguageSwitcher locale={locale} onChange={setLocale} ui={ui} />
          </div>
          <ModeSwitcher mode={mode} onChange={setMode} ui={ui} />
          <button
            type="button"
            className={`mode-tab ${showEigenspace ? 'is-active' : ''}`}
            onClick={() => setShowEigenspace((prev) => !prev)}
          >
            {ui.eigenspaceToggle ?? 'Eigenspace View'}
          </button>
          <div className="hero-metrics">
            {mode === 'property' ? (
              <>
                <span className="metric-chip">{ui.heroMetrics.commonLaw}</span>
                <span className="metric-chip">{ui.heroMetrics.civilLaw}</span>
                <span className="metric-chip">{ui.heroMetrics.convergence}</span>
              </>
            ) : (
              <>
                <span className="metric-chip">{ui.aiMode.metrics.frameworks}</span>
                <span className="metric-chip">{ui.aiMode.metrics.violations}</span>
                <span className="metric-chip">{ui.aiMode.metrics.demo}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHero;
