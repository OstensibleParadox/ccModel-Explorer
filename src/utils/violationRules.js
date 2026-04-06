import { SLIDER_KEYS } from './matchEngine';

const RULES = [
  {
    id: 'alienation_without_possession',
    severity: 'error',
    message: 'High alienation without a possessory base is unstable.',
    detail: 'Transfer power is outrunning the holder’s actual control of the thing.',
    condition: (values) => values.alienation > 70 && values.possession < 15,
    bounds: (values) => {
      if (values.possession <= 15) {
        return [{ key: 'alienation', max: 70 }];
      }

      if (values.alienation >= 70) {
        return [{ key: 'possession', min: 15 }];
      }

      return [];
    },
  },
  {
    id: 'exclusion_without_possession',
    severity: 'warning',
    message: 'Strong exclusion with almost no possession is hard to sustain.',
    detail: 'The bundle suggests gatekeeping power without corresponding factual control.',
    condition: (values) => values.exclusion > 70 && values.possession < 15,
  },
  {
    id: 'income_without_use',
    severity: 'warning',
    message: 'Income claims without meaningful use rights look under-specified.',
    detail: 'The bundle extracts fruits while leaving the underlying use relation thin.',
    condition: (values) => values.income > 70 && values.use < 20,
  },
  {
    id: 'full_bundle_without_alienation',
    severity: 'warning',
    message: 'The bundle is near-perpetual and inheritable, but alienation is blocked.',
    detail: 'That pattern resembles ownership stripped of one of its core market incidents.',
    condition: (values) =>
      values.duration > 80 &&
      values.inheritability > 80 &&
      values.alienation < 20,
  },
  {
    id: 'alienation_without_duration',
    severity: 'error',
    message: 'High alienation with almost no duration is incoherent.',
    detail: 'A right that expires immediately cannot support broad transfer power.',
    condition: (values) => values.alienation > 80 && values.duration < 15,
    bounds: (values) => {
      if (values.duration <= 15) {
        return [{ key: 'alienation', max: 80 }];
      }

      if (values.alienation >= 80) {
        return [{ key: 'duration', min: 15 }];
      }

      return [];
    },
  },
  {
    id: 'inheritability_without_duration',
    severity: 'error',
    message: 'Inheritance without durable duration is internally inconsistent.',
    detail: 'The bundle purports to descend even though it barely survives the present holder.',
    condition: (values) => values.inheritability > 70 && values.duration < 15,
    bounds: (values) => {
      if (values.duration <= 15) {
        return [{ key: 'inheritability', max: 70 }];
      }

      if (values.inheritability >= 70) {
        return [{ key: 'duration', min: 15 }];
      }

      return [];
    },
  },
  {
    id: 'art_359_renewal',
    severity: 'info',
    message: 'PRC land-use duration is approaching the Art. 359 renewal zone.',
    detail:
      'Residential renewal is contemplated around the 70-year mark, but the renewal conditions remain unsettled.',
    condition: (values, context) =>
      context.jurisdiction === 'prc' &&
      context.assetType === 'land' &&
      values.duration >= 65 &&
      values.duration <= 75,
  },
  {
    id: 'numerus_clausus_violation',
    severity: 'info',
    message: 'The bundle is legible to common law but resists civil-law numerus clausus categories.',
    detail: 'Civil law matching is weak even though common law still finds a comparatively stable estate form.',
    condition: (values, context) => {
      const topCivil = context.civilLawMatches?.[0]?.score ?? 0;
      const topCommon = context.commonLawMatches?.[0]?.score ?? 0;
      return topCivil < 0.5 && topCommon > 0.7;
    },
  },
  {
    id: 'abstraktionsprinzip_note',
    severity: 'info',
    message: 'The bundle hints at an abstraction-style separation of transfer and possession.',
    detail: 'Alienation is high while possession remains materially lower than the transfer signal.',
    condition: (values) => values.alienation > 60 && values.possession < 40,
  },
];

function createDefaultBounds() {
  return Object.fromEntries(
    SLIDER_KEYS.map((key) => [key, { min: 0, max: 100 }])
  );
}

export function computeSliderBounds(sliderValues, sliderLocks = {}) {
  const mergedBounds = createDefaultBounds();

  RULES.forEach((rule) => {
    if (rule.severity !== 'error' || typeof rule.bounds !== 'function') {
      return;
    }

    rule.bounds(sliderValues).forEach(({ key, min, max }) => {
      const currentBounds = mergedBounds[key] ?? { min: 0, max: 100 };

      mergedBounds[key] = {
        min: min == null ? currentBounds.min : Math.max(currentBounds.min, min),
        max: max == null ? currentBounds.max : Math.min(currentBounds.max, max),
      };
    });
  });

  Object.entries(sliderLocks).forEach(([key, sliderLock]) => {
    if (!sliderLock?.enabled || sliderLock.threshold == null) {
      return;
    }

    const currentBounds = mergedBounds[key] ?? { min: 0, max: 100 };

    mergedBounds[key] = {
      ...currentBounds,
      max: Math.min(currentBounds.max, sliderLock.threshold),
    };
  });

  return mergedBounds;
}

export function checkViolations(
  sliderValues,
  { commonLawMatches, civilLawMatches, jurisdiction, assetType } = {}
) {
  const context = {
    commonLawMatches,
    civilLawMatches,
    jurisdiction,
    assetType,
  };

  return RULES.filter((rule) => rule.condition(sliderValues, context)).map(
    (rule) => {
      const sanitizedRule = { ...rule };
      delete sanitizedRule.condition;
      delete sanitizedRule.bounds;
      return sanitizedRule;
    }
  );
}
