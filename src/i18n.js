import { SLIDER_KEYS } from "./utils/matchEngine";

export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "ccmodel-explorer:locale";

const LOCALE_TAGS = {
  en: "en-US",
  zh: "zh-CN",
  de: "de-DE",
  ja: "ja-JP",
};

export const LANGUAGE_OPTIONS = [
  {
    key: "en",
    flag: "🇬🇧",
    nativeLabel: "English",
    shortLabel: "EN",
    htmlLang: "en",
  },
  {
    key: "zh",
    flag: "🇨🇳",
    nativeLabel: "简体中文",
    shortLabel: "中",
    htmlLang: "zh-CN",
  },
  {
    key: "de",
    flag: "🇩🇪",
    nativeLabel: "Deutsch",
    shortLabel: "DE",
    htmlLang: "de",
  },
  {
    key: "ja",
    flag: "🇯🇵",
    nativeLabel: "日本語",
    shortLabel: "日",
    htmlLang: "ja",
  },
];

const UI_COPY = {
  en: {
    languageMenuLabel: "Choose language",
    changeLanguageLabel: "Change language",
    heroKicker: "Common Law + Civil Law Dual Track",
    heroText:
      "Tune possession, use, income, alienation, exclusion, duration, and inheritability, then compare how the same bundle resolves in two property-law traditions.",
    heroMetrics: {
      commonLaw: "13 common-law estates",
      civilLaw: "13 civil-law forms",
      convergence: "Top-3 convergence scan",
    },
    sliderPanel: {
      kicker: "Bundle Controls",
      title: "Seven-Dimension Slider Matrix",
      copy:
        "Move the bundle directly, or snap to a preset estate and compare how both traditions classify the same profile.",
      jurisdictionContext: "Jurisdiction Context",
      prcAssetType: "PRC Asset Type",
      commonLaw: "Common Law",
      civilLaw: "Civil Law",
      resetAll: "Reset All",
    },
    jurisdictionOptions: {
      none: "None",
    },
    assetTypes: {
      land: "Land",
      movables: "Movables",
      intangibles: "Intangibles",
    },
    tracks: {
      ranked: "Ranked Matches",
      commonLaw: "Common Law Track",
      civilLaw: "Civil Law Track",
    },
    ranks: {
      commonLaw: (index) => `#${index} common-law fit`,
      civilLaw: (index) => `#${index} civil-law fit`,
    },
    convergence: {
      kicker: "Bridgework",
      title: "Convergence Panel",
      aligned: "Top-3 aligned",
      split: "Not co-ranked",
      noAnalogue: "No stable common-law analogue",
      levels: {
        very_high: "Very High",
        high: "High",
        medium: "Medium",
        low: "Low",
        none: "None",
      },
    },
    footer:
      "Constraint Cascade Method explorer with cross-tradition estate matching.",
    aria: {
      jurisdictionView: "Jurisdiction view",
      genealogy: "Jurisdiction genealogy chain",
    },
  },
  zh: {
    languageMenuLabel: "选择语言",
    changeLanguageLabel: "切换语言",
    heroKicker: "普通法与大陆法双轨比较",
    heroText:
      "调节占有、使用、收益、处分、排他、存续与继承七个维度，比较同一权利束在两种财产法传统中的落点。",
    heroMetrics: {
      commonLaw: "13 种普通法地产权",
      civilLaw: "13 种大陆法权利形态",
      convergence: "前 3 名收敛扫描",
    },
    sliderPanel: {
      kicker: "权利束控制台",
      title: "七维滑块矩阵",
      copy:
        "你可以直接拖动权利束，也可以一键套用预设权利形态，查看两大传统如何归类同一画像。",
      jurisdictionContext: "法域上下文",
      prcAssetType: "中国大陆资产类型",
      commonLaw: "普通法",
      civilLaw: "大陆法",
      resetAll: "全部重置",
    },
    jurisdictionOptions: {
      none: "无",
    },
    assetTypes: {
      land: "土地",
      movables: "动产",
      intangibles: "无形财产",
    },
    tracks: {
      ranked: "匹配排名",
      commonLaw: "普通法轨道",
      civilLaw: "大陆法轨道",
    },
    ranks: {
      commonLaw: (index) => `#${index} 普通法匹配`,
      civilLaw: (index) => `#${index} 大陆法匹配`,
    },
    convergence: {
      kicker: "桥接观察",
      title: "收敛面板",
      aligned: "前 3 名同步命中",
      split: "未共同入榜",
      noAnalogue: "暂无稳定普通法对应物",
      levels: {
        very_high: "极高",
        high: "高",
        medium: "中",
        low: "低",
        none: "无",
      },
    },
    footer: "Constraint Cascade Method 探索器，专用于跨法系权利形态匹配。",
    aria: {
      jurisdictionView: "法域视图",
      genealogy: "法域谱系链",
    },
  },
  de: {
    languageMenuLabel: "Sprache wählen",
    changeLanguageLabel: "Sprache wechseln",
    heroKicker: "Duale Spur aus Common Law und Zivilrecht",
    heroText:
      "Stelle Besitz, Nutzung, Ertrag, Veräußerung, Ausschluss, Dauer und Vererblichkeit ein und vergleiche, wie dasselbe Bündel in zwei Eigentumstraditionen eingeordnet wird.",
    heroMetrics: {
      commonLaw: "13 Estates des Common Law",
      civilLaw: "13 zivilrechtliche Formen",
      convergence: "Top-3-Konvergenzscan",
    },
    sliderPanel: {
      kicker: "Bündelsteuerung",
      title: "Siebendimensionale Slider-Matrix",
      copy:
        "Verschiebe das Rechtsbündel direkt oder springe auf einen Voreintrag und vergleiche, wie beide Traditionen dasselbe Profil klassifizieren.",
      jurisdictionContext: "Jurisdiktionskontext",
      prcAssetType: "Vermögensart in der VR China",
      commonLaw: "Common Law",
      civilLaw: "Zivilrecht",
      resetAll: "Alles zurücksetzen",
    },
    jurisdictionOptions: {
      none: "Keine",
    },
    assetTypes: {
      land: "Land",
      movables: "Bewegliche Sachen",
      intangibles: "Immaterielle Güter",
    },
    tracks: {
      ranked: "Trefferliste",
      commonLaw: "Common-Law-Spur",
      civilLaw: "Zivilrechtliche Spur",
    },
    ranks: {
      commonLaw: (index) => `#${index} Common-Law-Treffer`,
      civilLaw: (index) => `#${index} Zivilrechtstreffer`,
    },
    convergence: {
      kicker: "Brückenarbeit",
      title: "Konvergenzpanel",
      aligned: "Top 3 deckungsgleich",
      split: "Nicht gemeinsam gerankt",
      noAnalogue: "Kein stabiles Common-Law-Analogon",
      levels: {
        very_high: "Sehr hoch",
        high: "Hoch",
        medium: "Mittel",
        low: "Gering",
        none: "Keine",
      },
    },
    footer:
      "Constraint-Cascade-Method-Explorer für die traditionsübergreifende Zuordnung von Estates.",
    aria: {
      jurisdictionView: "Jurisdiktionsansicht",
      genealogy: "Jurisdiktionskette",
    },
  },
  ja: {
    languageMenuLabel: "言語を選択",
    changeLanguageLabel: "言語を切り替え",
    heroKicker: "コモンローと大陸法のデュアルトラック",
    heroText:
      "占有・使用・収益・譲渡・排除・存続・相続可能性の七次元を調整し、同じ権利束が二つの財産法伝統でどう位置づけられるかを比べます。",
    heroMetrics: {
      commonLaw: "13件のコモンロー estate",
      civilLaw: "13件の大陸法形態",
      convergence: "上位3件の収斂スキャン",
    },
    sliderPanel: {
      kicker: "権利束コントロール",
      title: "七次元スライダーマトリクス",
      copy:
        "権利束を直接動かすことも、プリセットを呼び出して両法系が同じプロフィールをどう分類するかを見ることもできます。",
      jurisdictionContext: "法域コンテクスト",
      prcAssetType: "中国本土の資産類型",
      commonLaw: "コモンロー",
      civilLaw: "大陸法",
      resetAll: "すべてリセット",
    },
    jurisdictionOptions: {
      none: "なし",
    },
    assetTypes: {
      land: "土地",
      movables: "動産",
      intangibles: "無形財産",
    },
    tracks: {
      ranked: "ランキング",
      commonLaw: "コモンロートラック",
      civilLaw: "大陸法トラック",
    },
    ranks: {
      commonLaw: (index) => `#${index} コモンロー適合`,
      civilLaw: (index) => `#${index} 大陸法適合`,
    },
    convergence: {
      kicker: "ブリッジワーク",
      title: "収斂パネル",
      aligned: "上位3件で一致",
      split: "順位が一致しない",
      noAnalogue: "安定したコモンロー対応物なし",
      levels: {
        very_high: "非常に高い",
        high: "高い",
        medium: "中程度",
        low: "低い",
        none: "なし",
      },
    },
    footer: "Constraint Cascade Method による法系横断 estate 対応探索器。",
    aria: {
      jurisdictionView: "法域ビュー",
      genealogy: "法域系譜チェーン",
    },
  },
};

