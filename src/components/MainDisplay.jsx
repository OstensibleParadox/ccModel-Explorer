import DualTrackView from './DualTrackView';
import AIFrameworkPanel from './AIFrameworkPanel';

function MainDisplay({
  mode,
  engine,
  state,
  locale,
  ui,
  localizedConvergenceResults,
  localizedInstruments,
  localizedViolations,
  localizedAIFrameworks,
}) {
  return (
    <main className="app-main">
      {mode === 'property' ? (
        <DualTrackView
          commonLawMatches={engine.commonLawMatches}
          civilLawMatches={engine.civilLawMatches}
          convergenceResults={localizedConvergenceResults}
          bothTracksMatch={engine.bothTracksMatch}
          filteredInstruments={localizedInstruments}
          activeJurisdiction={state.activeCivilJurisdiction}
          locale={locale}
          ui={ui}
        />
      ) : (
        <AIFrameworkPanel
          matches={engine.frameworkMatches}
          violations={localizedViolations}
          frameworks={localizedAIFrameworks}
          locale={locale}
          ui={ui}
        />
      )}
    </main>
  );
}

export default MainDisplay;
