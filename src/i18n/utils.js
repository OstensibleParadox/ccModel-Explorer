import { LOCALE_TAGS, DEFAULT_LOCALE, LANGUAGE_OPTIONS } from './constants.js';

export function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function mergeDeep(base, overrides) {
  if (!isPlainObject(base)) {
    return overrides ?? base;
  }

  const result = { ...base };

  Object.entries(overrides ?? {}).forEach(([key, value]) => {
    const existing = result[key];

    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = mergeDeep(existing, value);
      return;
    }

    result[key] = value;
  });

  return result;
}

export function isSupportedLocale(value) {
  return LANGUAGE_OPTIONS.some(({ key }) => key === value);
}

export function detectLocale(localeCandidates = []) {
  for (const candidate of localeCandidates) {
    if (!candidate) {
      continue;
    }

    const normalized = candidate.toLowerCase();

    if (normalized.startsWith("zh")) {
      return "zh";
    }

    if (normalized.startsWith("de")) {
      return "de";
    }

    if (normalized.startsWith("ja")) {
      return "ja";
    }
  }

  return DEFAULT_LOCALE;
}

export function getLanguageOption(locale) {
  return (
    LANGUAGE_OPTIONS.find(({ key }) => key === locale) ?? LANGUAGE_OPTIONS[0]
  );
}

export function getLocaleTag(locale) {
  return LOCALE_TAGS[locale] ?? LOCALE_TAGS.en;
}

export function formatScore(score, locale) {
  return new Intl.NumberFormat(getLocaleTag(locale), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(score);
}