const SLIDER_META_COPY = {
  en: {
    possession: {
      label: "Possession",
      lowLabel: "No factual control",
      highLabel: "Exclusive physical control",
    },
    use: {
      label: "Use",
      lowLabel: "No beneficial use",
      highLabel: "Broad beneficial use",
    },
    income: {
      label: "Income",
      lowLabel: "No fruits or revenue",
      highLabel: "Full income capture",
    },
    alienation: {
      label: "Alienation",
      lowLabel: "Non-transferable",
      highLabel: "Freely transferable",
    },
    exclusion: {
      label: "Exclusion",
      lowLabel: "Cannot exclude others",
      highLabel: "Strong exclusion power",
    },
    duration: {
      label: "Duration",
      lowLabel: "Ephemeral or revocable",
      highLabel: "Perpetual or near-perpetual",
    },
    inheritability: {
      label: "Inheritability",
      lowLabel: "Dies with holder",
      highLabel: "Fully descendible",
    },
  },
  zh: {
    possession: {
      label: "占有",
      lowLabel: "无事实控制",
      highLabel: "排他性物理控制",
    },
    use: {
      label: "使用",
      lowLabel: "无受益使用",
      highLabel: "广泛受益使用",
    },
    income: {
      label: "收益",
      lowLabel: "无孳息或收入",
      highLabel: "完整收益取得",
    },
    alienation: {
      label: "处分",
      lowLabel: "不可转让",
      highLabel: "可自由转让",
    },
    exclusion: {
      label: "排他",
      lowLabel: "不能排除他人",
      highLabel: "强排他权能",
    },
    duration: {
      label: "存续",
      lowLabel: "短暂或可撤销",
      highLabel: "永久或近乎永久",
    },
    inheritability: {
      label: "继承",
      lowLabel: "随权利人死亡而消灭",
      highLabel: "可完全继承",
    },
  },
  de: {
    possession: {
      label: "Besitz",
      lowLabel: "Keine tatsächliche Herrschaft",
      highLabel: "Exklusive Sachherrschaft",
    },
    use: {
      label: "Nutzung",
      lowLabel: "Keine wirtschaftliche Nutzung",
      highLabel: "Weite wirtschaftliche Nutzung",
    },
    income: {
      label: "Ertrag",
      lowLabel: "Keine Früchte oder Einnahmen",
      highLabel: "Volle Ertragsabschöpfung",
    },
    alienation: {
      label: "Veräußerung",
      lowLabel: "Nicht übertragbar",
      highLabel: "Frei übertragbar",
    },
    exclusion: {
      label: "Ausschluss",
      lowLabel: "Kein Ausschluss Dritter",
      highLabel: "Starke Ausschlussmacht",
    },
    duration: {
      label: "Dauer",
      lowLabel: "Flüchtig oder widerruflich",
      highLabel: "Dauerhaft oder nahezu ewig",
    },
    inheritability: {
      label: "Vererblichkeit",
      lowLabel: "Erlischt mit dem Inhaber",
      highLabel: "Voll vererblich",
    },
  },
  ja: {
    possession: {
      label: "占有",
      lowLabel: "事実的支配なし",
      highLabel: "排他的な物理的支配",
    },
    use: {
      label: "使用",
      lowLabel: "受益的使用なし",
      highLabel: "広い受益的使用",
    },
    income: {
      label: "収益",
      lowLabel: "果実・収入なし",
      highLabel: "全面的な収益取得",
    },
    alienation: {
      label: "譲渡",
      lowLabel: "譲渡不可",
      highLabel: "自由に譲渡可能",
    },
    exclusion: {
      label: "排除",
      lowLabel: "他人を排除できない",
      highLabel: "強い排除権能",
    },
    duration: {
      label: "存続",
      lowLabel: "短命または取消可能",
      highLabel: "永久またはそれに近い",
    },
    inheritability: {
      label: "相続可能性",
      lowLabel: "権利者とともに消滅",
      highLabel: "全面的に相続可能",
    },
  },
};

