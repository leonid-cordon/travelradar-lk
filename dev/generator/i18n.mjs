// Travel Radar LK — Content Hub v2 / generator i18n config.
//
// Single source of per-language data for build-index.mjs and build-sections.mjs.
// Adding a language = add one entry to LANGS here (+ that language's section copy).
//
// NOTE: `folder` (on-disk path segment) MAY differ from `code` (BCP-47 / output
// suffix): the Ukrainian branch lives in ua/ but its language code is `uk`.
//
// GEO place-name badges are intentionally NOT translated (kept Latin) — see the
// GEO map in build-sections.mjs. `news` is intentionally ABSENT from every
// switcher: it has 0 records and no v2 page, and must not reappear via generation.

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
};

// Plural of the "guides" counter in the hero meta line, per language rules.
export function pluralGuides(code, n) {
  if (code === 'ru' || code === 'uk') {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'материал';
    if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return 'материала';
    return 'материалов';
  }
  return n === 1 ? 'guide' : 'guides';
}

// hreflang alternates for the All showcase — same absolute set for every language.
const SHOWCASE_HREFLANG = {
  ru: 'https://travelradarlk.com/ru/content/',
  en: 'https://travelradarlk.com/en/content/',
  uk: 'https://travelradarlk.com/ua/content/',
  'x-default': 'https://travelradarlk.com/en/content/',
};

