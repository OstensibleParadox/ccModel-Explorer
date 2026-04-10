export const UI_ENHANCEMENTS = {
  en: {
    sliderPanel: {
      copyIntl:
        "Switch to the international economic law lens to relabel the seven dimensions and compare each term's eigenvalue share inside the current bundle. Match-card percentages remain match scores.",
      commonLawContext: "Common-Law Context",
      civilLawContext: "Civil-Law Context",
      eigenvalueShare: "Eigenvalue Share",
      whyButton: "Why?",
      selectedHint: (arrangement) =>
        `Selected ${arrangement}. Click the same pill again to lock its doctrinal range.`,
      lockedHint: (arrangement) =>
        `Locked to ${arrangement}. Highlighted bands show its doctrinal range; drag outside them to test violations.`,
      becomeMessage: (arrangement, alternative) =>
        `You are leaving ${arrangement} territory — closest match is now ${alternative}.`,
      illegalMessage: (arrangement) =>
        `This configuration has moved outside ${arrangement} and does not match a recognized legal arrangement.`,
      independentTrackNote:
        "Each legal track computes matches independently. See the convergence panel below for cross-tradition comparison.",
      commonLawContextHints: {
        uk: "UK context narrows registered-land adverse possession after the Land Registration Act 2002 and treats fee tail as effectively historical.",
        us: "US context keeps adverse possession more operational and fee tail mostly historical, with limited survival in a few states.",
      },
    },
    modal: {
      rangeViolation: (dimension) => `Range Violation: ${dimension}`,
      requiresRange: (estate, dimension, min, max, current) =>
        `${estate} requires ${dimension} in range [${min}, ${max}]. Current value: ${current}.`,
      legalReasoning: "Legal Reasoning",
      caseLaw: "Case Law",
      consequences: "Consequences",
      dismiss: "Dismiss",
      snapTo: (arrangement) => `Snap to ${arrangement}`,
      fallbackNote: "Detailed legal analysis is pending for this dimension. The range constraint is derived from cross-jurisdictional estate profiling.",
    },
    termModes: {
      aria: "Terminology lens",
      property: "Property Law",
      internationalEconomic: "International Economic Law",
    },
    modeSwitcher: {
      aria: "Explorer mode",
      property: "Property Law Mode",
      ai: "AI Governance Mode",
    },
    eigenspaceToggle: "Eigenspace View",
    eigenspacePanel: {
      title: "Eigenspace Projection",
      isomorphicTo: "Your configuration is isomorphic to",
      varianceExplained: "Variance explained",
      noMatch: "Move sliders to explore the eigenspace",
      legend: {
        commonLaw: "Common Law",
        civilLaw: "Civil Law",
        ai: "AI Framework",
        user: "Your Config",
      },
      tooltip: {
        distance: "Distance",
        features: "Features",
        dimensions: {
          possession: "Possession",
          use: "Use",
          income: "Income",
          alienation: "Alienation",
          exclusion: "Exclusion",
          duration: "Duration",
          inheritability: "Inheritability",
        },
      },
      inspector: {
        overlapRule: "Overlap rule",
        distanceThreshold: "Distance / threshold",
        pcSpaceBreakdown: "PC-space breakdown",
        topVariance: (percentage) => `Top 3 PCs: ${percentage}% of variance`,
        discardedVariance: (percentage) =>
          `Discarded variance (PC4-PC7): ${percentage}%`,
        residualWarning: (capturedPercentage) =>
          `3D projection captures only ${capturedPercentage}% of structural variance; matches may not reflect higher-dimensional differences.`,
        cosine7D: "Full 7D cosine similarity",
        cosineSecondary: "descriptive, not the trigger mechanism",
        humanitiesExplanation: {
          title: "What does this mean?",
          distance: "The engine plots your custom sliders and the established legal frameworks as dots in a multi-dimensional space. The shorter the 'Distance', the more similar they are.",
          pcBreakdown: "We compress 7 complex dimensions into 3 primary ones (PC1, 2, 3) so they can be drawn on screen. These three capture most of the legal differences.",
          residual: "The 'discarded' part is the nuance lost when flattening a 7-dimensional concept into a 3D picture. If this is high, the shapes might look close here but differ in details.",
          cosine: "A pure mathematical angle comparison between the two 7D shapes, confirming the match without any compression loss."
        },
      },
    },
    aiMode: {
      heroKicker: "AI Governance — Constraint Cascade",
      heroText:
        "The same seven-dimension constraint cascade logic maps any AI system configuration to known governance frameworks. Adjust the sliders and watch violations fire in real time.",
      metrics: {
        frameworks: "7 governance frameworks",
        violations: "3 violation rules",
        demo: "FAccT 2026 demo",
      },
      frameworkPresets: "Framework Presets",
      panelKicker: "Framework Matching",
      panelTitle: "AI Governance Mode",
      panelSubtitle:
        "The same constraint cascade logic maps this configuration to known AI governance frameworks.",
      ranks: {
        framework: (index) => `#${index} framework fit`,
      },
      noGovernanceLabel: "No-governance baseline",
    },
    harmonisation: {
      kicker: "Harmonisation",
      title: "International Instruments",
      idle:
        "Move sliders until both tracks match to see which international instruments have operationalised this configuration.",
      empty:
        "No international instruments are triggered by the current configuration.",
      overshoot: "Harmonisation Overshoot",
    },
  },
  zh: {
    sliderPanel: {
      copyIntl:
        "切换到国际经济法术语镜头后，七维会改用国际经济法术语，并显示各术语在当前权利束中的 eigenvalue 占比。结果卡片上的百分比仍然是匹配分数，不是 eigenvalue。",
      commonLawContext: "普通法上下文",
      civilLawContext: "大陆法上下文",
      eigenvalueShare: "eigenvalue 占比",
      whyButton: "为什么？",
      selectedHint: (arrangement) =>
        `已选择${arrangement}。再次点击同一个预设即可锁定其法教义区间。`,
      lockedHint: (arrangement) =>
        `已锁定到${arrangement}。高亮区间显示其法教义范围；拖到区间外即可测试违反。`,
      becomeMessage: (arrangement, alternative) =>
        `您正在脱离${arrangement}的范围——当前最接近的匹配是${alternative}。`,
      illegalMessage: (arrangement) =>
        `此配置已超出${arrangement}的范围，不符合任何已知法律安排。`,
      independentTrackNote:
        "两个法律传统的匹配独立计算。请参阅下方的趋同面板进行跨传统比较。",
      commonLawContextHints: {
        uk: "英国法语境会明显收紧登记土地上的逆权占有，并把 fee tail 视为基本只剩历史意义的类别。",
        us: "美国法语境下，逆权占有仍更具操作性；fee tail 在绝大多数州已历史化，但少数州仍留有残迹。",
      },
    },
    modal: {
      rangeViolation: (dimension) => `范围违反：${dimension}`,
      requiresRange: (estate, dimension, min, max, current) =>
        `${estate}要求${dimension}在 [${min}, ${max}] 范围内。当前值：${current}。`,
      legalReasoning: "法律推理",
      caseLaw: "判例法",
      consequences: "后果",
      dismiss: "关闭",
      snapTo: (arrangement) => `跳转到${arrangement}`,
      fallbackNote: "该维度的详细法律分析尚待完成。范围约束基于跨法域地产分析得出。",
    },
    termModes: {
      aria: "术语镜头",
      property: "财产法术语",
      internationalEconomic: "国际经济法术语",
    },
    modeSwitcher: {
      aria: "探索模式",
      property: "财产法模式",
      ai: "AI治理模式",
    },
    eigenspaceToggle: "特征空间视图",
    eigenspacePanel: {
      title: "特征空间投影",
      isomorphicTo: "当前配置同构于",
      varianceExplained: "方差解释率",
      noMatch: "移动滑块以探索特征空间",
      legend: {
        commonLaw: "普通法",
        civilLaw: "大陆法",
        ai: "AI治理框架",
        user: "当前配置",
      },
      tooltip: {
        distance: "距离",
        features: "特征",
        dimensions: {
          possession: "占有",
          use: "使用",
          income: "收益",
          alienation: "处分",
          exclusion: "排他",
          duration: "存续",
          inheritability: "继承",
        },
      },
      inspector: {
        overlapRule: "重叠规则",
        distanceThreshold: "距离 / 阈值",
        pcSpaceBreakdown: "主成分空间拆解",
        topVariance: (percentage) => `前三个主成分：解释 ${percentage}% 方差`,
        discardedVariance: (percentage) =>
          `被舍弃的方差（PC4-PC7）：${percentage}%`,
        residualWarning: (capturedPercentage) =>
          `3D 投影仅捕获了 ${capturedPercentage}% 的结构方差；匹配结果可能无法反映更高维度的差异。`,
        cosine7D: "完整 7D 余弦相似度",
        cosineSecondary: "描述性指标，不是触发机制",
        humanitiesExplanation: {
          title: "这是什么意思？",
          distance: "系统将您设定的参数和既有框架均转化为多维空间中的坐标点。“距离”越短，意味着两者的内在结构越相似。",
          pcBreakdown: "为了在屏幕上绘图，我们将7个复杂的权利维度降维为3个核心成分（PC1、2、3），它们捕捉了大部分的实质性差异。",
          residual: "“被舍弃的方差”指7维概念被拍平成3D图像时丢失的细微差别。若该数值较高，意味着两者在图上看起来接近，但在某些深层维度上仍有分歧。",
          cosine: "一种不受降维压缩影响的纯数学计算，它在完整的7维空间中验证两者的最终形态相似度。"
        },
      },
    },
    aiMode: {
      heroKicker: "AI治理：约束级联",
      heroText:
        "同一套七维约束级联逻辑可以把任意 AI 配置映射到已知治理框架。调节滑块，即可实时看到违规提示。",
      metrics: {
        frameworks: "7 个治理框架",
        violations: "3 条违规规则",
        demo: "FAccT 2026 演示",
      },
      frameworkPresets: "框架预设",
      panelKicker: "框架匹配",
      panelTitle: "AI治理模式",
      panelSubtitle:
        "同一套约束级联逻辑会把当前配置映射到已知 AI 治理框架。",
      ranks: {
        framework: (index) => `#${index} 框架匹配`,
      },
      noGovernanceLabel: "无治理基线",
    },
    harmonisation: {
      kicker: "协调化",
      title: "国际法文书",
      idle: "把滑块继续推到普通法和大陆法两轨同时稳定匹配时，再看哪些国际文书已经把这种结构操作化。",
      empty: "当前配置尚未触发任何国际法文书。",
      overshoot: "协调化超调",
    },
  },
  de: {
    sliderPanel: {
      copyIntl:
        "Der begriffliche Layer des internationalen Wirtschaftsrechts benennt die sieben Dimensionen um und zeigt den Eigenwertanteil jedes Terms im aktuellen Bündel. Die Prozentwerte in den Trefferkarten bleiben Match-Scores.",
      commonLawContext: "Common-Law-Kontext",
      civilLawContext: "Zivilrechtskontext",
      eigenvalueShare: "Eigenwertanteil",
      whyButton: "Warum?",
      selectedHint: (arrangement) =>
        `${arrangement} ist ausgewählt. Klicken Sie dieselbe Schaltfläche erneut, um den doktrinären Bereich zu sperren.`,
      lockedHint: (arrangement) =>
        `${arrangement} ist jetzt gesperrt. Die hervorgehobenen Bänder zeigen den doktrinären Bereich; ziehen Sie darüber hinaus, um Verstöße zu testen.`,
      becomeMessage: (arrangement, alternative) =>
        `Sie verlassen den Bereich von ${arrangement} — nächste Übereinstimmung ist jetzt ${alternative}.`,
      illegalMessage: (arrangement) =>
        `Diese Konfiguration liegt außerhalb von ${arrangement} und entspricht keiner anerkannten Rechtsform.`,
      independentTrackNote:
        "Jede Rechtstradition berechnet Übereinstimmungen unabhängig. Siehe Konvergenz-Panel unten für traditionsübergreifende Vergleiche.",
      commonLawContextHints: {
        uk: "Der UK-Kontext verengt adverse possession bei registriertem Land nach dem Land Registration Act 2002 deutlich und behandelt fee tail praktisch nur noch historisch.",
        us: "Der US-Kontext hält adverse possession operativer; fee tail ist meist historisch, lebt aber in wenigen Staaten in Restformen fort.",
      },
    },
    modal: {
      rangeViolation: (dimension) => `Bereichsverletzung: ${dimension}`,
      requiresRange: (estate, dimension, min, max, current) =>
        `${estate} erfordert ${dimension} im Bereich [${min}, ${max}]. Aktueller Wert: ${current}.`,
      legalReasoning: "Rechtliche Begründung",
      caseLaw: "Rechtsprechung",
      consequences: "Folgen",
      dismiss: "Schließen",
      snapTo: (arrangement) => `Zu ${arrangement} wechseln`,
      fallbackNote: "Die ausführliche rechtliche Analyse für diese Dimension steht noch aus. Die Bereichsbeschränkung basiert auf jurisdiktionsübergreifender Analyse.",
    },
    termModes: {
      aria: "Begriffslinse",
      property: "Eigentumsrecht",
      internationalEconomic: "Internationales Wirtschaftsrecht",
    },
    modeSwitcher: {
      aria: "Explorer-Modus",
      property: "Sachenrechtsmodus",
      ai: "AI-Governance-Modus",
    },
    eigenspaceToggle: "Eigenraum-Ansicht",
    eigenspacePanel: {
      title: "Eigenraum-Projektion",
      isomorphicTo: "Ihre Konfiguration ist isomorph zu",
      varianceExplained: "Erklärte Varianz",
      noMatch: "Bewegen Sie die Slider, um den Eigenraum zu erkunden",
      legend: {
        commonLaw: "Common Law",
        civilLaw: "Zivilrecht",
        ai: "AI-Framework",
        user: "Ihre Konfiguration",
      },
      tooltip: {
        distance: "Distanz",
        features: "Merkmale",
        dimensions: {
          possession: "Besitz",
          use: "Nutzung",
          income: "Ertrag",
          alienation: "Veräußerung",
          exclusion: "Ausschluss",
          duration: "Dauer",
          inheritability: "Vererbbarkeit",
        },
      },
      inspector: {
        overlapRule: "Überlappungsregel",
        distanceThreshold: "Distanz / Schwelle",
        pcSpaceBreakdown: "Aufschlüsselung im PC-Raum",
        topVariance: (percentage) => `Top-3-PCs: ${percentage}% der Varianz`,
        discardedVariance: (percentage) =>
          `Verworfene Varianz (PC4-PC7): ${percentage}%`,
        residualWarning: (capturedPercentage) =>
          `Die 3D-Projektion erfasst nur ${capturedPercentage}% der strukturellen Varianz; Treffer spiegeln höherdimensionale Unterschiede möglicherweise nicht wider.`,
        cosine7D: "Kosinusähnlichkeit im vollständigen 7D-Raum",
        cosineSecondary: "deskriptiv, nicht der Auslösemechanismus",
        humanitiesExplanation: {
          title: "Was bedeutet das?",
          distance: "Die Engine stellt Ihre Regler und die Rechtsrahmen als Punkte in einem mehrdimensionalen Raum dar. Je kürzer die 'Distanz', desto ähnlicher sind sie.",
          pcBreakdown: "Wir komprimieren 7 komplexe Dimensionen zu 3 Hauptkomponenten (PC1, 2, 3), um sie auf dem Bildschirm darzustellen. Diese erfassen die wesentlichen Unterschiede.",
          residual: "Der 'verworfene' Teil sind Nuancen, die verloren gehen, wenn ein 7D-Konzept in ein 3D-Bild abgeflacht wird. Ist dieser Wert hoch, weichen sie im Detail ab.",
          cosine: "Ein rein mathematischer Winkelvergleich im vollen 7D-Raum, der die Übereinstimmung ohne Kompressionsverluste bestätigt."
        },
      },
    },
    aiMode: {
      heroKicker: "AI-Governance — Constraint Cascade",
      heroText:
        "Dieselbe siebendimensionale Constraint-Cascade-Logik ordnet jede AI-Konfiguration bekannten Governance-Frameworks zu. Bewege die Slider und beobachte Verstöße in Echtzeit.",
      metrics: {
        frameworks: "7 Governance-Frameworks",
        violations: "3 Verstoßregeln",
        demo: "FAccT-2026-Demo",
      },
      frameworkPresets: "Framework-Voreinstellungen",
      panelKicker: "Framework-Matching",
      panelTitle: "AI-Governance-Modus",
      panelSubtitle:
        "Dieselbe Constraint-Cascade-Logik ordnet diese Konfiguration bekannten AI-Governance-Frameworks zu.",
      ranks: {
        framework: (index) => `#${index} Framework-Treffer`,
      },
      noGovernanceLabel: "Unregulierte Baseline",
    },
    harmonisation: {
      kicker: "Harmonisierung",
      title: "Internationale Instrumente",
      idle:
        "Verschiebe die Slider, bis beide Spuren tragfähig matchen, um zu sehen, welche internationalen Instrumente diese Konfiguration bereits operationalisiert haben.",
      empty:
        "Die aktuelle Konfiguration löst keine internationalen Instrumente aus.",
      overshoot: "Harmonisierungsüberschuss",
    },
  },
  ja: {
    sliderPanel: {
      copyIntl:
        "国際経済法の術語レンズに切り替えると、七次元が国際経済法の語彙に置き換わり、各術語の eigenvalue 比率も表示されます。カード上の百分率は引き続き一致スコアであり、eigenvalue ではありません。",
      commonLawContext: "コモンロー文脈",
      civilLawContext: "大陸法文脈",
      eigenvalueShare: "eigenvalue 比率",
      whyButton: "なぜ？",
      selectedHint: (arrangement) =>
        `${arrangement}を選択しました。同じピルをもう一度押すと法教義上の範囲をロックします。`,
      lockedHint: (arrangement) =>
        `${arrangement}にロックしました。ハイライト帯が法教義上の範囲を示し、その外側へ動かすと違反を確認できます。`,
      becomeMessage: (arrangement, alternative) =>
        `${arrangement}の範囲を離れています——現在最も近い一致は${alternative}です。`,
      illegalMessage: (arrangement) =>
        `この構成は${arrangement}の範囲外であり、認められた法的形態に該当しません。`,
      independentTrackNote:
        "各法的伝統は独立してマッチングを計算します。伝統間の比較はコンバージェンスパネルをご覧ください。",
      commonLawContextHints: {
        uk: "UK 文脈では Land Registration Act 2002 以後、登録土地での adverse possession がかなり狭まり、fee tail もほぼ歴史的分類として扱われます。",
        us: "US 文脈では adverse possession がなお実務的で、fee tail は大半の州で歴史化していますが一部には残滓があります。",
      },
    },
    modal: {
      rangeViolation: (dimension) => `範囲違反：${dimension}`,
      requiresRange: (estate, dimension, min, max, current) =>
        `${estate}は${dimension}が [${min}, ${max}] の範囲内であることを必要とします。現在値：${current}。`,
      legalReasoning: "法的推論",
      caseLaw: "判例法",
      consequences: "結果",
      dismiss: "閉じる",
      snapTo: (arrangement) => `${arrangement}に移行`,
      fallbackNote: "この次元の詳細な法的分析はまだ準備中です。範囲制約は法域横断的な分析に基づいています。",
    },
    termModes: {
      aria: "術語レンズ",
      property: "財産法術語",
      internationalEconomic: "国際経済法術語",
    },
    modeSwitcher: {
      aria: "探索モード",
      property: "財産法モード",
      ai: "AIガバナンスモード",
    },
    eigenspaceToggle: "固有空間ビュー",
    eigenspacePanel: {
      title: "固有空間投影",
      isomorphicTo: "この構成は以下と同型です",
      varianceExplained: "説明された分散",
      noMatch: "スライダーを動かして固有空間を探索してください",
      legend: {
        commonLaw: "コモン・ロー",
        civilLaw: "大陸法",
        ai: "AIフレームワーク",
        user: "現在の構成",
      },
      tooltip: {
        distance: "距離",
        features: "特徴",
        dimensions: {
          possession: "占有",
          use: "使用",
          income: "収益",
          alienation: "処分",
          exclusion: "排他",
          duration: "存続",
          inheritability: "相続",
        },
      },
      inspector: {
        overlapRule: "重なり判定ルール",
        distanceThreshold: "距離 / しきい値",
        pcSpaceBreakdown: "PC 空間での内訳",
        topVariance: (percentage) => `上位 3 主成分:  分散の ${percentage}%`,
        discardedVariance: (percentage) =>
          `切り捨てた分散（PC4-PC7）: ${percentage}%`,
        residualWarning: (capturedPercentage) =>
          `3D 投影が捉えている構造分散は ${capturedPercentage}% のみであり、高次元での差異を一致結果が反映しない可能性があります。`,
        cosine7D: "完全な 7D コサイン類似度",
        cosineSecondary: "説明用であり、判定トリガーではありません",
        humanitiesExplanation: {
          title: "これは何を意味しますか？",
          distance: "エンジンは、スライダー設定と既存の枠組みを多次元空間の点としてプロットします。「距離」が短いほど、両者の構造が類似していることを意味します。",
          pcBreakdown: "画面に描画するため、7つの複雑な次元を3つの主成分（PC1、2、3）に圧縮しています。これら3つで、違いの大部分を捉えています。",
          residual: "「切り捨てられた分散」は、7次元の概念を3Dに平坦化する際に失われるニュアンスです。この値が高い場合、図上では近くても詳細が異なります。",
          cosine: "圧縮による情報の損失なしに、完全な7次元空間において両者の形状の一致を確認するための純粋な数学的角度の比較です。"
        },
      },
    },
    aiMode: {
      heroKicker: "AIガバナンス：制約カスケード",
      heroText:
        "同じ七次元の制約カスケード論理で、任意の AI 構成を既知のガバナンス枠組みに対応づけます。スライダーを動かすと違反が即時に表示されます。",
      metrics: {
        frameworks: "7 つのガバナンス枠組み",
        violations: "3 つの違反ルール",
        demo: "FAccT 2026 デモ",
      },
      frameworkPresets: "フレームワーク・プリセット",
      panelKicker: "フレームワーク適合",
      panelTitle: "AIガバナンスモード",
      panelSubtitle:
        "同じ制約カスケード論理で、この構成を既知の AI ガバナンス枠組みに対応づけます。",
      ranks: {
        framework: (index) => `#${index} フレームワーク適合`,
      },
      noGovernanceLabel: "無規制ベースライン",
    },
    harmonisation: {
      kicker: "調和化",
      title: "国際文書",
      idle:
        "両トラックが安定して一致するまでスライダーを動かすと、この構成をすでに実装している国際文書が見えてきます。",
      empty:
        "現在の構成では、該当する国際文書はまだ起動していません。",
      overshoot: "調和化オーバーシュート",
    },
  },
};