const COMMON_LAW_TEXT = {
  zh: {
    fee_simple_absolute: {
      name: "绝对完全所有地产权",
      description:
        "普通法中的基准所有地产权：控制、排他、转让与继承都极强，内部没有时间上限。",
    },
    fee_simple_defeasible: {
      name: "附条件完全所有地产权",
      description:
        "附条件或附终止事由的所有地产权，整体仍然强势，但在存续稳定性与可交易性上弱于绝对完全所有地产权。",
    },
    life_estate: {
      name: "终身地产权",
      description:
        "以一人寿命为期限的占有性地产权；在存续期间使用和控制强，但不能形成可继承的长期权利。",
    },
    leasehold: {
      name: "租赁地产权",
      description:
        "以期限为核心的占有性地产权，给予排他占用与使用，但受租期、约款和出租人回复权限制。",
    },
    licence: {
      name: "许可占用",
      description:
        "仅是进入或使用他人财产的许可，不形成物权性地产权；期限脆弱、排他性弱、通常不可转让。",
    },
    easement: {
      name: "地役权",
      description:
        "对他人土地的有限非占有性权利，通常持续且可继承，但使用范围狭窄、排他性极弱。",
    },
    restrictive_covenant: {
      name: "限制性约款",
      description:
        "对土地利用的持续性负担；自身占有和使用很低，但可通过限制他人利用产生较强排他效果。",
    },
    mortgage: {
      name: "抵押权",
      description:
        "以担保和实现债权为中心的财产负担；日常使用很弱，但在期限、转让和违约价值实现上具有意义。",
    },
    trust_beneficial: {
      name: "信托受益权益",
      description:
        "信托中受益人的衡平法利益；经济收益强，但相较于法定权源，直接占有、排他和处分较弱。",
    },
    adverse_possession: {
      name: "逆权占有",
      description:
        "时效完成前的先占状态；事实控制与排他性强，但在完成法定期间前并无正式权源。",
    },
    profit_a_prendre: {
      name: "采收益权",
      description:
        "从他人土地中取走矿产、木材等价值的权利；占有较窄、使用中等、收益能力强，且可持续传递。",
    },
    fee_tail: {
      name: "限定继承地产权（历史）",
      description:
        "历史上的限定继承地产权：占有、使用和存续都强，但为了维持血统传承，处分权几乎被压到零。",
    },
    future_interest: {
      name: "未来权益（余留权/回复权）",
      description:
        "将在先地产权自然或约定终止后转为占有的未来权益；现时几乎无控制和收益，但存续与继承可能较强。",
    },
  },
  de: {
    fee_simple_absolute: {
      name: "Uneingeschränktes Volleigentum",
      description:
        "Die Basiseigentumsform des Common Law mit weitreichender Herrschaft, Ausschlussmacht, Übertragbarkeit und Vererblichkeit ohne innere Zeitgrenze.",
    },
    fee_simple_defeasible: {
      name: "Bedingtes Volleigentum",
      description:
        "Eine Eigentumsform unter Bedingung oder auflösender Begrenzung; weiterhin stark, aber in Dauer und Verkehrsfähigkeit schwächer als absolutes Volleigentum.",
    },
    life_estate: {
      name: "Lebenszeiteigentum",
      description:
        "Ein besitzbezogenes Estate für die Dauer eines Lebens; starke Nutzung und Kontrolle während der Laufzeit, aber keine vererbliche Dauer.",
    },
    leasehold: {
      name: "Leasehold",
      description:
        "Ein auf Zeit angelegtes Besitzrecht mit exklusiver Nutzung, begrenzt durch Laufzeit, Covenants und die Rückfallposition des Vermieters.",
    },
    licence: {
      name: "Nutzungserlaubnis",
      description:
        "Eine bloße Erlaubnis zum Betreten oder Nutzen ohne dingliches Estate; fragil in der Dauer, schwach im Ausschluss und meist nicht übertragbar.",
    },
    easement: {
      name: "Easement",
      description:
        "Ein begrenztes, nicht possessives Recht an fremdem Land, meist dauerhaft und vererblich, aber schmal im Gebrauch und schwach im Ausschluss.",
    },
    restrictive_covenant: {
      name: "Restrictive Covenant",
      description:
        "Eine dauerhafte negative Steuerung der Bodennutzung; kaum Besitz oder Nutzung, aber eine spürbare Ausschlusswirkung über Bindungen des anderen Eigentümers.",
    },
    mortgage: {
      name: "Mortgage",
      description:
        "Ein Sicherungsrecht mit Fokus auf Verwertung statt Nutzung; im Alltag dünn, aber relevant für Dauer, Übertragbarkeit und Zugriff im Ausfall.",
    },
    trust_beneficial: {
      name: "Treuhänderische Begünstigtenposition",
      description:
        "Die wirtschaftliche Position des Beneficiary im Trust: starke Ertragszuordnung, aber geringere direkte Besitz-, Ausschluss- und Veräußerungsrechte als beim legal title.",
    },
    adverse_possession: {
      name: "Besitz zur Ersitzung",
      description:
        "Der noch nicht vollendete possessive Zustand während der Verjährungsfrist: faktisch stark, aber ohne formalen Titel bis zum Fristablauf.",
    },
    profit_a_prendre: {
      name: "Entnahmerecht",
      description:
        "Das Recht, Wert aus fremdem Land zu entnehmen, etwa Holz oder Mineralien; schmal im Besitz, mäßig in der Nutzung, stark beim Ertrag.",
    },
    fee_tail: {
      name: "Stammgutestate (historisch)",
      description:
        "Das historische entailed estate: starke Position bei Besitz, Nutzung und Dauer, aber nahezu ohne Veräußerbarkeit zugunsten der Linienbindung.",
    },
    future_interest: {
      name: "Künftiges Anwartschaftsrecht",
      description:
        "Ein nicht possessives Recht, das nach Ende eines früheren Estates possessiv wird; aktuell kaum Kontrolle oder Ertrag, aber mit potenziell starker Dauer und Vererbbarkeit.",
    },
  },
  ja: {
    fee_simple_absolute: {
      name: "完全所有権",
      description:
        "コモンローの基準形であり、支配・排他・譲渡・相続がいずれも強く、内部的な期間制限を持ちません。",
    },
    fee_simple_defeasible: {
      name: "条件付完全所有権",
      description:
        "条件や終了事由を伴う所有形態で、全体としては強いものの、存続の安定性と市場性は完全所有権より弱くなります。",
    },
    life_estate: {
      name: "終身権",
      description:
        "一人の生存期間を単位とする占有的 estate で、期間中の使用と支配は強い一方、相続可能な長期性はありません。",
    },
    leasehold: {
      name: "賃借 estate",
      description:
        "期間付きの占有的 estate で、排他的占有と使用を与える一方、契約条項と貸主の復帰権に拘束されます。",
    },
    licence: {
      name: "単なる使用許可",
      description:
        "物権的 estate を伴わない立入り・使用許可で、存続は脆弱、排他性も弱く、通常は譲渡できません。",
    },
    easement: {
      name: "地役権",
      description:
        "他人の土地に対する限定的な非占有権で、一般に継続性と相続可能性はあるものの、利用範囲と排他性は狭いです。",
    },
    restrictive_covenant: {
      name: "制限的約款",
      description:
        "土地利用に対する持続的な負担で、自らの占有や使用は低い一方、他人への制限を通じて一定の排他効果を持ちます。",
    },
    mortgage: {
      name: "抵当権",
      description:
        "通常利用ではなく担保価値の実現に向いた負担であり、日常的な使用は薄いものの、期間・譲渡・執行価値の面で意味を持ちます。",
    },
    trust_beneficial: {
      name: "信託受益権",
      description:
        "信託受益者の衡平法上の地位で、経済的利益は強い一方、法的権原に比べると直接の占有・排他・譲渡は弱いです。",
    },
    adverse_possession: {
      name: "取得時効中の占有",
      description:
        "時効完成前の占有状態で、事実的支配と排他性は強いものの、期間が満了するまで正式な権原はありません。",
    },
    profit_a_prendre: {
      name: "収取権",
      description:
        "他人の土地から鉱物や木材などの価値を取り出す権利で、占有は限定的でも、収益取得力と継続性は比較的強いです。",
    },
    fee_tail: {
      name: "限嗣不動産権（歴史）",
      description:
        "歴史的な entailed estate で、占有・使用・存続は強い一方、血統維持のため譲渡性はほぼ抑えられています。",
    },
    future_interest: {
      name: "将来権（残余権・復帰権）",
      description:
        "先行 estate の終了後に占有化する非占有権で、現時点での支配や収益は弱いものの、存続と相続可能性は強くなり得ます。",
    },
  },
};

