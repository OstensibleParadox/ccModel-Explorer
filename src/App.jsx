import { useState, useMemo, useCallback } from 'react';
import estates from './data/commonLawEstates.json';
import { computeMatches, getMidpoints, SLIDER_KEYS } from './utils/matchEngine';
import { checkViolations } from './utils/violationRules';
import SliderPanel from './components/SliderPanel';
import EstateEngine from './components/EstateEngine';
import ViolationAlert from './components/ViolationAlert';
import './App.css';

const INITIAL_VALUES = Object.fromEntries(SLIDER_KEYS.map((k) => [k, 50]));
const INITIAL_LOCKS = Object.fromEntries(SLIDER_KEYS.map((k) => [k, false]));

function App() {
  const [sliderValues, setSliderValues] = useState(INITIAL_VALUES);
  const [lockedSliders, setLockedSliders] = useState(INITIAL_LOCKS);

  const matches = useMemo(
    () => computeMatches(sliderValues, estates),
    [sliderValues]
  );

  const violations = useMemo(
    () => checkViolations(sliderValues),
    [sliderValues]
  );

  const handleSliderChange = useCallback((key, value) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleLockToggle = useCallback((key) => {
    setLockedSliders((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handlePresetClick = useCallback(
    (estate) => {
      const midpoints = getMidpoints(estate);
      setSliderValues((prev) => {
        const next = { ...prev };
        for (const key of SLIDER_KEYS) {
          if (!lockedSliders[key]) {
            next[key] = midpoints[key];
          }
        }
        return next;
      });
    },
    [lockedSliders]
  );

  const handleReset = useCallback(() => {
    setSliderValues((prev) => {
      const next = { ...prev };
      for (const key of SLIDER_KEYS) {
        if (!lockedSliders[key]) {
          next[key] = 50;
        }
      }
      return next;
    });
    setLockedSliders(INITIAL_LOCKS);
  }, [lockedSliders]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ccModel Explorer</h1>
        <p className="app-subtitle">
          Interactive property rights visualisation based on the Constraint Cascade Method
        </p>
      </header>

      <main className="app-main">
        <section className="panel-left">
          <SliderPanel
            sliderValues={sliderValues}
            lockedSliders={lockedSliders}
            onSliderChange={handleSliderChange}
            onLockToggle={handleLockToggle}
            estates={estates}
            onPresetClick={handlePresetClick}
            onReset={handleReset}
          />
        </section>

        <section className="panel-right">
          <EstateEngine matches={matches} />
          <ViolationAlert violations={violations} />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Based on the Constraint Cascade Method (Zhang, FAccT 2026)
        </p>
        <p className="license">
          CC BY-SA 4.0
        </p>
      </footer>
    </div>
  );
}

export default App;
