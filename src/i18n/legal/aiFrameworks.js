const AI_FRAMEWORK_TEXT = {
  zh: {
    eu_ai_act_high_risk: {
      name: "欧盟《AI法案》：高风险系统",
      description:
        "附件 III 列举的系统，需进行强制合规评估、在欧盟数据库登记并接受上市后监测。",
      notes:
        "核心要求是强制评估、登记和持续监管，覆盖关键基础设施、教育、就业、公共服务、执法、移民与司法等场景。",
    },
    eu_ai_act_prohibited: {
      name: "欧盟《AI法案》：被禁止实践",
      description:
        "无论采取何种防护措施都被绝对禁止的系统，例如社会评分、实时生物识别监控和对脆弱群体的操纵。",
      notes:
        "属于绝对禁止条款，不存在合规进入路径。",
    },
    open_source_model: {
      name: "开源模型（如 Llama、Mistral）",
      description:
        "模型权重公开发布，采用开放或宽松许可，可自由下载和再分发。",
      notes:
        "高可转移性与高可复制性通常伴随较低访问控制，部署后治理约束更依赖下游实践。",
    },
    closed_api_model: {
      name: "闭源 API 模型（如 GPT、Claude）",
      description:
        "模型权重专有，通过商业 API 门控访问并由提供方集中控制。",
      notes:
        "典型特征是高价值捕获、低可转移性和高访问控制。",
    },
    frontier_model_pre_release: {
      name: "前沿模型：发布前安全评估阶段",
      description:
        "能力已确认但尚未公开，正在进行内部或第三方安全评估。",
      notes:
        "高能力与高限制并存，重点是发布前评估与风险缓释。",
    },
    uk_framework: {
      name: "英国：促创新 AI 监管框架",
      description:
        "基于原则、按行业分工的监管结构，没有单一 AI 监管者和统一前置审批路径。",
      notes:
        "强调跨行业原则和现有监管机构协同，整体弹性较高。",
    },
    china_ai_regulation: {
      name: "中国：算法/生成式/深度合成三层规制",
      description:
        "由算法推荐、生成式 AI 与深度合成规则共同构成，面向上线前安全与内容治理提出要求。",
      notes:
        "突出上线前评估、平台责任与内容合规联动。",
    },
    no_governance: {
      name: "无监管部署",
      description:
        "没有明确治理框架约束，七个维度均处于开放区间。",
      notes:
        "可作为对照基线，用于识别“无制度约束”状态与制度化框架之间的差异。",
    },
  },
  de: {
    eu_ai_act_high_risk: {
      name: "EU AI Act — Hochrisikosystem",
      description:
        "In Anhang III gelistete Systeme mit verpflichtender Konformitätsbewertung, EU-Datenbankeintrag und Marktüberwachung.",
      notes:
        "Kern sind Pflichtprüfung, Registrierung und fortlaufende Aufsicht in sensiblen Sektoren.",
    },
    eu_ai_act_prohibited: {
      name: "EU AI Act — Verbotene Praxis",
      description:
        "Systeme, deren Einsatz unabhängig von Schutzmaßnahmen absolut untersagt ist, etwa Social Scoring oder Echtzeit-Biometrieüberwachung.",
      notes:
        "Absolute Verbotskategorie ohne regulären Zulassungspfad.",
    },
    open_source_model: {
      name: "Open-Source-Modell (z. B. Llama, Mistral)",
      description:
        "Öffentlich bereitgestellte Modellgewichte mit freier oder offener Lizenz, herunterladbar und weiterverteilbar.",
      notes:
        "Hohe Übertragbarkeit und Replizierbarkeit gehen häufig mit geringer Zugangskontrolle einher.",
    },
    closed_api_model: {
      name: "Geschlossenes API-Modell (z. B. GPT, Claude)",
      description:
        "Proprietäre Modellgewichte; Zugriff erfolgt kontrolliert über eine kommerzielle API.",
      notes:
        "Typisches Profil: hohe Wertabschöpfung, niedrige Übertragbarkeit, starke Zugangskontrolle.",
    },
    frontier_model_pre_release: {
      name: "Frontier-Modell — Vorfreigabe-Sicherheitsphase",
      description:
        "Fähigkeiten bestätigt, aber noch nicht öffentlich verfügbar; derzeit interne oder externe Sicherheitsprüfung.",
      notes:
        "Hohe Fähigkeiten bei maximaler Restriktion, Fokus auf Pre-Release-Risikomanagement.",
    },
    uk_framework: {
      name: "UK Pro-Innovation AI Regulation",
      description:
        "Prinzipienbasiertes, sektorspezifisches Modell ohne zentrale AI-Behörde und ohne einheitlichen Vorabzulassungsweg.",
      notes:
        "Breite Bandbreiten spiegeln bewusst regulatorische Flexibilität wider.",
    },
    china_ai_regulation: {
      name: "VR China: Algorithmus-/GenAI-/Deep-Synthesis-Regime",
      description:
        "Überlappende Regelwerke für Empfehlungssysteme, generative AI und synthetische Medien mit vorgelagerter Sicherheitslogik.",
      notes:
        "Betont Vorabprüfung, Plattformpflichten und inhaltliche Compliance.",
    },
    no_governance: {
      name: "Unregulierter Einsatz",
      description:
        "Kein Governance-Framework greift; alle sieben Dimensionen bleiben offen.",
      notes:
        "Nutzt man als Baseline, um institutionell ungebundene Konfigurationen sichtbar zu machen.",
    },
  },
  ja: {
    eu_ai_act_high_risk: {
      name: "EU AI法：高リスクシステム",
      description:
        "附属書IIIに列挙されるシステムで、適合性評価・EUデータベース登録・市販後監視が必須です。",
      notes:
        "重要分野に対して、事前評価と継続監督を制度的に求める構成です。",
    },
    eu_ai_act_prohibited: {
      name: "EU AI法：禁止行為",
      description:
        "保護措置の有無にかかわらず配備が絶対禁止される類型（社会的スコアリング等）。",
      notes:
        "適合法の経路がない絶対禁止カテゴリです。",
    },
    open_source_model: {
      name: "オープンソースモデル（例：Llama、Mistral）",
      description:
        "モデル重みが公開され、オープンまたは寛容なライセンスで再配布可能な構成です。",
      notes:
        "高い移転可能性・複製可能性と低いアクセス制御が併存しやすい類型です。",
    },
    closed_api_model: {
      name: "クローズドAPIモデル（例：GPT、Claude）",
      description:
        "モデル重みは非公開で、商用API経由でアクセスを統制する構成です。",
      notes:
        "高い価値捕捉と強いアクセス管理、低い移転可能性が典型です。",
    },
    frontier_model_pre_release: {
      name: "フロンティアモデル：公開前安全評価段階",
      description:
        "能力は確認済みだが未公開で、社内または第三者による安全評価中の段階です。",
      notes:
        "高能力と高制限が同時に現れるため、公開前評価が中心課題になります。",
    },
    uk_framework: {
      name: "英国：プロイノベーション型AI規制",
      description:
        "原則ベースかつ分野別運用で、単一のAI規制当局や一律の事前承認制度を持たない枠組みです。",
      notes:
        "既存規制当局の分担運用を重視し、柔軟性を確保する設計です。",
    },
    china_ai_regulation: {
      name: "中国：アルゴリズム/生成AI/深層合成ガバナンス",
      description:
        "推薦アルゴリズム、生成AI、深層合成の各規制を組み合わせた多層的ガバナンス構成です。",
      notes:
        "事前評価、プラットフォーム責任、コンテンツ整合を一体で扱います。",
    },
    no_governance: {
      name: "無規制配備",
      description:
        "明示的なガバナンス枠組みが適用されず、七次元が実質的に無制約の状態です。",
      notes:
        "制度的制約がない基準線として、他フレームワークとの比較に使えます。",
    },
  },
};

export function localizeAIFramework(framework, locale) {
  const localized = AI_FRAMEWORK_TEXT[locale]?.[framework.id];

  if (!localized) {
    return framework;
  }

  return {
    ...framework,
    name: localized.name ?? framework.name,
    description: localized.description ?? framework.description,
    notes: localized.notes ?? framework.notes,
    authority: localized.authority ?? framework.authority,
  };
}
