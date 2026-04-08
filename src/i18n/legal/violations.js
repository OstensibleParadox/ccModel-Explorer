const VIOLATION_TEXT = {
  zh: {
    autonomy_without_accountability: {
      message: "自主性上升但责任主体不清，问责结构失衡。",
      detail:
        "这相当于在几乎没有有效责任分配的情况下放大系统自主行为，风险难以归责。",
      authority: "张某，《AI治理中的代理权放弃》（EiT 2026）",
    },
    value_capture_without_accountability: {
      message: "价值捕获高度集中，但可归责性不足。",
      detail:
        "部署方保留主要收益，却缺少与之匹配的可追责安排，形成收益与责任脱钩。",
      authority: "“黑箱围墙中的无责任收益捕获”论题（FAccT 2026）",
    },
    capability_without_constraint: {
      message: "能力范围很高，但外部约束层过薄。",
      detail:
        "过度依赖模型自身对齐，缺乏分层防护与制度性兜底，属于高风险配置。",
      authority: "“马其诺防线”比喻（Bengio et al., 2025）",
    },
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
    prc_movable_pledge_without_possession: {
      message: "中国大陆动产质押要求实际交付——占有过低在教义上不稳定。",
      detail: "民法典第 429 条规定，质权自出质人交付质押财产时设立。没有构成性占有，质权无法成立。",
    },
    prc_intangible_perpetual_duration: {
      message: "中国大陆知识产权具有法定期限限制——永久存续不可用。",
      detail: "发明专利 20 年、实用新型/外观设计 10 年；著作权为作者终身加 50 年；商标每 10 年可续展。",
    },
  },
  de: {
    autonomy_without_accountability: {
      message:
        "Steigende Autonomie ohne klare Verantwortungszuordnung untergräbt die Rechenschaft.",
      detail:
        "Autonomes Verhalten nimmt zu, während tragfähige Haftungs- und Zuständigkeitsstrukturen fehlen.",
      authority: "Zhang, „Waivers of Agency in AI Governance“ (EiT 2026)",
    },
    value_capture_without_accountability: {
      message:
        "Hohe Wertabschöpfung bei unzureichender Verantwortlichkeit ist governance-seitig instabil.",
      detail:
        "Der Betreiber vereinnahmt den Großteil des Werts, ohne entsprechend belastbare Rechenschaftsmechanismen.",
      authority:
        "These zur „value capture without accountability“ (FAccT 2026)",
    },
    capability_without_constraint: {
      message:
        "Hoher Fähigkeitsumfang ohne mehrschichtige Begrenzung ist ein Hochrisikoprofil.",
      detail:
        "Die Konfiguration verlässt sich primär auf interne Ausrichtung statt auf abgestufte externe Sicherungen.",
      authority: "„Maginot-Line“-Analogie (Bengio et al., 2025)",
    },
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
    prc_movable_pledge_without_possession: {
      message:
        "Chinesisches Fahrnispfand setzt tatsächliche Übergabe voraus \u2014 geringer Besitz ist dogmatisch instabil.",
      detail:
        "Art. 429 ZGB bestimmt, dass das Pfandrecht mit Übergabe der beweglichen Sache entsteht. Ohne konstitutiven Besitz kann das Pfandrecht nicht entstehen.",
    },
    prc_intangible_perpetual_duration: {
      message:
        "Chinesische IP-Rechte unterliegen gesetzlichen Höchstfristen \u2014 ewige Dauer ist nicht verfügbar.",
      detail:
        "Erfindungspatente: 20 J.; Gebrauchsmuster/Design: 10 J. Urheberrecht: Lebenszeit + 50 J. Nur Marken sind unbegrenzt verlängerbar (10-J.-Perioden).",
    },
  },
  ja: {
    autonomy_without_accountability: {
      message:
        "自律性が高いのに責任主体が不明確で、説明責任の構造が弱い状態です。",
      detail:
        "システムの自律行動が拡大している一方、追跡可能な責任配分が十分に整っていません。",
      authority: "Zhang「Waivers of Agency in AI Governance」（EiT 2026）",
    },
    value_capture_without_accountability: {
      message:
        "価値の取り込みが強いのに、対応する説明責任が不足しています。",
      detail:
        "提供者が主要な価値を保持する一方で、損害時の責任経路が薄く、統治上の不均衡が生じています。",
      authority: "「value capture without accountability」論点（FAccT 2026）",
    },
    capability_without_constraint: {
      message:
        "能力範囲が高いのに、外部制約が薄すぎる高リスク構成です。",
      detail:
        "内部アラインメントへの依存が強く、段階的な外部防護やフェイルセーフが不足しています。",
      authority: "「マジノ線」比喩（Bengio et al., 2025）",
    },
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
    prc_movable_pledge_without_possession: {
      message:
        "中国の動産質権は現実の引渡しを要します \u2014 占有が低いと教義的に不安定です。",
      detail:
        "民法典429条は質権が動産の引渡しにより成立すると定めています。構成的占有なしに質権は成立しません。",
    },
    prc_intangible_perpetual_duration: {
      message:
        "中国のIP権利には法定期限があり、永久の存続は利用できません。",
      detail:
        "発明特許20年、実用新案/意匠10年。著作権は著作者の生存期間+50年。商標のみ10年単位で無期限更新可能です。",
    },
  },
};

export function localizeViolation(violation, locale) {
  const copy = VIOLATION_TEXT[locale]?.[violation.id];

  if (!copy) {
    return violation;
  }

  return {
    ...violation,
    message: copy.message ?? violation.message,
    detail: copy.detail ?? violation.detail,
    authority: copy.authority ?? violation.authority,
  };
}