const CIVIL_LAW_TEXT = {
  en: {
    eigentum: {
      name: "Ownership",
    },
    erbbaurecht: {
      name: "Superficies / Building Right",
    },
    niessbrauch: {
      name: "Usufruct",
    },
    grunddienstbarkeit: {
      name: "Servitude",
    },
    hypothek: {
      name: "Mortgage",
    },
    pfandrecht: {
      name: "Pledge",
    },
    dian_quan: {
      name: "Dian Right",
    },
    juzhuquan: {
      name: "Habitation Right",
    },
    tudi_chengbao_jingyingquan: {
      name: "Rural Land Contractual Management Right",
    },
    zhaijidi_shiyongquan: {
      name: "Homestead Use Right",
    },
    liuzhiquan: {
      name: "Lien",
    },
    nongyuquan: {
      name: "Agricultural Cultivation Right",
    },
    qufen_dishangquan: {
      name: "Sectional Superficies",
    },
  },
  zh: {
    eigentum: {
      name: "所有权",
      description:
        "大陆法系中的完整所有权形态，在主要成文体系中都具备广泛支配、排他、处分、存续与继承。",
      notes:
        "它最接近普通法的 fee simple absolute。但在中国大陆，城市土地归国家、农村土地归集体，私人只能拥有地上建筑物而不能拥有土地本身。这里的滑块主要反映德、日、台的私有所有权；PRC 土地所有权并无私人对应物。",
    },
    erbbaurecht: {
      name: "地上权 / 建设用地使用权",
      description:
        "从所有权中分出的长期建筑或地上权，使用和转让能力强，但仍受期限约束，并非完全永久。",
      notes:
        "它是法定物权，不是单纯合同租赁。中国大陆建设用地使用权按用途设有法定最高年限，住宅通常 70 年；民法典第 359 条设想住宅自动续期，但具体条件仍未完全定型。",
    },
    niessbrauch: {
      name: "用益权",
      description:
        "德国式用益权，重点在使用和收取收益，而不是可自由处分的完整所有权。",
      notes:
        "普通法通常把这类功能拆散到终身地产权、信托和占用安排中，而不是维持一个统一的用益类别。",
    },
    grunddienstbarkeit: {
      name: "地役权",
      description:
        "服务于某块土地的物权，功能上接近役权或地役权：占有很弱、存续很强，通常依附于另一宗土地的利用。",
      notes:
        "这是跨法系中最干净的对应之一，因为两大传统都承认稳定、非占有性的有限土地负担。",
    },
    hypothek: {
      name: "抵押权",
      description:
        "面向担保价值而非日常占有与使用的物权；占有和使用弱，但足以支撑信贷和实现。",
      notes:
        "大陆法抵押权比普通法更明显地保持从属性与法典化结构，而普通法则叠加了法律与衡平法上的执行层次。",
    },
    pfandrecht: {
      name: "质权",
      description:
        "比抵押更带有占有色彩的担保权，但核心仍是担保价值，而不是受益性使用。",
      notes:
        "它与普通法 mortgage 只有部分相似，因为占有与从属性在这里承担了更重的结构功能。",
    },
    dian_quan: {
      name: "典权",
      description:
        "台湾法上历史性极强的权利，兼具占有、使用和回赎结构，不容易稳定落入常见普通法地产权。",
      notes:
        "它的价值正是在于暴露出普通法 estate 菜单无法平顺吸收的制度缝隙。",
    },
    juzhuquan: {
      name: "居住权",
      description:
        "以居住而非交换为中心的权利：占用和使用有分量，但收益、转让和继承都很弱。",
      notes:
        "普通法通常把这一空间拆散到许可、占用保护和特殊制定法安排中，而不是用一个命名物权统一承载。",
    },
    tudi_chengbao_jingyingquan: {
      name: "土地承包经营权",
      description:
        "中国大陆农村土地的基础性用益权：农户就集体土地取得长期占有、使用与收益，并在改革后拆分出可流转的经营权。",
      notes:
        "它嵌入集体土地所有制度之中，没有干净的普通法或其他大陆法对应物。期限依土地类型而变，经营权现已可流转、互换和抵押。",
    },
    zhaijidi_shiyongquan: {
      name: "宅基地使用权",
      description:
        "中国大陆特有的农村宅基地用益权：一户一宅、居住使用强，但对集体外转让几乎被压到最低。",
      notes:
        "该权利与集体成员身份紧密相连。房屋继承与土地权利返还之间仍存在政策与实务上的张力。",
    },
    liuzhiquan: {
      name: "留置权",
      description:
        "一种占有型担保物权：债权人在债务清偿前保留债务人的动产占有，并可在违约后处分。",
      notes:
        "它与质权不同，主要依法发生而非依约设立。德国法中的 Zurückbehaltungsrecht 更接近债法抗辩，而非严格物权。",
    },
    nongyuquan: {
      name: "农育权",
      description:
        "台湾法上的农林渔牧用益权，由 2010 年民法修正引入，用以替代废除的永佃权，并以 20 年为上限。",
      notes:
        "它是法定期限型的农业利用权，可在通知地主后转让。普通法和德国法都没有精确对应物。",
    },
    qufen_dishangquan: {
      name: "区分地上权",
      description:
        "只覆盖土地上下特定层位的分层地上权，而非整个垂直空间，对现代城市地下与高架开发尤为关键。",
      notes:
        "它允许把立体空间切层处分。普通法可通过 strata title、空域转让和役权拼出类似结果，但并无一一对应的法定物权包装。",
    },
  },
  de: {
    eigentum: {
      name: "Eigentum",
      description:
        "Die volle zivilrechtliche Eigentumsform mit breiter Herrschaft, Ausschlussmacht, Veräußerung, Dauer und Vererblichkeit über die großen Kodifikationen hinweg.",
      notes:
        "Sie steht dem common-law fee simple absolute am nächsten. Für Land in der VR China gilt das jedoch nicht: städtisches Land ist Staatseigentum, ländliches Land Kollektiveigentum; Private können Gebäude, nicht aber den Boden selbst besitzen.",
    },
    erbbaurecht: {
      name: "Erbbaurecht",
      description:
        "Ein langfristiges Bau- oder Superfiziarrecht, das aus dem Eigentum ausgeschnitten wird: stark nutzbar und übertragbar, aber weiterhin befristet.",
      notes:
        "Es ist ein benanntes dingliches Recht und kein bloßer Mietvertrag. Das chinesische 建设用地使用权 kennt zwingende Höchstlaufzeiten nach Nutzungszweck; für Wohnnutzung liegt der Referenzwert bei 70 Jahren.",
    },
    niessbrauch: {
      name: "Nießbrauch",
      description:
        "Ein deutsches Nutzungs- und Fruchtziehungsrecht mit Fokus auf Gebrauch und Ertrag statt frei veräußerlichem Vollrecht.",
      notes:
        "Das Common Law verteilt dieses Profil eher auf life estates, trusts und vertragliche Nutzungsarrangements als auf eine einheitliche Usufruktskategorie.",
    },
    grunddienstbarkeit: {
      name: "Grunddienstbarkeit",
      description:
        "Ein dienendes dingliches Recht ähnlich einer Servitut oder easement: schmal im Besitz, lang in der Dauer und meist an ein anderes Grundstück gekoppelt.",
      notes:
        "Dies ist eine der saubersten traditionsübergreifenden Zuordnungen, weil beide Systeme dauerhafte, nicht possessive Lasten für begrenzte Nutzung kennen.",
    },
    hypothek: {
      name: "Hypothek",
      description:
        "Ein auf Sicherungswert und Vollstreckung ausgerichtetes Recht, nicht auf gewöhnliche Nutzung oder Besitz.",
      notes:
        "Die zivilrechtliche Hypothek bleibt stärker akzessorisch und kodifiziert, während das Common Law denselben Bereich mit rechtlichen und equitable foreclosure-Schichten organisiert.",
    },
    pfandrecht: {
      name: "Pfandrecht",
      description:
        "Ein pfandähnliches Sicherungsrecht mit stärkerem Besitzbezug als die Hypothek, aber weiterhin auf Sicherungswert statt Gebrauch gerichtet.",
      notes:
        "Die Entsprechung zur common-law mortgage bleibt nur teilweise, weil Besitz und Akzessorietät hier eine größere dogmatische Rolle spielen.",
    },
    dian_quan: {
      name: "Dian-Quan",
      description:
        "Ein historisch eigenständiges taiwanisches Recht, das Besitz, Nutzung und Rücklösung so verbindet, dass es sich nicht stabil in vertraute Common-Law-Estates übersetzen lässt.",
      notes:
        "Gerade daran zeigt sich, wo die estate-Karte des Common Law ihre sauberen Analogien verliert.",
    },
    juzhuquan: {
      name: "Wohnrecht",
      description:
        "Ein auf Wohnen statt Austausch zentriertes Recht: relevante Nutzung und Belegung, aber wenig Ertrag, Übertragbarkeit oder Vererblichkeit.",
      notes:
        "Im Common Law wird dieser Bereich eher über Lizenzen, Besatzschutz und Spezialgesetze fragmentiert als über ein einheitliches dingliches Recht.",
    },
    tudi_chengbao_jingyingquan: {
      name: "Landvertrags- und Bewirtschaftungsrecht",
      description:
        "Das grundlegende ländliche Nutzungsrecht der VR China: Haushalte erhalten langfristige Besitz-, Nutzungs- und Ertragspositionen an kollektivem Land.",
      notes:
        "Es ist tief in die kollektive Bodenordnung eingebettet und hat weder im Common Law noch im kontinentaleuropäischen Zivilrecht ein sauberes Gegenstück. Die übertragbare Bewirtschaftungsposition ist nur ein Teil des Pakets.",
    },
    zhaijidi_shiyongquan: {
      name: "Hofstellen-Nutzungsrecht",
      description:
        "Ein chinesisches Sonderrecht für ländliches Wohnbauland: starke Besitz- und Wohnnutzung, aber nahezu keine Übertragbarkeit außerhalb des Kollektivs.",
      notes:
        "Das Recht hängt eng an der Mitgliedschaft im Kollektiv. Gerade bei Vererbung von Haus und Boden zeigt sich ein Spannungsfeld zwischen Politik und dogmatischer Struktur.",
    },
    liuzhiquan: {
      name: "Lien / Retentionsrecht",
      description:
        "Ein possessiver Sicherungstitel: Der Gläubiger behält die Sache des Schuldners bis zur Erfüllung und kann sie bei Ausfall verwerten.",
      notes:
        "Anders als das Pfand entsteht dieses Recht typischerweise kraft Gesetzes. Das deutsche Zurückbehaltungsrecht ist eher ein schuldrechtliches Verteidigungsmittel als ein vollwertiges dingliches Recht.",
    },
    nongyuquan: {
      name: "Landwirtschaftsnutzungsrecht",
      description:
        "Ein taiwanisches Nutzungsrecht für Landwirtschaft, Forst, Fischerei und Viehzucht, geschaffen 2010 als Ersatz für das abgeschaffte 永佃權 und auf 20 Jahre begrenzt.",
      notes:
        "Es handelt sich um ein gesetzlich befristetes, übertragbares Nutzungsrecht. Eine präzise Entsprechung in Common Law oder deutschem Recht fehlt.",
    },
    qufen_dishangquan: {
      name: "Geschichtetes Superfiziarrecht",
      description:
        "Ein auf eine bestimmte Schicht über oder unter der Erdoberfläche begrenztes Superfiziarrecht statt eines Rechts an der ganzen vertikalen Säule.",
      notes:
        "Es ermöglicht die rechtliche Schichtung urbaner Räume. Das Common Law erreicht ähnliche Ergebnisse eher über strata title, airspace conveyances und easements als über ein einziges benanntes dingliches Recht.",
    },
  },
  ja: {
    eigentum: {
      name: "所有権",
      description:
        "主要な成文法体系に共通する完全な大陸法上の所有形態で、支配・排他・譲渡・存続・相続可能性が広く認められます。",
      notes:
        "コモンローの fee simple absolute に最も近い位置にあります。ただし中国本土の土地では事情が異なり、都市部の土地は国家、農村部の土地は集団に帰属し、私人は建物を所有できても土地自体は所有できません。",
    },
    erbbaurecht: {
      name: "地上権 / 建設用地使用権",
      description:
        "所有権から切り出される長期の建築・地上権で、利用・譲渡は強い一方、なお期間に拘束されます。",
      notes:
        "これは単なる賃貸借ではなく、名指しの物権です。中国本土の建設用地使用権には用途別の法定上限期間があり、住宅用は 70 年が基準です。",
    },
    niessbrauch: {
      name: "用益権",
      description:
        "ドイツ法の Nießbrauch に近い権利で、完全所有よりも使用と果実収取に重心があります。",
      notes:
        "コモンローではこの機能は終身権、信託、占有契約などに分散し、単一の usufruct 類型としては残りにくいです。",
    },
    grunddienstbarkeit: {
      name: "地役権",
      description:
        "他の土地の利用に資する物権で、占有は弱く、存続は長く、通常は他の区画に結びついています。",
      notes:
        "これは法系横断で最もきれいに対応する類型の一つで、両体系とも持続的な非占有的負担を認めています。",
    },
    hypothek: {
      name: "抵当権",
      description:
        "通常の占有や使用ではなく、担保価値と執行に向いた物権です。",
      notes:
        "大陸法の抵当権はより明確に従属性と法典化を保ち、コモンローは同じ領域を法律上・衡平法上の執行構造で層状に処理します。",
    },
    pfandrecht: {
      name: "質権",
      description:
        "抵当よりも占有色の強い担保権ですが、中心はなお担保価値であって受益的使用ではありません。",
      notes:
        "コモンロー mortgage との一致は部分的にとどまり、占有と従属性がここではより重い制度的役割を担います。",
    },
    dian_quan: {
      name: "典権",
      description:
        "台湾法に特有の歴史的権利で、占有・使用・回贖の構造が組み合わさり、一般的なコモンロー estate に安定して落ちません。",
      notes:
        "この権利は、コモンローの estate 一覧がどこで滑らかな類推を失うかを示してくれます。",
    },
    juzhuquan: {
      name: "居住権",
      description:
        "交換より居住を中心とする権利で、占有と使用には意味がある一方、収益・譲渡・相続は弱いです。",
      notes:
        "コモンローではこの空間はライセンス、占有保護、特別法上の制度へと分散し、一つの名指し物権にはまとまりません。",
    },
    tudi_chengbao_jingyingquan: {
      name: "土地請負経営権",
      description:
        "中国本土農村土地の基礎的な利用権で、世帯が集体所有地について長期の占有・使用・収益を持ちます。",
      notes:
        "この権利は集体土地所有制度に深く埋め込まれており、コモンローにも他の大陸法にもきれいな対応物はありません。流通可能な経営権はその一部分にすぎません。",
    },
    zhaijidi_shiyongquan: {
      name: "宅基地使用権",
      description:
        "中国本土特有の農村住宅用地権利で、居住のための占有・使用は強い一方、集体外への譲渡は極めて弱いです。",
      notes:
        "この権利は集体構成員資格と密接に結びつきます。家屋相続と土地権利の帰趨のあいだにはなお緊張があります。",
    },
    liuzhiquan: {
      name: "留置権",
      description:
        "占有型の担保権で、債権者が弁済まで債務者の動産を保持し、債務不履行時には処分できます。",
      notes:
        "質権と異なり、通常は契約より法律によって発生します。ドイツ法の Zurückbehaltungsrecht はより債権法的な抗弁に近く、完全な物権ではありません。",
    },
    nongyuquan: {
      name: "農育権",
      description:
        "2010 年改正で台湾民法に導入された農林漁牧用の用益権で、廃止された永佃権の代替として 20 年上限で設計されています。",
      notes:
        "法定の期間制限を持ち、通知により譲渡可能です。コモンローにもドイツ法にも正確な対応物はありません。",
    },
    qufen_dishangquan: {
      name: "区分地上権",
      description:
        "土地の上下の特定層に限られる地上権であり、土地全体の垂直空間を対象とするわけではありません。",
      notes:
        "都市空間の層状開発を可能にする制度です。コモンローでも strata title や空中権譲渡、地役権の組合せで似た結果は作れますが、一対一の名指し物権ではありません。",
    },
  },
};