export const LANGS = {
  en: {
    code: 'en',
    folder: 'en',
    htmlLang: 'en',
    ogLocale: 'en_US',
    inLanguage: 'en-US',
    months: MONTHS.en,
    ui: { updated: 'Updated', home: 'Home', contentRoot: 'Content', backAll: '← All content', sectionsAria: 'Sections' },
    switcher: [
      { slug: '', label: 'All' },
      { slug: 'destinations', label: 'Destinations' },
      { slug: 'stay', label: 'Stay & Hotels' },
      { slug: 'things-to-do', label: 'Things to Do' },
      { slug: 'weather', label: 'Weather & Seasons' },
      { slug: 'planning', label: 'Planning & Budget' },
      { slug: 'safety', label: 'Safety' },
    ],
    sectionLabels: {
      destinations: 'Destinations',
      stay: 'Stay & Hotels',
      'things-to-do': 'Things to Do',
      weather: 'Weather & Seasons',
      planning: 'Planning & Budget',
      safety: 'Safety',
      news: 'News',
    },
    sections: {
      all: {
        label: 'Content',
        titleTag: 'Travel Guides & Hotel Picks: Cancun, Tulum & the Riviera Maya | Travel Radar LK',
        ogTitle: "Travel Guides & Hotel Picks for Mexico's Caribbean Coast",
        description: 'Every Travel Radar LK guide in one place — where to stay, what to do, when to go and how to plan Cancun, Tulum and the Riviera Maya, with supporting coverage for Egypt and Turkey.',
        h1: 'Content',
        subtitle: 'Every guide on the site, in one place',
        heroAlt: "Travel guides for Mexico's Caribbean coast and beyond",
        hreflang: SHOWCASE_HREFLANG,
        intro: [
          "Everything on Travel Radar LK in one place — destinations, where to stay, things to do, weather and seasons, planning and safety. The strongest coverage is Mexico's Caribbean coast, with supporting guides for Egypt and Turkey.",
          'Browse the full library below.',
        ],
      },
      weather: {
        label: 'Weather & Seasons',
        titleTag: 'Mexico Weather & Seasons: When to Visit Cancun, Tulum & the Riviera Maya | Travel Radar LK',
        ogTitle: 'Mexico Weather & Seasons: When to Visit Cancun, Tulum & the Riviera Maya',
        description: 'When to visit Cancun, Tulum and the Riviera Maya — dry vs rainy season, hurricane risk, sargassum timing and the best months to book.',
        h1: 'Weather & Seasons',
        subtitle: 'When to go to Mexico — and when to think twice',
        heroAlt: "Weather and seasons across Mexico's Caribbean coast",
        intro: [
          'Mexico has no bad season — only trade-offs. These guides show when Cancun, Tulum and the Riviera Maya get the best weather, when prices spike, and when hurricanes and sargassum are most likely.',
          'Use them to pick the right month before you book.',
        ],
      },
      destinations: {
        label: 'Destinations',
        titleTag: 'Mexico Destinations: Cancun, Tulum, Playa del Carmen & the Riviera Maya | Travel Radar LK',
        ogTitle: 'Mexico Destinations: Cancun, Tulum & the Riviera Maya',
        description: "Destination guides to Mexico's Caribbean coast — Cancun, Tulum, Playa del Carmen, Cozumel and the Riviera Maya: neighborhoods, beaches and what each place is really like.",
        h1: 'Destinations',
        subtitle: "Where to go on Mexico's Caribbean coast",
        heroAlt: "Destinations across Mexico's Caribbean coast",
        intro: [
          'Guides to the places themselves — Cancun, Tulum, Playa del Carmen, Cozumel and the wider Riviera Maya. What each spot is known for, which neighborhoods and beaches matter, and how they differ.',
          'Start here to decide where to base your trip.',
        ],
      },
      stay: {
        label: 'Stay & Hotels',
        titleTag: 'Where to Stay in Mexico: Best Areas, Resorts & Hotels in Cancun & the Riviera Maya | Travel Radar LK',
        ogTitle: 'Where to Stay in Mexico: Best Areas, Resorts & Hotels',
        description: 'Where to stay across Cancun, Tulum and the Riviera Maya — best areas, all-inclusive and adults-only resorts, and how to avoid the most common hotel-booking mistakes.',
        h1: 'Stay & Hotels',
        subtitle: 'Where to base yourself — and how to book it right',
        heroAlt: 'Hotels and resort zones across the Riviera Maya',
        intro: [
          'Hotels and zones across Cancun, Tulum and the Riviera Maya: all-inclusive, adults-only and family resorts, the neighborhoods worth booking — and the booking traps to avoid.',
          'The largest section on the site; use it to choose where to stay before you lock in a hotel.',
        ],
      },
      'things-to-do': {
        label: 'Things to Do',
        titleTag: 'Things to Do in Mexico: Cenotes, Snorkeling, Day Trips & Itineraries | Travel Radar LK',
        ogTitle: 'Things to Do in Mexico: Cenotes, Day Trips & Itineraries',
        description: "What to do on Mexico's Caribbean coast — cenotes, snorkeling, Chichen Itza, theme parks and ready-made Riviera Maya itineraries and day trips.",
        h1: 'Things to Do',
        subtitle: 'Cenotes, ruins, day trips and ready-made itineraries',
        heroAlt: 'Cenotes, ruins and day trips across the Riviera Maya',
        intro: [
          'Activities and excursions across the Riviera Maya — cenotes, snorkeling, archaeological sites, theme parks and day trips, plus full itineraries that string them together.',
          'Use these to fill the days once you know where you are staying.',
        ],
      },
      planning: {
        label: 'Planning & Budget',
        titleTag: 'Mexico Travel Planning: Budget, Flights, Airport Transfers, eSIM & Visas | Travel Radar LK',
        ogTitle: 'Mexico Travel Planning: Budget, Flights, eSIM & Transfers',
        description: 'The practical side of a Mexico trip — budgets, flights, Cancun airport transfers, eSIM and connectivity, travel insurance and entry rules, in one place.',
        h1: 'Planning & Budget',
        subtitle: 'The logistics that make the trip actually work',
        heroAlt: 'Trip planning, budgets and logistics for Mexico',
        intro: [
          'The practical layer of a trip: budgets, flights, Cancun airport transfers, eSIM and data, insurance and entry requirements.',
          'Work through these once your dates and destination are set.',
        ],
      },
      safety: {
        label: 'Safety',
        titleTag: 'Mexico Travel Safety: Scams, Food & Water Safety and the Real Risks | Travel Radar LK',
        ogTitle: 'Mexico Travel Safety: Scams, Food & Water and Real Risks',
        description: 'Staying safe in Mexico — common tourist scams, food and water precautions, and an honest read on the real risks versus the overblown ones.',
        h1: 'Safety',
        subtitle: 'The real risks, minus the scaremongering',
        heroAlt: "Travel safety on Mexico's Caribbean coast",
        intro: [
          'Straight talk on staying safe: common scams, food-and-water precautions and which risks actually deserve your attention on the Caribbean coast.',
          'Short by design — read before you go, then stop worrying.',
        ],
      },
    },
  },

  ru: {
    code: 'ru',
    folder: 'ru',
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    inLanguage: 'ru-RU',
    months: MONTHS.ru,
    ui: { updated: 'Обновлено:', home: 'Главная', contentRoot: 'Материалы', backAll: '← Все материалы', sectionsAria: 'Разделы' },
    switcher: [
      { slug: '', label: 'Все' },
      { slug: 'destinations', label: 'Направления' },
      { slug: 'stay', label: 'Где жить' },
      { slug: 'things-to-do', label: 'Чем заняться' },
      { slug: 'weather', label: 'Погода и сезоны' },
      { slug: 'planning', label: 'Планирование и бюджет' },
      { slug: 'safety', label: 'Безопасность' },
    ],
    sectionLabels: {
      destinations: 'Направления',
      stay: 'Где жить',
      'things-to-do': 'Чем заняться',
      weather: 'Погода и сезоны',
      planning: 'Планирование и бюджет',
      safety: 'Безопасность',
      news: 'Новости',
    },
    sections: {
      all: {
        label: 'Материалы',
        titleTag: 'Путеводители и подбор отелей: Канкун, Тулум и Ривьера-Майя | Travel Radar LK',
        ogTitle: 'Путеводители и подбор отелей по карибскому побережью Мексики',
        description: 'Все материалы Travel Radar LK в одном месте — где остановиться, чем заняться, когда ехать и как спланировать поездку в Канкун, Тулум и на Ривьеру-Майю, плюс материалы по Египту и Турции.',
        h1: 'Материалы',
        subtitle: 'Все материалы сайта в одном месте',
        heroAlt: 'Путеводители по карибскому побережью Мексики и не только',
        hreflang: SHOWCASE_HREFLANG,
        intro: [
          'Всё, что есть на Travel Radar LK, в одном месте — направления, где остановиться, чем заняться, погода и сезоны, планирование и безопасность. Наиболее полно раскрыто карибское побережье Мексики, плюс материалы по Египту и Турции.',
          'Просматривайте всю библиотеку ниже.',
        ],
      },
      weather: {
        label: 'Погода и сезоны',
        titleTag: 'Погода и сезоны в Мексике: когда ехать в Канкун, Тулум и на Ривьеру-Майю | Travel Radar LK',
        ogTitle: 'Погода и сезоны в Мексике: когда ехать в Канкун, Тулум и на Ривьеру-Майю',
        description: 'Когда ехать в Канкун, Тулум и на Ривьеру-Майю — сухой и дождливый сезон, риск ураганов, сроки саргассума и лучшие месяцы для брони.',
        h1: 'Погода и сезоны',
        subtitle: 'Когда ехать в Мексику — и когда стоит подумать дважды',
        heroAlt: 'Погода и сезоны на карибском побережье Мексики',
        intro: [
          'В Мексике нет плохого сезона — есть компромиссы. Эти материалы показывают, когда в Канкуне, Тулуме и на Ривьере-Майе лучшая погода, когда растут цены и когда выше всего вероятность ураганов и саргассума.',
          'Используйте их, чтобы выбрать правильный месяц до брони.',
        ],
      },
      destinations: {
        label: 'Направления',
        titleTag: 'Направления Мексики: Канкун, Тулум, Плая-дель-Кармен и Ривьера-Майя | Travel Radar LK',
        ogTitle: 'Направления Мексики: Канкун, Тулум и Ривьера-Майя',
        description: 'Путеводители по карибскому побережью Мексики — Канкун, Тулум, Плая-дель-Кармен, Косумель и Ривьера-Майя: районы, пляжи и какими эти места являются на самом деле.',
        h1: 'Направления',
        subtitle: 'Куда поехать на карибском побережье Мексики',
        heroAlt: 'Направления на карибском побережье Мексики',
        intro: [
          'Путеводители по самим местам — Канкун, Тулум, Плая-дель-Кармен, Косумель и вся Ривьера-Майя. Чем известно каждое место, какие районы и пляжи важны и чем они отличаются.',
          'Начните отсюда, чтобы решить, где остановиться в поездке.',
        ],
      },
      stay: {
        label: 'Где жить',
        titleTag: 'Где остановиться в Мексике: лучшие районы, курорты и отели Канкуна и Ривьеры-Майя | Travel Radar LK',
        ogTitle: 'Где остановиться в Мексике: лучшие районы, курорты и отели',
        description: 'Где остановиться в Канкуне, Тулуме и на Ривьере-Майе — лучшие районы, курорты «всё включено» и только для взрослых, и как избежать частых ошибок при бронировании отеля.',
        h1: 'Где жить',
        subtitle: 'Где базироваться — и как правильно забронировать',
        heroAlt: 'Отели и курортные зоны Ривьеры-Майя',
        intro: [
          'Отели и зоны Канкуна, Тулума и Ривьеры-Майя: «всё включено», курорты только для взрослых и для семей, районы, которые стоит бронировать, — и ловушки бронирования, которых лучше избегать.',
          'Самый большой раздел сайта; используйте его, чтобы выбрать жильё до того, как зафиксируете отель.',
        ],
      },
      'things-to-do': {
        label: 'Чем заняться',
        titleTag: 'Чем заняться в Мексике: сеноты, снорклинг, экскурсии и маршруты | Travel Radar LK',
        ogTitle: 'Чем заняться в Мексике: сеноты, экскурсии и маршруты',
        description: 'Чем заняться на карибском побережье Мексики — сеноты, снорклинг, Чичен-Ица, тематические парки и готовые маршруты и однодневные поездки по Ривьере-Майе.',
        h1: 'Чем заняться',
        subtitle: 'Сеноты, руины, экскурсии и готовые маршруты',
        heroAlt: 'Сеноты, руины и экскурсии по Ривьере-Майе',
        intro: [
          'Занятия и экскурсии по Ривьере-Майе — сеноты, снорклинг, археологические памятники, тематические парки и однодневные поездки, плюс полные маршруты, которые связывают всё это вместе.',
          'Используйте их, чтобы заполнить дни, когда уже понятно, где вы остановитесь.',
        ],
      },
      planning: {
        label: 'Планирование и бюджет',
        titleTag: 'Планирование поездки в Мексику: бюджет, перелёты, трансферы, eSIM и визы | Travel Radar LK',
        ogTitle: 'Планирование поездки в Мексику: бюджет, перелёты, eSIM и трансферы',
        description: 'Практическая сторона поездки в Мексику — бюджет, перелёты, трансферы из аэропорта Канкуна, eSIM и связь, страховка и правила въезда в одном месте.',
        h1: 'Планирование и бюджет',
        subtitle: 'Логистика, без которой поездка не сложится',
        heroAlt: 'Планирование, бюджет и логистика поездки в Мексику',
        intro: [
          'Практический слой поездки: бюджет, перелёты, трансферы из аэропорта Канкуна, eSIM и интернет, страховка и требования к въезду.',
          'Прорабатывайте их, когда даты и направление уже определены.',
        ],
      },
      safety: {
        label: 'Безопасность',
        titleTag: 'Безопасность в Мексике: разводы, еда и вода и реальные риски | Travel Radar LK',
        ogTitle: 'Безопасность в Мексике: разводы, еда и вода и реальные риски',
        description: 'Как оставаться в безопасности в Мексике — типичные туристические разводы, меры предосторожности с едой и водой и честный взгляд на реальные риски против раздутых.',
        h1: 'Безопасность',
        subtitle: 'Реальные риски — без нагнетания',
        heroAlt: 'Безопасность поездок на карибском побережье Мексики',
        intro: [
          'Прямой разговор о безопасности: типичные разводы, меры предосторожности с едой и водой и какие риски действительно заслуживают внимания на карибском побережье.',
          'Намеренно короткий раздел — прочитайте перед поездкой и перестаньте волноваться.',
        ],
      },
    },
  },
};
