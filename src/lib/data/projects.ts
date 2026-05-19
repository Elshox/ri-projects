export type ProjectSlug =
  | 'delta-marriott-istanbul'
  | 'hilton-garden-inn-istanbul'
  | 'hampton-hilton-atakoy'
  | 'hampton-hilton-kayasehir'
  | 'ramada-wyndham-atakoy'
  | 'novotel-bishkek'
  | 'nh-collection-doha'
  | 'zulal-wellness-qatar'
  | 'novikov-doha'
  | 'robertos-muscat'
  | 'emirgan-sutis-istanbul'
  | 'glen-house-doha';

export type ProjectSector =
  | 'hotels'
  | 'restaurants'
  | 'residential'
  | 'business-centers'
  | 'medical'
  | 'education'
  | 'retail'
  | 'banks';

export type ProjectData = {
  slug: string;
  sector: ProjectSector;
  city: string;
  country: string;
  year: number;
  area: number; // m²
  /** Optional. PageHero falls back to beige bg if absent. */
  heroImage?: string;
  galleryImages: string[];
  client: string;
  clientLogo?: string;
  services: string[];
  context: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  brands: string[];
};

/* ─────────────────────────────────────────────────────────────
 *  Helper: строит URL фото на elitoffice.com по относительному
 *  пути из их фото-галереи. Использовать для всех heroImage и
 *  galleryImages из реализованных hospitality-проектов.
 * ───────────────────────────────────────────────────────────── */
const EO = (path: string) => `https://elitoffice.com${path}`;

/* ─────────────────────────────────────────────────────────────
 *  12 проектов — реализованные hospitality-объекты, выполненные
 *  совместно с нашим партнёром-производителем elitoffice.com.
 *  Партнёр дал разрешение представлять проекты как наши кейсы:
 *  поставку и комплектацию мебели / FF&E мы вели вместе.
 *  Все фото — прямые ссылки на CDN elitoffice.com (см. EO выше).
 * ───────────────────────────────────────────────────────────── */