const HARMONIZATION_TEXT = {
  zh: {
    eigentum: {
      message: "大陆法所有权与 fee simple absolute 作为各自体系的默认完整所有形态，收敛度很高。",
      divergence:
        "但大陆法把它锚定在法典化的物权类型目录中，普通法则通过 estate 体系与衡平法来组织同一空间。",
    },
    erbbaurecht: {
      message: "长期、可继承的建筑权在普通法视角下常常像一种制度化的长期 leasehold。",
      divergence:
        "大陆法把它当作独立命名物权，而普通法通常通过租赁加约款结构来承载这一模式。",
    },
    niessbrauch: {
      message: "当焦点落在现时使用与收益而非完整权源时，用益权最接近终身地产权逻辑。",
      divergence:
        "普通法更倾向于把同样的经济画像分散到终身地产权、信托和合同占用中，而不是一个统一的用益权。",
    },
    grunddienstbarkeit: {
      message: "役权与 easement 在“对他人土地的持久、非占有性权利”这一层面上高度贴合。",
      divergence:
        "剩余差异主要来自教义包装和登记结构，而不是功能性权利束本身。",
    },
    hypothek: {
      message: "两大传统都承认一种面向担保价值而非日常占有的持续性担保权。",
      divergence:
        "大陆法抵押权更明显地保留从属性和法典化，普通法则在同一地带叠加了法律与衡平法的执行传统。",
    },
    pfandrecht: {
      message: "在担保融资层面存在一定收敛，但它与普通法 mortgage 的贴合度并不高。",
      divergence:
        "以占有为敏感点的质权结构和从属性逻辑，无法顺滑地翻译进标准普通法不动产担保模板。",
    },
    dian_quan: {
      message: "没有稳定的普通法 estate 能在不扭曲制度结构的前提下承接典权。",
      divergence:
        "它把占有、使用、时间和回赎逻辑交织在一起，正好落在 leasehold、security 与 limited ownership 之间的缝隙里。",
    },
    juzhuquan: {
      message: "居住权在普通法语境中部分像受到保护的占用许可。",
      divergence:
        "大陆法可以把居住包装成命名物权，而普通法通常把同一社会功能分散到更弱、也更情境化的装置里。",
    },
    tudi_chengbao_jingyingquan: {
      message: "普通法没有哪种 estate 能准确承接中国农村土地“集体到农户”的承包结构。",
      divergence:
        "这一权利嵌入集体土地所有制度。农业租赁或 leasehold 只能捕捉部分经济功能，却无法复制集体配置机制。",
    },
    zhaijidi_shiyongquan: {
      message: "普通法中不存在能够对应“一户一宅”农村宅基地配置模式的 estate。",
      divergence:
        "该权利源自村集体的行政性配置，而不是市场交易。普通法没有在集体所有框架下分配住宅土地使用权的平行机制。",
    },
    liuzhiquan: {
      message: "普通法的 possessory lien 与其“先留置、后受偿”的逻辑部分相通，但缺少大陆法式物权结构。",
      divergence:
        "大陆法把留置权视为有优先顺位和实现程序的命名物权，普通法则更常把类似制度看作衡平法或制定法救济。",
    },
    nongyuquan: {
      message: "普通法中没有一种 estate 能干净对应具备 numerus clausus 地位且有法定期限上限的农业利用权。",
      divergence:
        "普通法通常通过 leasehold、profit à prendre 或合同安排来承载农业利用，而不是设立专门命名物权。",
    },
    qufen_dishangquan: {
      message: "普通法的 strata title 和空域权能提供了部分相似功能，但没有对应的法典化 numerus clausus 包装。",
      divergence:
        "大陆法这里是对特定立体层位的命名物权；普通法则通过分层产权、空域让与和地役权的组合达成近似结果。",
    },
  },
  de: {
    eigentum: {
      message:
        "Zivilrechtliches Eigentum und fee simple absolute konvergieren stark als jeweilige Standardform umfassenden Eigentums.",
      divergence:
        "Der Fit ist dennoch nicht perfekt, weil das Zivilrecht in einem kodifizierten Typenzwang bleibt, während das Common Law mit Estates und Equity arbeitet.",
    },
    erbbaurecht: {
      message:
        "Das lange, vererbliche Baurecht wirkt aus Common-Law-Sicht oft wie ein institutionalisierter Langzeitleasehold.",
      divergence:
        "Das Zivilrecht behandelt es als eigenständiges dingliches Recht, während das Common Law dieselbe Struktur meist über leasehold plus covenants kanalisiert.",
    },
    niessbrauch: {
      message:
        "Wenn aktuelle Nutzung und Früchte im Vordergrund stehen, nähert sich der Nießbrauch am ehesten der life-estate-Logik.",
      divergence:
        "Das Common Law verteilt dasselbe ökonomische Profil eher auf life estates, trusts und Vertragsarrangements als auf einen einheitlichen Usufrukt.",
    },
    grunddienstbarkeit: {
      message:
        "Servitut und easement liegen funktional sehr eng beieinander als dauerhafte, nicht possessive Rechte an fremdem Land.",
      divergence:
        "Die Restdifferenz liegt vor allem in dogmatischer Verpackung und Registerarchitektur, nicht im Bündel selbst.",
    },
    hypothek: {
      message:
        "Beide Systeme kennen ein dauerhaftes Sicherungsrecht, das auf den Sicherungswert und nicht auf gewöhnlichen Besitz zielt.",
      divergence:
        "Die zivilrechtliche Hypothek bleibt stärker akzessorisch und kodifiziert, während das Common Law rechtliche und equitable Vollstreckungslinien übereinanderlegt.",
    },
    pfandrecht: {
      message:
        "Auf der Ebene besicherter Kreditverhältnisse gibt es gewisse Konvergenz, aber die Passung zur mortgage-Kategorie bleibt locker.",
      divergence:
        "Besitzsensitives Pfand und Akzessorietät lassen sich nicht glatt in das typische common-law Sicherungsmodell für Land übersetzen.",
    },
    dian_quan: {
      message:
        "Kein stabiles Common-Law-Estate erfasst die rücklösungsorientierte Struktur des dian quan ohne Verzerrung.",
      divergence:
        "Das Recht verbindet Besitz, Nutzung, Zeit und Rücklösung in einer Weise, die zwischen leasehold, security und begrenztem Eigentum liegt.",
    },
    juzhuquan: {
      message:
        "Ein Wohnrecht ähnelt im Common Law teilweise einer geschützten occupation licence.",
      divergence:
        "Das Zivilrecht kann Wohnen als benanntes dingliches Recht bündeln, während das Common Law dieselbe Funktion auf schwächere und situationsgebundene Instrumente verteilt.",
    },
    tudi_chengbao_jingyingquan: {
      message:
        "Kein Common-Law-Estate erfasst sauber die kollektiv-zu-haushaltliche Vertragsstruktur des ländlichen Bodens in der VR China.",
      divergence:
        "Das Recht ist in das System kollektiven Bodeneigentums eingebettet. Agricultural tenancy oder leasehold fassen einzelne ökonomische Aspekte, nicht aber den Allokationsmechanismus.",
    },
    zhaijidi_shiyongquan: {
      message:
        "Es gibt im Common Law kein Estate, das das Modell „ein Haushalt, ein Bauplatz“ für ländliches Wohnbauland abbildet.",
      divergence:
        "Das Recht entsteht aus administrativer Zuweisung durch das Dorfkollektiv und nicht aus Markttransaktion. Eine Parallele innerhalb kollektiver Eigentumsstruktur fehlt im Common Law.",
    },
    liuzhiquan: {
      message:
        "Possessory liens im Common Law teilen die Logik „Zurückbehalten bis Zahlung“, aber nicht die in rem-Struktur des zivilrechtlichen Rechts.",
      divergence:
        "Das Zivilrecht ordnet lien als benanntes Vermögensrecht mit Prioritäts- und Vollstreckungsregeln ein; das Common Law behandelt Ähnliches eher als equitable oder statutory remedy.",
    },
    nongyuquan: {
      message:
        "Kein Common-Law-Estate bildet ein kodifiziertes, befristetes Agrarnutzungsrecht mit Typenzwangsstatus sauber ab.",
      divergence:
        "Das Common Law führt landwirtschaftliche Nutzung eher über leasehold, profit à prendre oder Vertrag, nicht über ein eigenes dingliches Standardrecht.",
    },
    qufen_dishangquan: {
      message:
        "Strata title und airspace rights erfüllen im Common Law teilweise ähnliche Funktionen, aber ohne dieselbe kodifizierte Typenzwangsverpackung.",
      divergence:
        "Im Zivilrecht handelt es sich um ein benanntes dingliches Recht an einer bestimmten Schicht; das Common Law erreicht Vergleichbares nur über einen Instrumentenmix.",
    },
  },
  ja: {
    eigentum: {
      message:
        "大陸法上の所有権と fee simple absolute は、それぞれの体系における包括的な標準所有形態として強く収斂します。",
      divergence:
        "ただし大陸法は法典化された物権類型の中に位置づけるのに対し、コモンローは estate と equity の層で同じ領域を構成します。",
    },
    erbbaurecht: {
      message:
        "長期で相続可能な建築権は、コモンローの視点では制度化された長期 leasehold にかなり近く見えます。",
      divergence:
        "大陸法では独立した名指し物権として扱われる一方、コモンローでは leasehold と covenant 構造で処理されることが多いです。",
    },
    niessbrauch: {
      message:
        "現在の使用と果実収取に重点がある限り、用益権はもっとも life-estate 的なロジックに近づきます。",
      divergence:
        "コモンローは同じ経済的プロフィールを、終身権・信託・契約上の占有装置へと分散させる傾向があります。",
    },
    grunddienstbarkeit: {
      message:
        "servitude と easement は、他人の土地に対する持続的な非占有権という点で非常に近く並びます。",
      divergence:
        "残る差は主として教義上の包装と登記構造にあり、機能的な権利束そのものではありません。",
    },
    hypothek: {
      message:
        "両体系とも、通常の占有ではなく担保価値に向いた持続的な担保権を認めています。",
      divergence:
        "大陸法の抵当権はより明示的に従属性と法典化を保つ一方、コモンローは法的・衡平法的執行伝統を同じ地平に重ねます。",
    },
    pfandrecht: {
      message:
        "担保信用というレベルでは一定の収斂がありますが、コモンロー mortgage 類型との適合は緩やかです。",
      divergence:
        "占有に敏感な質権構造と従属性のロジックは、典型的なコモンロー不動産担保モデルに滑らかには移りません。",
    },
    dian_quan: {
      message:
        "典権の回贖中心構造を歪めずに受け止められる安定したコモンロー estate は存在しません。",
      divergence:
        "この権利は占有・使用・時間・回贖を組み合わせ、leasehold・security・限定所有のあいだの隙間に位置します。",
    },
    juzhuquan: {
      message:
        "居住権は、コモンローでは保護された occupation licence に部分的に似ています。",
      divergence:
        "大陸法は居住を名指し物権としてまとめられますが、コモンローではより弱く状況依存的な装置へ分散しがちです。",
    },
    tudi_chengbao_jingyingquan: {
      message:
        "中国農村土地の「集体から世帯へ」という請負構造を正確に受け止めるコモンロー estate はありません。",
      divergence:
        "この権利は集体土地所有制度に埋め込まれており、agricultural tenancy や leasehold は経済的機能の一部しか捉えられません。",
    },
    zhaijidi_shiyongquan: {
      message:
        "「一戸一宅」という農村住宅用地の配分モデルに対応するコモンロー estate は存在しません。",
      divergence:
        "この権利は市場取引ではなく村集体の配分から生じます。集体所有の枠内で居住用地使用権を分配する平行制度はコモンローにありません。",
    },
    liuzhiquan: {
      message:
        "コモンローの possessory lien は「支払まで保持する」という論理を共有しますが、大陸法型の物権構造までは持ちません。",
      divergence:
        "大陸法は留置権を優先順位と実行手続を備えた名指し物権として扱うのに対し、コモンローは似た制度を equitable・statutory remedy として扱いがちです。",
    },
    nongyuquan: {
      message:
        "numerus clausus の地位を持つ期間限定の農業利用権にきれいに対応するコモンロー estate はありません。",
      divergence:
        "コモンローは農業利用を leasehold、profit à prendre、契約などで処理し、専用の名指し物権としては組みません。",
    },
    qufen_dishangquan: {
      message:
        "strata title や airspace rights は部分的に類似機能を果たしますが、同じ法典化された numerus clausus の包装は持ちません。",
      divergence:
        "大陸法では特定層位に対する名指し物権ですが、コモンローでは複数の制度を組み合わせて近い結果を実現します。",
    },
  },
};

