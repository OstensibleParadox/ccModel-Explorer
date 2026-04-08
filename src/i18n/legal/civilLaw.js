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