export const PROJECTS: readonly ProjectData[] = [
  /* ── Отели ─────────────────────────────────────────────── */
  {
    slug: 'delta-marriott-istanbul',
    sector: 'hotels',
    city: 'Стамбул',
    country: 'Турция',
    year: 2015,
    area: 18000,
    heroImage: EO('/Content/img/Projects/Hotel/DeltaHotelsMarriott/Delta_Hotels_Marriot_Kagithane_1.jpg'),
    galleryImages: Array.from({ length: 29 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/DeltaHotelsMarriott/Delta_Hotels_Marriot_Kagithane_${i + 1}.jpg`),
    ),
    client: 'Delta Hotels by Marriott',
    services: ['turnkey', 'ffe', 'ose', 'logistics'],
    context:
      'Delta Hotels by Marriott в районе Кагитхане — городской отель в центре Стамбула, в 28 км от аэропорта, в окружении исторической застройки.',
    challenge:
      'Поставка полного FF&E для гостевых номеров, лобби, общественных зон и ресторанов в сжатые сроки под стандарт Marriott Worldwide.',
    solution:
      'Комплектация loose- и fixed-мебели: кровати, корпус, обеденные столы и стулья, диваны, ТВ-блоки, уличная мебель и аксессуары. Поэтапная отгрузка с инспекцией на производстве.',
    results: [
      { label: 'Стандарт', value: 'Marriott Worldwide' },
      { label: 'Зон комплектации', value: '4' },
      { label: 'Город', value: 'Стамбул' },
      { label: 'Год', value: '2015' },
    ],
    brands: ['Marriott Worldwide'],
  },
  {
    slug: 'hilton-garden-inn-istanbul',
    sector: 'hotels',
    city: 'Стамбул',
    country: 'Турция',
    year: 2017,
    area: 12000,
    heroImage: EO('/Content/img/Projects/Hotel/HiltonGardenInn/Hilton_Garden_Inn_Beylikduzu_1.jpg'),
    galleryImages: Array.from({ length: 20 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/HiltonGardenInn/Hilton_Garden_Inn_Beylikduzu_${i + 1}.jpg`),
    ),
    client: 'Hilton Garden Inn',
    services: ['turnkey', 'ffe', 'ose'],
    context:
      'Hilton Garden Inn в Бейликдюзу — деловой район Стамбула, в 1 км от Tüyap Fair, 35 км от Таксима. Бизнес-аудитория, MICE-формат.',
    challenge:
      'Соответствие стандарту Hilton при комплектации всех зон отеля: номера, лобби, рестораны, конференц-залы.',
    solution:
      'Полная поставка loose- и fixed-мебели, ТВ-зон, уличной мебели и аксессуаров. Шеф-инспекция на производстве.',
    results: [
      { label: 'Стандарт', value: 'Hilton Worldwide' },
      { label: 'Город', value: 'Стамбул' },
      { label: 'Год', value: '2017' },
      { label: 'Категория', value: '4★ Business' },
    ],
    brands: ['Hilton Worldwide'],
  },
  {
    slug: 'hampton-hilton-atakoy',
    sector: 'hotels',
    city: 'Стамбул',
    country: 'Турция',
    year: 2014,
    area: 9000,
    heroImage: EO('/Content/img/Projects/Hotel/HamptonByHilton_Atakoy/Hampton_By_Hilton_Hotel_Atakoy_1.jpg'),
    galleryImages: Array.from({ length: 15 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/HamptonByHilton_Atakoy/Hampton_By_Hilton_Hotel_Atakoy_${i + 1}.jpg`),
    ),
    client: 'Hampton By Hilton',
    services: ['turnkey', 'ffe', 'ose'],
    context:
      'Hampton By Hilton в Атакёй — рядом с CNR Expo Center, Ataköy Marina и Olympic Village. Premium-локация под деловые и туристические потоки.',
    challenge:
      'Комплектация номерного фонда и общественных зон под Hampton-стандарт за один тендерный цикл.',
    solution:
      'FF&E + OS&E поставка: мебель, ТВ-зоны, текстиль, обеденные группы. Логистика поэтажная.',
    results: [
      { label: 'Стандарт', value: 'Hampton By Hilton' },
      { label: 'Город', value: 'Стамбул' },
      { label: 'Год', value: '2014' },
      { label: 'Локация', value: 'Atakoy Marina' },
    ],
    brands: ['Hilton Worldwide'],
  },
  {
    slug: 'hampton-hilton-kayasehir',
    sector: 'hotels',
    city: 'Стамбул',
    country: 'Турция',
    year: 2019,
    area: 8500,
    heroImage: EO('/Content/img/Projects/Hotel/HamptonByHilton_Kayasehir/Hampton_By_Hilton_Hotel_Kayasehir_1.jpg'),
    galleryImages: Array.from({ length: 14 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/HamptonByHilton_Kayasehir/Hampton_By_Hilton_Hotel_Kayasehir_${i + 1}.jpg`),
    ),
    client: 'Hampton By Hilton',
    services: ['turnkey', 'ffe', 'ose'],
    context:
      'Hampton By Hilton Кайашехир — ближайший Hilton к новому аэропорту Стамбула. Базируется на Kayaşehir Shopping Center.',
    challenge:
      'Полный FF&E цикл от спецификаций до сдачи: гостевые номера, лобби, общественные зоны, рестораны.',
    solution:
      'Поставка всей мебели loose+fixed под стандарт Hampton, аксессуары и текстиль. Координация с открытием ТЦ.',
    results: [
      { label: 'Стандарт', value: 'Hampton By Hilton' },
      { label: 'Город', value: 'Стамбул' },
      { label: 'Год', value: '2019' },
      { label: 'Локация', value: 'Kayasehir Mall' },
    ],
    brands: ['Hilton Worldwide'],
  },
  {
    slug: 'ramada-wyndham-atakoy',
    sector: 'hotels',
    city: 'Стамбул',
    country: 'Турция',
    year: 2012,
    area: 11000,
    heroImage: EO('/Content/img/Projects/Hotel/RamadaPlazaByWyndham_Atakoy/Ramada_Plaza_By_Wyndham_Atakoy_1.jpg'),
    galleryImages: Array.from({ length: 13 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/RamadaPlazaByWyndham_Atakoy/Ramada_Plaza_By_Wyndham_Atakoy_${i + 1}.jpg`),
    ),
    client: 'Ramada Plaza by Wyndham',
    services: ['turnkey', 'ffe', 'ose'],
    context:
      'Ramada Plaza Wyndham в Атакёй — флагман Wyndham в Стамбуле, premium-категория, фокус на деловую и MICE аудиторию.',
    challenge:
      'FF&E полного цикла под Wyndham-стандарт: номера, лобби, банкетные залы и рестораны.',
    solution:
      'Мебель loose + fixed, текстиль, наружные зоны, аксессуары. Подбор материалов под стандарт сети.',
    results: [
      { label: 'Стандарт', value: 'Wyndham Hotels' },
      { label: 'Город', value: 'Стамбул' },
      { label: 'Год', value: '2012' },
      { label: 'Категория', value: 'Plaza' },
    ],
    brands: ['Wyndham Hotels & Resorts'],
  },
  {
    slug: 'novotel-bishkek',
    sector: 'hotels',
    city: 'Бишкек',
    country: 'Кыргызстан',
    year: 2023,
    area: 14000,
    heroImage: EO('/Content/img/Projects/Hotel/Novotel/Novotel_Bishkek_Kyrgyzstan_1.jpg'),
    galleryImages: Array.from({ length: 24 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/Novotel/Novotel_Bishkek_Kyrgyzstan_${i + 1}.jpg`),
    ),
    client: 'Novotel (Accor)',
    services: ['turnkey', 'ffe', 'ose', 'logistics', 'certification'],
    context:
      'Novotel Bishkek — первый Accor-отель новой генерации в Кыргызстане. Центр города, формат upscale, аудитория «бизнес + досуг».',
    challenge:
      'Соответствие стандартам Accor + кросс-границы логистика поставки из Турции/Европы через ЕАЭС.',
    solution:
      'Полная комплектация loose + fixed мебели, ТВ-зон, текстиля, уличной мебели. Таможенное оформление, сертификация для ЕАЭС.',
    results: [
      { label: 'Стандарт', value: 'Accor Novotel' },
      { label: 'Город', value: 'Бишкек' },
      { label: 'Год', value: '2023' },
      { label: 'Категория', value: 'Upscale' },
    ],
    brands: ['Accor Hotels'],
  },
  {
    slug: 'nh-collection-doha',
    sector: 'hotels',
    city: 'Доха',
    country: 'Катар',
    year: 2022,
    area: 16000,
    heroImage: EO('/Content/img/Projects/Hotel/NhCollection/NH_Collection_Oasis_Hotel_Doha_1.jpg'),
    galleryImages: [
      ...Array.from({ length: 4 }, (_, i) =>
        EO(`/Content/img/Projects/Hotel/NhCollection/NH_Collection_Oasis_Hotel_Doha_${i + 1}.jpg`),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        EO(`/Content/img/Projects/Hotel/NhCollection/NH_Collection_Oasis_Hotel_Doha_${i + 1}.jpeg`),
      ),
    ],
    client: 'NH Collection (Minor Hotels)',
    services: ['turnkey', 'ffe', 'ose', 'logistics'],
    context:
      'NH Collection Oasis Hotel Doha — премиальный городской отель в Дохе, бренд NH Collection (группа Minor Hotels).',
    challenge:
      'Соответствие гайдлайнам NH Collection: материалы, стиль, тактильность. Жёсткие сроки приёмки под открытие.',
    solution:
      'Контрактный FF&E цикл: гостевые номера, лобби, общественные зоны и рестораны. Поставка из Европы и Турции.',
    results: [
      { label: 'Стандарт', value: 'NH Collection' },
      { label: 'Город', value: 'Доха' },
      { label: 'Год', value: '2022' },
      { label: 'Категория', value: 'Premium urban' },
    ],
    brands: ['Minor Hotels (NH Collection)'],
  },
  {
    slug: 'zulal-wellness-qatar',
    sector: 'hotels',
    city: 'Аль-Рувайс',
    country: 'Катар',
    year: 2020,
    area: 22000,
    heroImage: EO('/Content/img/Projects/Hotel/ZulalWellnessResort/Zulal_Wellness_Resort_1.jpg'),
    galleryImages: Array.from({ length: 18 }, (_, i) =>
      EO(`/Content/img/Projects/Hotel/ZulalWellnessResort/Zulal_Wellness_Resort_${i + 1}.jpg`),
    ),
    client: 'Zulal Wellness Resort (Chiva-Som)',
    services: ['turnkey', 'ffe', 'ose', 'logistics'],
    context:
      'Zulal Wellness Resort — первый wellness-курорт Ближнего Востока, объединяющий традиционную арабскую медицину и холистический подход. Северный берег Катара.',
    challenge:
      'Уникальный wellness-формат с двумя изолированными гостевыми кластерами. Материалы — под high-traffic + soft-touch одновременно.',
    solution:
      'Поставка всей мебели loose + fixed, аксессуаров, уличной мебели. Координация с архитектурным бюро курорта.',
    results: [
      { label: 'Формат', value: 'Wellness resort' },
      { label: 'Город', value: 'Аль-Рувайс' },
      { label: 'Год', value: '2020' },
      { label: 'Бренд', value: 'Chiva-Som' },
    ],
    brands: ['Chiva-Som International'],
  },

  /* ── Рестораны ─────────────────────────────────────────── */
  {
    slug: 'novikov-doha',
    sector: 'restaurants',
    city: 'Доха',
    country: 'Катар',
    year: 2024,
    area: 850,
    heroImage: EO('/Content/img/Projects/restaurant_cafe/NovikovRestaurantLounge/Novikov_Restaurant_and_Lounge_Doha_1.jpg'),
    galleryImages: Array.from({ length: 8 }, (_, i) =>
      EO(`/Content/img/Projects/restaurant_cafe/NovikovRestaurantLounge/Novikov_Restaurant_and_Lounge_Doha_${i + 1}.jpg`),
    ),
    client: 'Novikov Restaurant & Lounge',
    services: ['ffe', 'logistics'],
    context:
      'Novikov Restaurant & Lounge Doha — luxury-ресторан и лаунж международного бренда Novikov: Asian + European fusion, шоу-кухня, лаундж-программа.',
    challenge:
      'Комплектация loose-мебели в luxury-сегменте: dining-столы и стулья, банкетные диваны для основного зала и лаунжа.',
    solution:
      'Поставка обеденных столов, стульев, диванов и банкетных банкеток. Подбор материалов под жёсткий ресторанный износ + luxury-визуал.',
    results: [
      { label: 'Формат', value: 'Restaurant + Lounge' },
      { label: 'Город', value: 'Доха' },
      { label: 'Год', value: '2024' },
      { label: 'Кухня', value: 'Asian + European' },
    ],
    brands: ['Novikov Group'],
  },
  {
    slug: 'robertos-muscat',
    sector: 'restaurants',
    city: 'Маскат',
    country: 'Оман',
    year: 2024,
    area: 620,
    heroImage: EO('/Content/img/Projects/restaurant_cafe/Robertos/Robertos_Muscat_1.jpg'),
    galleryImages: Array.from({ length: 8 }, (_, i) =>
      EO(`/Content/img/Projects/restaurant_cafe/Robertos/Robertos_Muscat_${i + 1}.jpg`),
    ),
    client: 'Roberto\'s',
    services: ['ffe', 'logistics'],
    context:
      'Roberto\'s — известный итальянский ресторан в St. Regis Al Mouj Muscat. Премиальный сервис, мировая винная карта.',
    challenge:
      'Точное соответствие концепции бренда Roberto\'s и стандартам St. Regis для loose-мебели зала.',
    solution:
      'Полная поставка loose-мебели: обеденные столы, стулья, диваны, банкетные банкетки.',
    results: [
      { label: 'Формат', value: 'Fine dining Italian' },
      { label: 'Город', value: 'Маскат' },
      { label: 'Год', value: '2024' },
      { label: 'Хост', value: 'St. Regis Al Mouj' },
    ],
    brands: ['Roberto\'s Group'],
  },
  {
    slug: 'emirgan-sutis-istanbul',
    sector: 'restaurants',
    city: 'Стамбул',
    country: 'Турция',
    year: 2020,
    area: 950,
    heroImage: EO('/Content/img/Projects/restaurant_cafe/EmirganSutis/Emirgan_Sutis_Bahcesehir_1.jpg'),
    galleryImages: Array.from({ length: 31 }, (_, i) =>
      EO(`/Content/img/Projects/restaurant_cafe/EmirganSutis/Emirgan_Sutis_Bahcesehir_${i + 1}.jpg`),
    ),
    client: 'Emirgan Sütiş',
    services: ['turnkey', 'ffe'],
    context:
      'Emirgan Sütiş Бахчешехир — крупный филиал известного турецкого ресторана. Классические турецкие завтраки, гриль, пекарня.',
    challenge:
      'Полная комплектация (фиксированная + loose-мебель, освещение, напольные/потолочные/настенные покрытия) под единый бренд сети.',
    solution:
      'Turnkey-цикл: интерьерные работы + поставка мебели, освещения и отделки всего ресторана.',
    results: [
      { label: 'Формат', value: 'Family restaurant' },
      { label: 'Город', value: 'Стамбул' },
      { label: 'Год', value: '2020' },
      { label: 'Объём', value: 'Turnkey' },
    ],
    brands: ['Emirgan Sütiş'],
  },
  {
    slug: 'glen-house-doha',
    sector: 'restaurants',
    city: 'Доха',
    country: 'Катар',
    year: 2022,
    area: 540,
    heroImage: EO('/Content/img/Projects/restaurant_cafe/GlenHouse/Glen_House_1.jpg'),
    galleryImages: Array.from({ length: 13 }, (_, i) =>
      EO(`/Content/img/Projects/restaurant_cafe/GlenHouse/Glen_House_${i + 1}.jpg`),
    ),
    client: 'Glen House',
    services: ['ffe', 'logistics'],
    context:
      'Glen House Doha — neighborhood eatery со смесью коктейльной программы и европейско-международной кухни. Расслабленный фрэндли-формат.',
    challenge:
      'Loose-мебель для зала: dining-набор + банкетные банкетки + диваны под камерный neighborhood-vibe.',
    solution:
      'Поставка обеденных столов, стульев, диванов и банкетных банкеток для всего ресторана.',
    results: [
      { label: 'Формат', value: 'Neighborhood eatery' },
      { label: 'Город', value: 'Доха' },
      { label: 'Год', value: '2022' },
      { label: 'Кухня', value: 'European + International' },
    ],
    brands: ['Glen House Hospitality'],
  },
] as const;

export const PROJECT_YEARS = [...new Set(PROJECTS.map((p) => p.year))].sort((a, b) => b - a);
export const PROJECT_CITIES = [...new Set(PROJECTS.map((p) => p.city))];
export const PROJECT_SECTORS = [...new Set(PROJECTS.map((p) => p.sector))] as ProjectSector[];

export function getProject(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function filterProjects(opts: {
  sector?: ProjectSector | 'all';
  year?: number | 'all';
  city?: string | 'all';
}): ProjectData[] {
  return PROJECTS.filter((p) => {
    if (opts.sector && opts.sector !== 'all' && p.sector !== opts.sector) return false;
    if (opts.year && opts.year !== 'all' && p.year !== opts.year) return false;
    if (opts.city && opts.city !== 'all' && p.city !== opts.city) return false;
    return true;
  });
}
