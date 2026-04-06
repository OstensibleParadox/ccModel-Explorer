import { useMemo, useState } from 'react';
import commonLawEstates from './data/commonLawEstates.json';
import civilLawEstates from './data/civilLawEstates.json';
import harmonizationData from './data/harmonization.json';
import SliderPanel from './components/SliderPanel';
import DualTrackView from './components/DualTrackView';
import ViolationAlert from './components/ViolationAlert';
import { computeConvergence } from './utils/convergenceEngine';
import {
  computeCivilMatches,
  computeMatches,
  SLIDER_KEYS,
} from './utils/matchEngine';
import { getSliderAnnotations } from './utils/jurisdictionResolver';
import { checkViolations } from './utils/violationRules';
import './App.css';

const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((key) => [key, 50]));

function App() {
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [activeJurisdiction, setActiveJurisdiction] = useState(null);
  const [activeAssetType, setActiveAssetType] = useState(null);

  function handleJurisdictionChange(jurisdiction) {
    const nextJurisdiction =
      activeJurisdiction === jurisdiction ? null : jurisdiction;

    setActiveJurisdiction(nextJurisdiction);

    if (nextJurisdiction !== 'prc') {
      setActiveAssetType(null);
    }
  }

  function handleAssetTypeChange(assetType) {
    setActiveAssetType((currentAssetType) =>
      currentAssetType === assetType ? null : assetType
    );
  }

  const commonLawMatches = useMemo(() => {
    return computeMatches(sliderValues, commonLawEstates);
  }, [sliderValues]);

  const civilLawMatches = useMemo(() => {
    return computeCivilMatches(
      sliderValues,
      civilLawEstates,
      activeJurisdiction,
      activeAssetType
    );
  }, [sliderValues, activeJurisdiction, activeAssetType]);

  const sliderAnnotations = useMemo(() => {
    return getSliderAnnotations(
      civilLawMatches[0]?.estate,
      activeJurisdiction,
      activeAssetType,
      sliderValues
    );
  }, [civilLawMatches, activeJurisdiction, activeAssetType, sliderValues]);

  const convergenceResults = useMemo(() => {
    return computeConvergence(
      commonLawMatches,
      civilLawMatches,
      harmonizationData
    );
  }, [commonLawMatches, civilLawMatches]);

  const violations = useMemo(() => {
    return checkViolations(sliderValues, {
      commonLawMatches,
      civilLawMatches,
      jurisdiction: activeJurisdiction,
      assetType: activeAssetType,
    });
  }, [
    sliderValues,
    commonLawMatches,
    civilLawMatches,
    activeJurisdiction,
    activeAssetType,
  ]);

  return (
    <div className="app-layout">
      <header className="app-hero">
        <div className="hero-shell">
          <div className="hero-copy">
            <p className="hero-kicker">Common Law + Civil Law Dual Track</p>
            <h1>ccModel Explorer</h1>
            <p className="hero-text">
              Tune possession, use, income, alienation, exclusion, duration,
              and inheritability, then compare how the same bundle resolves in
              two property-law traditions.
            </p>
          </div>

          <div className="hero-metrics">
            <span className="metric-chip">13 common-law estates</span>
            <span className="metric-chip">13 civil-law forms</span>
            <span className="metric-chip">Top-3 convergence scan</span>
          </div>
        </div>
      </header>

      <section className="panel-sliders">
        <SliderPanel
          values={sliderValues}
          onChange={setSliderValues}
          commonLawEstates={commonLawEstates}
          civilLawEstates={civilLawEstates}
          activeJurisdiction={activeJurisdiction}
          onJurisdictionChange={handleJurisdictionChange}
          activeAssetType={activeAssetType}
          onAssetTypeChange={handleAssetTypeChange}
          sliderAnnotations={sliderAnnotations}
        />
      </section>

      <main className="app-main">
        <DualTrackView
          commonLawMatches={commonLawMatches}
          civilLawMatches={civilLawMatches}
          convergenceResults={convergenceResults}
          activeJurisdiction={activeJurisdiction}
        />
      </main>

      <ViolationAlert violations={violations} />

      <footer className="app-footer">
        Constraint Cascade Method explorer with cross-tradition estate matching.
      </footer>
    </div>
  );
}

export default App;
