function isPrcLandContext(jurisdiction, assetType) {
  return jurisdiction === 'prc' && assetType === 'land';
}

const EIGENTUM_PRC_LAND_MESSAGE =
  'PRC land remains state or collective owned, so private land ownership cannot be transferred or inherited.';
const ERBBAURECHT_DURATION_MESSAGE =
  'PRC 建设用地使用权 terms vary by use: residential 70 years, commercial 40, industrial 50.';
const ERBBAURECHT_RENEWAL_MESSAGE =
  'Art. 359 provides automatic residential renewal, but the renewal conditions remain unsettled.';
const HYPOTHEK_PRC_LAND_MESSAGE =
  'In PRC land transactions, the mortgage attaches to the land-use right rather than bare ownership.';

export function resolveEffectiveRanges(estate, jurisdiction, assetType) {
  const resolvedRanges = Object.fromEntries(
    Object.entries(estate.ranges).map(([key, range]) => [key, [...range]])
  );
  const overrides = estate.jurisdictionOverrides?.[jurisdiction]?.[assetType];

  if (!overrides) {
    return resolvedRanges;
  }

  Object.entries(overrides).forEach(([key, range]) => {
    if (key.startsWith('_') || range == null) {
      return;
    }

    resolvedRanges[key] = [...range];
  });

  return resolvedRanges;
}

export function getSliderAnnotations(
  estate,
  jurisdiction,
  assetType,
  sliderValues
) {
  if (!estate || !isPrcLandContext(jurisdiction, assetType)) {
    return [];
  }

  if (estate.id === 'eigentum') {
    return [
      {
        dimension: 'alienation',
        messageId: 'eigentum_prc_land_lock',
        message: EIGENTUM_PRC_LAND_MESSAGE,
        severity: 'locked',
      },
      {
        dimension: 'inheritability',
        messageId: 'eigentum_prc_land_lock',
        message: EIGENTUM_PRC_LAND_MESSAGE,
        severity: 'locked',
      },
    ];
  }

  if (estate.id === 'erbbaurecht') {
    const annotations = [
      {
        dimension: 'duration',
        messageId: 'erbbaurecht_prc_duration',
        message: ERBBAURECHT_DURATION_MESSAGE,
        severity: 'info',
      },
    ];

    if ((sliderValues?.duration ?? 0) >= 60) {
      annotations.push({
        dimension: 'duration',
        messageId: 'erbbaurecht_prc_renewal',
        message: ERBBAURECHT_RENEWAL_MESSAGE,
        severity: 'info',
      });
    }

    return annotations;
  }

  if (estate.id === 'hypothek') {
    return [
      {
        dimension: 'alienation',
        messageId: 'hypothek_prc_land',
        message: HYPOTHEK_PRC_LAND_MESSAGE,
        severity: 'info',
      },
    ];
  }

  return [];
}