const VIOLATION_TEXT = {
  zh: {
    alienation_without_possession: {
      message: "处分权过高而占有基础过低，这种组合不稳定。",
      detail: "转让能力已经跑在对标的物的现实控制之前。",
    },
    exclusion_without_possession: {
      message: "排他性很强但几乎没有占有，维持起来会非常吃力。",
      detail: "这意味着你想挡住别人，却缺少相应的事实控制。",
    },
    income_without_use: {
      message: "收益请求很高但使用权很薄弱，结构仍然欠明确。",
      detail: "权利束在抽取收益，却没有给出足够厚实的基础使用关系。",
    },
    full_bundle_without_alienation: {
      message: "权利束几乎永久且可继承，但处分被封死了。",
      detail: "这很像被抽走核心市场处分权的所有权。",
    },
    alienation_without_duration: {
      message: "处分权很高但存续几乎没有，这在结构上前后不通。",
      detail: "一个立刻消散的权利，无法支撑广泛的转让能力。",
    },
    inheritability_without_duration: {
      message: "没有足够存续却强调可继承，内部并不一致。",
      detail: "权利几乎撑不过现任权利人，却又声称能向后传递。",
    },
    art_359_renewal: {
      message: "中国大陆土地使用期限正在逼近民法典第 359 条的续期区间。",
      detail: "住宅用地大约在 70 年附近进入自动续期讨论带，但续期条件仍未彻底明晰。",
    },
    numerus_clausus_violation: {
      message: "这个权利束在普通法里还能读得通，但在大陆法 numerus clausus 类别里明显失焦。",
      detail: "普通法仍能找到相对稳定的对应物，而大陆法的顶级匹配已经明显偏弱。",
    },
    abstraktionsprinzip_note: {
      message: "这个组合隐约呈现出“处分和占有脱钩”的抽象分离感。",
      detail: "处分维度很高，而占有明显跟不上。",
    },
  },
  de: {
    alienation_without_possession: {
      message:
        "Hohe Veräußerbarkeit ohne tragfähige Besitzbasis ist instabil.",
      detail:
        "Die Übertragungsmacht läuft der tatsächlichen Kontrolle über die Sache voraus.",
    },
    exclusion_without_possession: {
      message:
        "Starker Ausschluss bei kaum vorhandenem Besitz ist schwer aufrechtzuerhalten.",
      detail:
        "Das Bündel beansprucht Gatekeeping-Macht ohne entsprechende tatsächliche Sachherrschaft.",
    },
    income_without_use: {
      message:
        "Hohe Ertragsansprüche ohne nennenswerte Nutzungsrechte wirken unterbestimmt.",
      detail:
        "Das Bündel zieht Früchte, lässt aber die zugrunde liegende Nutzungsbeziehung zu dünn.",
    },
    full_bundle_without_alienation: {
      message:
        "Das Bündel ist nahezu dauerhaft und vererblich, aber die Veräußerung ist blockiert.",
      detail:
        "Das erinnert an Eigentum, dem eines seiner zentralen Marktattribute entzogen wurde.",
    },
    alienation_without_duration: {
      message:
        "Hohe Veräußerbarkeit bei fast keiner Dauer ist inkohärent.",
      detail:
        "Ein Recht, das sofort erlischt, kann keine breite Übertragungsmacht tragen.",
    },
    inheritability_without_duration: {
      message:
        "Vererblichkeit ohne tragfähige Dauer ist innerlich widersprüchlich.",
      detail:
        "Das Bündel soll fortgegeben werden, überlebt den gegenwärtigen Inhaber aber kaum.",
    },
    art_359_renewal: {
      message:
        "Die Dauer des chinesischen Landnutzungsrechts nähert sich der Verlängerungszone aus Art. 359.",
      detail:
        "Bei Wohnnutzung liegt der Fokus um die 70 Jahre, doch die Verlängerungsbedingungen bleiben offen.",
    },
    numerus_clausus_violation: {
      message:
        "Das Bündel ist im Common Law noch lesbar, sperrt sich aber gegen zivilrechtliche Typenzwangskategorien.",
      detail:
        "Im Common Law findet sich noch ein relativ stabiles Pendant, zivilrechtlich fällt das Matching bereits deutlich ab.",
    },
    abstraktionsprinzip_note: {
      message:
        "Das Bündel deutet eine abstrahierende Trennung von Verfügung und Besitz an.",
      detail:
        "Die Veräußerungsdimension ist hoch, während der Besitz deutlich zurückbleibt.",
    },
  },
  ja: {
    alienation_without_possession: {
      message:
        "占有基盤が薄いのに譲渡権限だけが高い状態は不安定です。",
      detail:
        "移転能力が、物に対する現実の支配を追い越しています。",
    },
    exclusion_without_possession: {
      message:
        "排除権が強いのに占有がほとんどないと、維持はかなり難しくなります。",
      detail:
        "他人を締め出す力を示しながら、それを支える事実的支配が足りていません。",
    },
    income_without_use: {
      message:
        "収益請求が高いのに利用権が薄いと、構造がまだ定まりません。",
      detail:
        "果実だけを取り出しており、その基礎となる利用関係が細すぎます。",
    },
    full_bundle_without_alienation: {
      message:
        "ほぼ永久で相続可能なのに譲渡だけが塞がれている状態です。",
      detail:
        "これは市場処分という中核属性を一つ抜いた所有権に近い姿です。",
    },
    alienation_without_duration: {
      message:
        "譲渡権限が高いのに存続がほとんどないのは整合しません。",
      detail:
        "すぐ消える権利は広い移転能力を支えられません。",
    },
    inheritability_without_duration: {
      message:
        "十分な存続がないのに相続可能とするのは内在的に矛盾します。",
      detail:
        "現在の権利者すらほとんど超えられないのに、次世代への承継を主張しています。",
    },
    art_359_renewal: {
      message:
        "中国本土の土地使用期間が民法典359条の更新帯に近づいています。",
      detail:
        "住宅用は 70 年付近で自動更新が意識されますが、具体条件はなお固まり切っていません。",
    },
    numerus_clausus_violation: {
      message:
        "この権利束はコモンローではまだ読めますが、大陸法の numerus clausus 類型には収まりにくいです。",
      detail:
        "コモンローでは比較的安定した対応物が見つかる一方、大陸法の上位一致はかなり弱くなっています。",
    },
    abstraktionsprinzip_note: {
      message:
        "この組合せは、処分と占有が切り離される抽象的分離をほのめかします。",
      detail:
        "譲渡シグナルが高い一方、占有がそれに追いついていません。",
    },
  },
};

