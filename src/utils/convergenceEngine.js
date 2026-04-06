const LEVEL_COLOR_MAP = {
  very_high: 'var(--convergence-very-high)',
  high: 'var(--convergence-high)',
  medium: 'var(--convergence-medium)',
  low: 'var(--convergence-low)',
  none: 'var(--convergence-none)',
};

export function computeConvergence(
  commonLawMatches,
  civilLawMatches,
  harmonizationData
) {
  const commonTopMatches = commonLawMatches.slice(0, 3);
  const allCommonById = new Map(
    commonLawMatches.map((match) => [match.estate.id, match])
  );

  return civilLawMatches.slice(0, 3).map((civilMatch) => {
    const civilEstate = civilMatch.estate;
    const harmonized = harmonizationData[civilEstate.id] ?? {};
    const commonLawId =
      harmonized.common_law_id ?? civilEstate.common_law_equivalent ?? null;
    const pairedCommonMatch = commonLawId
      ? allCommonById.get(commonLawId) ?? null
      : null;
    const pairedTopMatch = commonTopMatches.find(
      (match) => match.estate.id === commonLawId
    );

    return {
      civilEstate,
      commonLawEstate: pairedCommonMatch?.estate ?? null,
      level: harmonized.convergence_level ?? 'none',
      message:
        harmonized.message ?? 'No convergence note has been recorded yet.',
      divergence:
        harmonized.divergence ??
        'The civil-law form does not map neatly onto a stable common-law estate.',
      bothInTopN: Boolean(pairedTopMatch),
    };
  });
}

export function getConvergenceColor(level) {
  return LEVEL_COLOR_MAP[level] ?? LEVEL_COLOR_MAP.none;
}
