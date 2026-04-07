const EIGENTUM_PRC_LAND_MESSAGE =
  'PRC land remains state or collective owned, so private land ownership cannot be transferred or inherited.';
const ERBBAURECHT_DURATION_MESSAGE =
  'PRC 建设用地使用权 terms vary by use: residential 70 years, commercial 40, industrial 50.';
const ERBBAURECHT_RENEWAL_MESSAGE =
  'Art. 359 provides automatic residential renewal, but the renewal conditions remain unsettled.';
const HYPOTHEK_PRC_LAND_MESSAGE =
  'In PRC land transactions, the mortgage attaches to the land-use right rather than bare ownership.';

const EIGENTUM_PRC_MOVABLES_MESSAGE =
  'Unlike land, PRC law recognises full private ownership of movables (Art. 240\u2013241). Alienation and inheritability are unrestricted.';
const PFANDRECHT_PRC_MOVABLES_MESSAGE =
  'PRC movable pledge (\u52a8\u4ea7\u8d28\u62bc, Art. 425) requires physical delivery \u2014 possession is constitutive, not merely preferential.';
const LIUZHIQUAN_PRC_MOVABLES_MESSAGE =
  'Lien (\u7559\u7f6e\u6743, Art. 447) arises by operation of law over movables already in the creditor\u2019s possession. Loss of possession extinguishes the right (Art. 453).';
const HYPOTHEK_PRC_MOVABLES_MESSAGE =
  'PRC allows non-possessory mortgages over movables (\u52a8\u4ea7\u62b5\u62bc, Art. 395). The debtor retains the thing; the mortgage is perfected by registration.';

const EIGENTUM_PRC_INTANGIBLES_MESSAGE =
  'IP \u2018ownership\u2019 in PRC (Art. 123) is structurally distinct from Eigentum: possession is notional, duration is term-limited, and exclusion depends on registration and enforcement.';
const PFANDRECHT_PRC_INTANGIBLES_MESSAGE =
  'Rights pledge over IP (\u6743\u5229\u8d28\u6743, Art. 440\u2013446) replaces physical delivery with registration. The pledge term cannot exceed the underlying IP right\u2019s remaining life.';
const HYPOTHEK_PRC_INTANGIBLES_MESSAGE =
  'IP security interests in PRC are classified as rights pledges (\u6743\u5229\u8d28\u6743) under Art. 440, not as traditional mortgages (\u62b5\u62bc\u6743).';

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
  if (!estate || jurisdiction !== 'prc' || !assetType) {
    return [];
  }

  if (assetType === 'land') {
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

  if (assetType === 'movables') {
    if (estate.id === 'eigentum') {
      return [
        {
          dimension: 'alienation',
          messageId: 'eigentum_prc_movables',
          message: EIGENTUM_PRC_MOVABLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    if (estate.id === 'pfandrecht') {
      return [
        {
          dimension: 'possession',
          messageId: 'pfandrecht_prc_movables',
          message: PFANDRECHT_PRC_MOVABLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    if (estate.id === 'liuzhiquan') {
      return [
        {
          dimension: 'possession',
          messageId: 'liuzhiquan_prc_movables',
          message: LIUZHIQUAN_PRC_MOVABLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    if (estate.id === 'hypothek') {
      return [
        {
          dimension: 'possession',
          messageId: 'hypothek_prc_movables',
          message: HYPOTHEK_PRC_MOVABLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    return [];
  }

  if (assetType === 'intangibles') {
    if (estate.id === 'eigentum') {
      return [
        {
          dimension: 'possession',
          messageId: 'eigentum_prc_intangibles',
          message: EIGENTUM_PRC_INTANGIBLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    if (estate.id === 'pfandrecht') {
      return [
        {
          dimension: 'possession',
          messageId: 'pfandrecht_prc_intangibles',
          message: PFANDRECHT_PRC_INTANGIBLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    if (estate.id === 'hypothek') {
      return [
        {
          dimension: 'duration',
          messageId: 'hypothek_prc_intangibles',
          message: HYPOTHEK_PRC_INTANGIBLES_MESSAGE,
          severity: 'info',
        },
      ];
    }

    return [];
  }

  return [];
}