const ANNOTATION_TEXT = {
  zh: {
    eigentum_prc_land_lock: {
      message:
        "在中国大陆土地语境下，土地归国家或集体所有，私人土地所有权既不能转让，也不能继承。",
    },
    erbbaurecht_prc_duration: {
      message:
        "中国大陆建设用地使用权按用途分年限：住宅 70 年、商业 40 年、工业 50 年。",
    },
    erbbaurecht_prc_renewal: {
      message:
        "民法典第 359 条设想住宅自动续期，但续期条件仍未完全明晰。",
    },
    hypothek_prc_land: {
      message:
        "在中国大陆土地交易中，抵押附着于建设用地使用权，而不是抽象意义上的土地所有权。",
    },
  },
  de: {
    eigentum_prc_land_lock: {
      message:
        "Im Kontext chinesischen Bodens bleibt Land Staats- oder Kollektiveigentum; privates Grundeigentum kann daher weder übertragen noch vererbt werden.",
    },
    erbbaurecht_prc_duration: {
      message:
        "Für chinesische 建设用地使用权 gelten nutzungsabhängige Laufzeiten: Wohnen 70 Jahre, Gewerbe 40, Industrie 50.",
    },
    erbbaurecht_prc_renewal: {
      message:
        "Art. 359 sieht für Wohnnutzung eine automatische Verlängerung vor, doch die Bedingungen bleiben offen.",
    },
    hypothek_prc_land: {
      message:
        "Bei chinesischen Landtransaktionen greift die Hypothek an das Landnutzungsrecht, nicht an ein nacktes Eigentum am Boden.",
    },
  },
  ja: {
    eigentum_prc_land_lock: {
      message:
        "中国本土の土地は国家または集体に帰属するため、私人の土地所有権は譲渡も相続もできません。",
    },
    erbbaurecht_prc_duration: {
      message:
        "中国本土の建設用地使用権は用途別期間制です。住宅 70 年、商業 40 年、工業 50 年が基準です。",
    },
    erbbaurecht_prc_renewal: {
      message:
        "民法典359条は住宅用途の自動更新を想定しますが、条件はなお確定していません。",
    },
    hypothek_prc_land: {
      message:
        "中国本土の土地取引では、抵当は土地そのものの所有権ではなく建設用地使用権に付着します。",
    },
  },
};

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

