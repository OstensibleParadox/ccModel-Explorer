import { SLIDER_KEYS } from './matchEngine';

// Violation rules for AI Governance mode.
// Slider keys use the underlying property-law names (possession, use, income,
// alienation, exclusion, duration, inheritability) which map to AI governance
// dimensions (autonomy, capabilityScope, valueCapture, transferability,
// accessControl, deploymentPersistence, replicability) in display only.

const AI_RULES = [
  {
    id: 'autonomy_without_accountability',
    severity: 'error',
    message: 'High autonomy with low access control: who is responsible for outputs?',
    detail:
      'This is the AI equivalent of possession without exclusion. If a system acts autonomously but anyone can access it, no party bears clear responsibility for harmful outputs. This is the configuration that Waivers of Agency (Zhang, EiT 2026) identifies as the core governance failure.',
    authority: "Zhang, 'Waivers of Agency in AI Governance' (EiT 2026)",
    condition: (values) => values.possession > 70 && values.exclusion < 20,
  },
  {
    id: 'value_capture_without_accountability',
    severity: 'warning',
    message: 'Extracting value from autonomous system while restricting redistribution.',
    detail:
      'Deployer captures profit from AI outputs but prevents others from replicating or auditing the system. This is fee simple absolute with voluntary hollowing of defensive incidents — enjoying ownership benefits while disclaiming ownership obligations.',
    authority: 'ccModel property law analysis',
    condition: (values) =>
      values.income > 70 && values.possession > 50 && values.alienation < 20,
  },
  {
    id: 'capability_without_constraint',
    severity: 'error',
    message: 'Broad capability with minimal constraints: Maginot Line configuration.',
    detail:
      'A system with wide capability scope but few other constraints is relying on the model\'s own alignment as the sole safety mechanism. This is the Maginot Line — a single defensive layer that, once breached, offers no fallback.',
    authority: "Zhang, 'The Maginot Line Problem' (NeurIPS 2026, submitted)",
    condition: (values) => {
      const lowCount = SLIDER_KEYS.filter((key) => values[key] < 30).length;
      return values.use > 80 && lowCount >= 3;
    },
  },
];

function createDefaultBounds() {
  return Object.fromEntries(
    SLIDER_KEYS.map((key) => [key, { min: 0, max: 100 }])
  );
}

export function computeAISliderBounds() {
  // AI violation rules do not impose hard slider bounds (no 'bounds' property).
  // Return unconstrained defaults.
  return createDefaultBounds();
}

export function checkAIViolations(sliderValues) {
  return AI_RULES.filter((rule) => rule.condition(sliderValues)).map((rule) => {
    const sanitized = { ...rule };
    delete sanitized.condition;
    return sanitized;
  });
}
