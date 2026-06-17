window.PREGNANCY_DASHBOARD_DATA = {
  generatedFrom: [
    "../technical-data/extracted/visual-transcription.json",
    "../human-readable/screening_info_1.md",
    "../human-readable/deep-research-report.md",
    "../technical-data/manifest.json"
  ],
  pregnancy: {
    patientName: "Galina Voitina",
    patientNameDocument: "VOITINA, GALINA",
    dateOfBirth: "1994-07-10",
    documentType: "Mutterpass",
    lmp: "2026-03-25",
    pregnancyConfirmedOn: "2026-05-12",
    pregnancyConfirmedGestationalAge: "6+6",
    dueDate: "2026-12-30"
  },
  screenings: [
    {
      id: "early-screening",
      title: "Ранний скрининг",
      date: "2026-05-12",
      gestationalAge: "6+6",
      source: "screening_info_1.md",
      confidence: "high",
      summary: "Fruehschwangerschaft в Praxis Dr. Sofia Severin. Срок по клиническому расчету и УЗИ совпадает.",
      measurements: [
        { label: "SSL / КТР", value: "0.86 см", note: "соответствует 6 недель 6 дней" },
        { label: "GS", value: "3.67 см", note: "соответствует 8 недель 6 дней" },
        { label: "ПДР", value: "30.12.2026", note: "из скрининга" }
      ]
    },
    {
      id: "mutterpass-screening-1",
      title: "Mutterpass I Screening",
      date: "2026-06-12",
      gestationalAge: "11+2",
      source: "pregnancy-info-05",
      confidence: "medium",
      summary: "Первая запись УЗИ из Mutterpass. Часть полей надежна, часть помечена как требующая сверки с оригиналом.",
      measurements: [
        { label: "SSL", value: "53,5 мм", note: "уверенность высокая" },
        { label: "BPD", value: "18,4 мм", note: "уверенность средняя" },
        { label: "Herzaktion", value: "ja", note: "уверенность высокая" }
      ]
    }
  ],
  visits: [
    {
      date: "2026-05-12",
      gestationalAge: "6+6",
      fundus: "S",
      fetalHeartSounds: "+",
      hb: "124",
      weightKg: "",
      bloodPressure: "",
      urine: "",
      confidence: "medium",
      source: "pregnancy-info-04",
      notes: "Правая колонка содержит неразборчивую рукописную пометку."
    },
    {
      date: "2026-06-12",
      gestationalAge: "11+2",
      fundus: "2/S или 2/5",
      fetalHeartSounds: "++",
      hb: "",
      weightKg: "54,7 кг",
      bloodPressure: "120/80",
      urine: "Eiweiss +, Zucker -",
      confidence: "low",
      source: "pregnancy-info-04",
      notes: "Fundusstand, вагинальный осмотр и Sonstiges/Therapie нужно сверить с оригиналом."
    }
  ],
  labTests: [
    {
      title: "HIV-Suchtest",
      date: "2026-05-13",
      status: "durchgefuehrt",
      source: "pregnancy-info-02",
      confidence: "high"
    }
  ],
  events: [
    { date: "2026-03-25", type: "medical", title: "LMP", detail: "Первый день последней менструации.", source: "pregnancy-info-03", confidence: "high" },
    { date: "2026-05-12", type: "medical", title: "Беременность подтверждена", detail: "Указан срок 6+6.", source: "pregnancy-info-03", confidence: "medium" },
    { date: "2026-05-12", type: "medical", title: "Ранний скрининг", detail: "SSL 0.86 см, GS 3.67 см.", source: "screening_info_1.md", confidence: "high" },
    { date: "2026-05-13", type: "medical", title: "HIV-Suchtest", detail: "Статус: durchgefuehrt.", source: "pregnancy-info-02", confidence: "high" },
    { date: "2026-06-12", type: "medical", title: "Визит Mutterpass", detail: "Срок 11+2, вес 54,7 кг, RR 120/80.", source: "pregnancy-info-04", confidence: "low" },
    { date: "2026-06-12", type: "medical", title: "Mutterpass I Screening", detail: "SSL 53,5 мм, BPD 18,4 мм.", source: "pregnancy-info-05", confidence: "medium" },
    { date: "2026-06-30", type: "admin", title: "Сценарий Elterngeld / Elternzeit", detail: "Посчитать роли родителей, Basiselterngeld, ElterngeldPlus и Partnermonate.", source: "deep-research-report.md", confidence: "high" },
    { date: "2026-07-31", type: "admin", title: "Место родов и Kinderarzt", detail: "Выбрать предполагаемое место родов, начать поиск Kinderarzt для U3.", source: "deep-research-report.md", confidence: "high" },
    { date: "2026-08-31", type: "admin", title: "Проверка документов", detail: "Паспорта, Aufenthaltstitel, свидетельства, переводы, апостили/легализация.", source: "deep-research-report.md", confidence: "high" },
    { date: "2026-09-30", type: "admin", title: "Mutterschaftsgeld", detail: "Подготовить пакет и уточнить подачу в Krankenkasse или BAS.", source: "deep-research-report.md", confidence: "high" },
    { date: "2026-11-11", type: "admin", title: "Дедлайн Elternzeit с рождения", detail: "Ориентир для отца/второго родителя: примерно за 7 недель до ПДР.", source: "calculated-from-due-date", confidence: "high" },
    { date: "2026-11-18", type: "admin", title: "Старт Mutterschutz", detail: "Ориентировочно 6 недель до ПДР 30.12.2026.", source: "calculated-from-due-date", confidence: "high" },
    { date: "2026-12-30", type: "medical", title: "ПДР", detail: "Расчетная дата родов.", source: "pregnancy-info-03", confidence: "high" },
    { date: "2027-01-06", type: "admin", title: "Standesamt / Geburtsurkunde", detail: "Регистрация рождения и заказ свидетельств в первую неделю после родов.", source: "calculated-from-due-date", confidence: "high" },
    { date: "2027-01-09", type: "medical", title: "U2 окно", detail: "Ориентир 3-10 день жизни, если роды в ПДР.", source: "deep-research-report.md", confidence: "high" },
    { date: "2027-02-03", type: "medical", title: "U3 окно", detail: "Ориентир 4-5 неделя жизни, если роды в ПДР.", source: "deep-research-report.md", confidence: "high" },
    { date: "2027-03-30", type: "admin", title: "Elterngeld", detail: "Цель: подать в первые 3 Lebensmonate.", source: "calculated-from-due-date", confidence: "high" },
    { date: "2027-06-30", type: "admin", title: "Kindergeld retroactive limit", detail: "Ориентир 6 месяцев для rueckwirkende выплаты.", source: "calculated-from-due-date", confidence: "high" }
  ],
  phases: [
    {
      title: "Сейчас",
      range: "июнь 2026",
      items: [
        "Подтвердить медицинское наблюдение и следующие Termine.",
        "Начать или подтвердить поиск Hebamme.",
        "Посчитать сценарий Elterngeld / Elternzeit для обоих родителей.",
        "Сверить сомнительные рукописные поля Mutterpass."
      ]
    },
    {
      title: "Лето 2026",
      range: "июль - август",
      items: [
        "Выбрать предполагаемое место родов.",
        "Начать поиск Kinderarzt для U3.",
        "Уточнить местные правила Kitaplatz / Kindertagespflege через Jugendamt.",
        "Проверить оригиналы, переводы и апостили/легализации."
      ]
    },
    {
      title: "Осень 2026",
      range: "сентябрь - ноябрь",
      items: [
        "Подготовить Mutterschaftsgeld и справку о ПДР.",
        "Проверить уведомления работодателям по Elternzeit.",
        "Собрать пакет для Standesamt.",
        "Держать шаблоны писем готовыми на случай ранних родов."
      ]
    },
    {
      title: "После родов",
      range: "декабрь 2026 - март 2027",
      items: [
        "Зарегистрировать рождение и получить Geburtsurkunde.",
        "Запустить страхование ребенка, Kindergeld и Elterngeld.",
        "При необходимости подать на Aufenthaltstitel ребенка.",
        "Подтвердить U2/U3 и дальнейшие U-Untersuchungen."
      ]
    }
  ],
  documents: [
    "Паспорта родителей",
    "Aufenthaltstitel / eAT родителей",
    "Свидетельства о рождении родителей",
    "Свидетельство о браке или документы о разводе, если применимо",
    "Присяжные переводы иностранных документов",
    "Apostille / Legalisation, если требуется Standesamt",
    "Zeugnis ueber den mutmasslichen Tag der Entbindung",
    "Vaterschaftsanerkennung и Sorgeerklaerung, если родители не женаты",
    "Steuer-ID, банковские реквизиты и справки о доходе для выплат"
  ],
  agencies: [
    { name: "Frauenarzt / Gynaekologe", purpose: "Vorsorge, Mutterpass, справка о ПДР" },
    { name: "Hebamme", purpose: "До- и послеродовое сопровождение" },
    { name: "Krankenkasse", purpose: "Mutterschaftsgeld и страхование ребенка" },
    { name: "Standesamt", purpose: "Geburtsurkunde и регистрация рождения" },
    { name: "Familienkasse", purpose: "Kindergeld" },
    { name: "Elterngeldstelle", purpose: "Elterngeld" },
    { name: "Jugendamt", purpose: "Vaterschaft, Sorge, childcare" },
    { name: "Auslaenderbehoerde", purpose: "Aufenthaltstitel ребенка, если применимо" }
  ],
  verificationNeeded: [
    { title: "Риски / особые отметки", detail: "На страницах Mutterpass видны маркеры слева, но сопоставление с номерами риска ненадежно.", confidence: "low", source: "pregnancy-info-03, pregnancy-info-11" },
    { title: "Gravidogramm 12.06.2026", detail: "Fundusstand, RR, вагинальный осмотр и правую колонку Sonstiges/Therapie нужно сверить.", confidence: "low", source: "pregnancy-info-04" },
    { title: "I Screening", detail: "Mehrlinge, monochorial, Auffaelligkeiten и BPD отмечены как medium/low confidence.", confidence: "medium", source: "pregnancy-info-05" },
    { title: "Административный план", detail: "Research-файл дает общегерманский маршрут. Локальные правила Standesamt, Jugendamt и Auslaenderbehoerde нужно проверять по месту.", confidence: "medium", source: "deep-research-report.md" }
  ],
  sources: [
    { id: "pregnancy-info-01", status: "transcribed", summary: "Mutterpass cover with patient name and date of birth.", href: "../human-readable/images/pregnancy-info-01.jpg" },
    { id: "pregnancy-info-02", status: "transcribed", summary: "HIV-Suchtest sticker.", href: "../human-readable/images/pregnancy-info-02.jpg" },
    { id: "pregnancy-info-03", status: "partially_transcribed", summary: "Terminbestimmung and special findings page.", href: "../human-readable/images/pregnancy-info-03.jpg" },
    { id: "pregnancy-info-04", status: "partially_transcribed", summary: "Gravidogramm with two visit rows.", href: "../human-readable/images/pregnancy-info-04.jpg" },
    { id: "pregnancy-info-05", status: "transcribed", summary: "First ultrasound screening.", href: "../human-readable/images/pregnancy-info-05.jpg" },
    { id: "pregnancy-info-06", status: "reviewed_empty", summary: "Ultrasound control page.", href: "../human-readable/images/pregnancy-info-06.jpg" },
    { id: "pregnancy-info-07", status: "reviewed_empty", summary: "Further ultrasound page.", href: "../human-readable/images/pregnancy-info-07.jpg" },
    { id: "pregnancy-info-08", status: "reviewed_empty", summary: "Postpartum/further pregnancy pages.", href: "../human-readable/images/pregnancy-info-08.jpg" },
    { id: "pregnancy-info-09", status: "reviewed_empty", summary: "Laboratory form pages.", href: "../human-readable/images/pregnancy-info-09.jpg" },
    { id: "pregnancy-info-10", status: "reviewed_empty", summary: "Fetal RhD and previous pregnancies page.", href: "../human-readable/images/pregnancy-info-10.jpg" },
    { id: "pregnancy-info-11", status: "partially_transcribed", summary: "Special findings catalogue.", href: "../human-readable/images/pregnancy-info-11.jpg" },
    { id: "pregnancy-info-12", status: "reviewed_empty", summary: "Gravidogramm continuation.", href: "../human-readable/images/pregnancy-info-12.jpg" },
    { id: "pregnancy-info-13", status: "reviewed_empty", summary: "Special findings/stationary treatment page.", href: "../human-readable/images/pregnancy-info-13.jpg" },
    { id: "pregnancy-info-14", status: "reviewed_empty", summary: "Ultrasound form continuation.", href: "../human-readable/images/pregnancy-info-14.jpg" },
    { id: "pregnancy-info-15", status: "reviewed_empty", summary: "Ultrasound control investigations.", href: "../human-readable/images/pregnancy-info-15.jpg" },
    { id: "pregnancy-info-16", status: "reviewed_empty", summary: "Growth curve page.", href: "../human-readable/images/pregnancy-info-16.jpg" },
    { id: "pregnancy-info-17", status: "reviewed_empty", summary: "Further ultrasound/Doppler page.", href: "../human-readable/images/pregnancy-info-17.jpg" },
    { id: "pregnancy-info-18", status: "reviewed_empty", summary: "Epikrise page.", href: "../human-readable/images/pregnancy-info-18.jpg" },
    { id: "pregnancy-info-19", status: "reviewed_empty", summary: "Postpartum examination page.", href: "../human-readable/images/pregnancy-info-19.jpg" },
    { id: "pregnancy-info-20", status: "reviewed_template_text", summary: "Printed note to mother.", href: "../human-readable/images/pregnancy-info-20.jpg" }
  ]
};
