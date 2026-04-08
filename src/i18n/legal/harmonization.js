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
