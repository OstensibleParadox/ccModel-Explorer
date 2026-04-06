const RULES = [
  {
    id: 'alienation_without_possession',
    severity: 'error',
    message: 'Alienation without possession',
    explanation:
      'Nemo dat quod non habet — one cannot transfer what one does not have. High alienability without a possessory basis lacks doctrinal foundation.',
    authority: 'Nemo dat quod non habet; Sale of Goods Act 1979, s.21',
    condition: (v) => v.alienation > 70 && v.possession < 20,
  },
  {
    id: 'income_without_use_or_management',
    severity: 'error',
    message: 'Income without use or management',
    explanation:
      'Deriving income requires either direct use of the property or management authority over it. Income ex nihilo has no property-law basis.',
    authority: "Honore, 'Ownership' (1961); cf. Street v Mountford [1985]",
    condition: (v) => v.income > 70 && v.use < 20 && v.management < 20,
  },
  {
    id: 'capital_without_possession',
    severity: 'error',
    message: 'Capital disposal without possession',
    explanation:
      'The right to consume, waste, or destroy presupposes physical control over the thing. Capital disposal without possession is doctrinally incoherent.',
    authority: "Honore, 'Ownership' (1961); Merry v Green (1841)",
    condition: (v) => v.capital > 70 && v.possession < 20,
  },
  {
    id: 'exclusion_without_possession',
    severity: 'warning',
    message: 'High exclusion without possession',
    explanation:
      'The right to exclude typically presupposes some possessory interest, though equitable interests may allow limited exclusion.',
    authority: 'Bernstein v Skyviews [1978]; Kelsen v Imperial Tobacco [1957]',
    condition: (v) => v.exclusion > 70 && v.possession < 25,
  },
  {
    id: 'management_without_use',
    severity: 'warning',
    message: 'Management authority divorced from use',
    explanation:
      'Management authority without any use right is unusual and typically seen only in bare trusteeship arrangements.',
    authority: 'Saunders v Vautier (1841); Trustee Act 2000',
    condition: (v) => v.management > 70 && v.use < 15,
  },
  {
    id: 'full_bundle_without_alienation',
    severity: 'warning',
    message: 'Near-complete ownership without alienability',
    explanation:
      'An estate carrying nearly all Honore incidents but lacking transferability resembles historical restraints on alienation, which are generally disfavoured in English law.',
    authority: 'Quia Emptores 1290; Re Holliday [1981]',
    condition: (v) =>
      v.possession > 80 &&
      v.use > 80 &&
      v.management > 80 &&
      v.income > 80 &&
      v.capital > 80 &&
      v.alienation < 20,
  },
  {
    id: 'alienation_without_capital',
    severity: 'warning',
    message: 'Alienation without capital rights',
    explanation:
      'Transferring an interest without underlying capital rights creates fragmented title — the transferee inherits a constrained bundle that may not reflect the transfer price.',
    authority: 'LPA 1925, s.1; Tulk v Moxhay (1848)',
    condition: (v) => v.alienation > 80 && v.capital < 15,
  },
];

/**
 * Check current slider values against property law violation rules.
 * Returns array of triggered violations (may be empty).
 */
export function checkViolations(sliderValues) {
  return RULES.filter((rule) => rule.condition(sliderValues)).map(
    ({ condition, ...rest }) => rest
  );
}
