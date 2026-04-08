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
