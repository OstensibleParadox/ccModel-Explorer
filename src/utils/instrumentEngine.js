/**
 * Filter international instrument entries by current slider values.
 * An entry is included when every dimension listed in its `triggers` map
 * has a slider value that falls within the specified [min, max] range.
 * Entries with an empty (or absent) `triggers` map are always included.
 *
 * @param {Record<string, number>} sliders - Current slider values keyed by dimension.
 * @param {Array} instruments - Harmonisation instrument entries from harmonizationInstruments.json.
 * @returns {Array} Filtered instrument entries.
 */
export function filterInstruments(sliders, instruments) {
  return instruments.filter((instrument) => {
    const triggers = instrument.triggers ?? {};

    return Object.entries(triggers).every(([dimension, [min, max]]) => {
      const value = sliders[dimension] ?? 50;
      return value >= min && value <= max;
    });
  });
}