export function getUiCopy(locale) {
  return UI_COPY[locale] ?? UI_COPY.en;
}

export function getSliderMeta(locale) {
  const copy = SLIDER_META_COPY[locale] ?? SLIDER_META_COPY.en;

  return SLIDER_KEYS.map((key) => ({
    key,
    ...copy[key],
  }));
}

// AI governance dimension labels. Uses the same underlying slider keys but
// relabels each dimension to its AI governance analogue.
const AI_SLIDER_META_COPY = {
  possession: {
    label: 'Autonomy',
    lowLabel: 'Fully human-controlled',
    highLabel: 'Fully autonomous',
  },
  use: {
    label: 'Capability Scope',
    lowLabel: 'Narrow / restricted use',
    highLabel: 'General-purpose, unrestricted',
  },
  income: {
    label: 'Value Capture',
    lowLabel: 'All value to users',
    highLabel: 'All value to deployer',
  },
  alienation: {
    label: 'Transferability',
    lowLabel: 'Model locked to one context',
    highLabel: 'Freely redistributable / open-source',
  },
  exclusion: {
    label: 'Access Control',
    lowLabel: 'Open to all',
    highLabel: 'Restricted / gated access',
  },
  duration: {
    label: 'Deployment Persistence',
    lowLabel: 'Ephemeral / session-based',
    highLabel: 'Permanent / always-on',
  },
  inheritability: {
    label: 'Replicability',
    lowLabel: 'Cannot be copied or distilled',
    highLabel: 'Freely reproducible',
  },
};

export function getAISliderMeta() {
  return SLIDER_KEYS.map((key) => ({
    key,
    ...AI_SLIDER_META_COPY[key],
  }));
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

export function getConvergenceLevelLabel(level, locale) {
  const ui = getUiCopy(locale);
  return ui.convergence.levels[level] ?? ui.convergence.levels.none;
}

export function localizeCommonLawEstate(estate, locale) {
  const copy = COMMON_LAW_TEXT[locale]?.[estate.id];

  if (!copy) {
    return estate;
  }

  return {
    ...estate,
    ...copy,
  };
}

function getFallbackCivilName(estate) {
  return (
    estate.names.de ??
    estate.names.tw ??
    estate.names.prc ??
    estate.names.jp ??
    estate.id
  );
}

export function localizeCivilLawEstate(estate, locale) {
  const localized =
    CIVIL_LAW_TEXT[locale]?.[estate.id] ?? CIVIL_LAW_TEXT.en?.[estate.id];

  return {
    ...estate,
    displayName: localized?.name ?? getFallbackCivilName(estate),
    description: localized?.description ?? estate.description,
    notes: localized?.notes ?? estate.notes,
  };
}

export function localizeConvergenceResult(result, locale) {
  const copy = HARMONIZATION_TEXT[locale]?.[result.civilEstate.id];

  if (!copy) {
    return result;
  }

  return {
    ...result,
    message: copy.message,
    divergence: copy.divergence,
  };
}

export function localizeViolation(violation, locale) {
  const copy = VIOLATION_TEXT[locale]?.[violation.id];

  if (!copy) {
    return violation;
  }

  return {
    ...violation,
    message: copy.message ?? violation.message,
    detail: copy.detail ?? violation.detail,
  };
}

export function localizeSliderAnnotation(annotation, locale) {
  const copy = ANNOTATION_TEXT[locale]?.[annotation.messageId];

  if (!copy) {
    return annotation;
  }

  return {
    ...annotation,
    message: copy.message,
  };
}
