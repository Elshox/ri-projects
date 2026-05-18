export type ProjectSlug =
  | 'hilton-tashkent'
  | 'radisson-samarkand'
  | 'hyatt-regency'
  | 'marriott-almaty'
  | 'business-center-tashkent'
  | 'residential-tashkent-city'
  | 'clinic-tashkent'
  | 'international-school-tashkent';

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

export const PROJECTS: readonly ProjectData[] = [
  {
    slug: 'hilton-tashkent',
    sector: 'hotels',
    city: 'Ташкент',
    country: 'Узбекистан',
    year: 2023,
    area: 18500,
    galleryImages: [
      '/images/projects/hilton-tashkent-01.jpg',
      '/images/projects/hilton-tashkent-02.jpg',
      '/images/projects/hilton-tashkent-03.jpg',
      '/images/projects/hilton-tashkent-04.jpg',
    ],
    client: 'Hilton Hotels & Resorts',
    clientLogo: '/images/clients/hilton.svg',
    services: ['turnkey', 'ffe', 'ose', 'logistics', 'certification'],
    context:
      'Первый отель международного бренда Hilton в Узбекистане. 256 номеров, 3 ресторана, конференц-центр на 800 человек, SPA и бассейн.',
    challenge:
      'Соответствие жёстким стандартам Hilton Worldwide по FF&E при ограниченных сроках поставки — 14 месяцев от брифа до открытия.',
    solution:
      'Мы провели тендер среди 40+ поставщиков из 8 стран, согласовали все образцы с командой Hilton, организовали морскую и авиационную доставку для критических позиций.',
    results: [
      { label: 'Позиций FF&E и OS&E', value: '4 200+' },
      { label: 'Стран-поставщиков', value: '8' },
      { label: 'Срок выполнения', value: '14 мес.' },
      { label: 'Площадь объекта', value: '18 500 м²' },
    ],
    brands: ['Pedrali', 'Molteni', 'LAGO', 'Villeroy & Boch', 'Ziegler'],
  },
  {
    slug: 'radisson-samarkand',
    sector: 'hotels',
    city: 'Самарканд',
    country: 'Узбекистан',
    year: 2023,
    area: 12000,
    galleryImages: [
      '/images/projects/radisson-samarkand-01.jpg',
      '/images/projects/radisson-samarkand-02.jpg',
      '/images/projects/radisson-samarkand-03.jpg',
    ],
    client: 'Radisson Hotel Group',
    clientLogo: '/images/clients/radisson.svg',
    services: ['ffe', 'ose', 'logistics'],
    context: 'Бутик-отель Radisson в историческом центре Самарканда. 180 номеров, ресторан, SPA.',
    challenge:
      'Логистика в исторический центр города с ограничениями по тоннажу транспорта и работе в охранной зоне ЮНЕСКО.',
    solution:
      'Разработали специальный план доставки малотоннажным транспортом, согласовали окна работы с муниципалитетом. Сборка крупногабаритной мебели прямо на объекте.',
    results: [
      { label: 'Номеров', value: '180' },
      { label: 'Позиций поставки', value: '2 800+' },
      { label: 'Срок выполнения', value: '10 мес.' },
      { label: 'Площадь объекта', value: '12 000 м²' },
    ],
    brands: ['Kettal', 'Flexform', 'Kartell', 'Noritake'],
  },
  {
    slug: 'hyatt-regency',
    sector: 'hotels',
    city: 'Ташкент',
    country: 'Узбекистан',
    year: 2022,
    area: 22000,
    galleryImages: [
      '/images/projects/hyatt-regency-01.jpg',
      '/images/projects/hyatt-regency-02.jpg',
      '/images/projects/hyatt-regency-03.jpg',
    ],
    client: 'Hyatt Hotels Corporation',
    clientLogo: '/images/clients/hyatt.svg',
    services: ['turnkey', 'ffe', 'ose', 'certification'],
    context: 'Флагманский отель Hyatt Regency в центре Ташкента. 300 номеров, 4 ресторана, бальный зал.',
    challenge:
      'Параллельная комплектация четырёх ресторанов с разными концепциями при единых сроках открытия.',
    solution:
      'Создали отдельные проектные команды для каждого ресторана, синхронизированные единым PM-планом. Доставка поэтапная с хранением на нашем складе.',
    results: [
      { label: 'Позиций FF&E и OS&E', value: '5 600+' },
      { label: 'Ресторанов', value: '4' },
      { label: 'Срок выполнения', value: '18 мес.' },
      { label: 'Площадь объекта', value: '22 000 м²' },
    ],
    brands: ['Minotti', 'Cassina', 'Rosenthal', 'Christofle'],
  },
  {
    slug: 'marriott-almaty',
    sector: 'hotels',
    city: 'Алматы',
    country: 'Казахстан',
    year: 2022,
    area: 15000,
    galleryImages: [
      '/images/projects/marriott-almaty-01.jpg',
      '/images/projects/marriott-almaty-02.jpg',
    ],
    client: 'Marriott International',
    clientLogo: '/images/clients/marriott.svg',
    services: ['ffe', 'logistics', 'certification'],
    context: 'Обновление FF&E действующего Marriott в Алматы. Реновация без закрытия отеля — поэтапная поставка по ночам.',
    challenge: 'Замена мебели в работающем отеле без снижения загрузки ниже 70%.',
    solution: 'Разбили поставку на 12 очередей по 20 номеров. Монтаж исключительно в ночное время с 23:00 до 06:00.',
    results: [
      { label: 'Номеров обновлено', value: '240' },
      { label: 'Очередей поставки', value: '12' },
      { label: 'Минимальная загрузка', value: '72%' },
      { label: 'Срок', value: '8 мес.' },
    ],
    brands: ['Natuzzi', 'Saba', 'Muuto', 'Hay'],
  },
  {
    slug: 'business-center-tashkent',
    sector: 'business-centers',
    city: 'Ташкент',
    country: 'Узбекистан',
    year: 2024,
    area: 8500,
    galleryImages: [
      '/images/projects/bc-tashkent-01.jpg',
      '/images/projects/bc-tashkent-02.jpg',
    ],
    client: 'Capital Group Uzbekistan',
    services: ['turnkey', 'ffe'],
    context: 'Офисный центр класса А в деловом районе Ташкента. 8 этажей, 120 арендаторов, коворкинг.',
    challenge: 'Оснащение разнородных арендаторов при сохранении единого визуального стандарта здания.',
    solution: 'Разработали дизайн-систему для общих зон и предложили арендаторам пакеты мебели 3 уровней.',
    results: [
      { label: 'Этажей', value: '8' },
      { label: 'Арендаторов', value: '120+' },
      { label: 'Площадь', value: '8 500 м²' },
      { label: 'Срок', value: '6 мес.' },
    ],
    brands: ['Vitra', 'Wilkhahn', 'König + Neurath', 'Denz'],
  },
  {
    slug: 'residential-tashkent-city',
    sector: 'residential',
    city: 'Ташкент',
    country: 'Узбекистан',
    year: 2024,
    area: 45000,
    galleryImages: [
      '/images/projects/residential-01.jpg',
      '/images/projects/residential-02.jpg',
    ],
    client: 'Tashkent City Development',
    services: ['turnkey', 'ffe', 'logistics'],
    context: 'Жилой комплекс премиум-класса Tashkent City. 3 башни, 480 апартаментов, инфраструктура.',
    challenge: 'Одновременная комплектация 480 апартаментов с сортировкой по этажам и секциям.',
    solution: 'Автоматизированная система маркировки и маршрутизации грузов. Бригады поэтажной расстановки.',
    results: [
      { label: 'Апартаментов', value: '480' },
      { label: 'Позиций', value: '28 000+' },
      { label: 'Площадь', value: '45 000 м²' },
      { label: 'Срок', value: '12 мес.' },
    ],
    brands: ['IKEA Business', 'LAGO', 'Elica', 'Villeroy & Boch'],
  },
  {
    slug: 'clinic-tashkent',
    sector: 'medical',
    city: 'Ташкент',
    country: 'Узбекистан',
    year: 2023,
    area: 3200,
    galleryImages: ['/images/projects/clinic-01.jpg'],
    client: 'MedPlus Clinic',
    services: ['turnkey', 'ffe', 'certification'],
    context: 'Многопрофильная клиника с хирургическим блоком в Ташкенте. 45 кабинетов, 3 операционных.',
    challenge: 'Лицензирование медицинского оборудования и получение санэпидзаключений для 3 операционных.',
    solution: 'Параллельное оформление документов (сертификаты, паспорта, СЭЗ) одновременно с поставкой.',
    results: [
      { label: 'Кабинетов', value: '45' },
      { label: 'Операционных', value: '3' },
      { label: 'Сертификатов', value: '120+' },
      { label: 'Срок', value: '8 мес.' },
    ],
    brands: ['Linet', 'Haelvoet', 'Miele Professional', 'Steris'],
  },
  {
    slug: 'international-school-tashkent',
    sector: 'education',
    city: 'Ташкент',
    country: 'Узбекистан',
    year: 2024,
    area: 6800,
    galleryImages: ['/images/projects/school-01.jpg', '/images/projects/school-02.jpg'],
    client: 'Tashkent International School',
    services: ['turnkey', 'ffe'],
    context: 'Частная школа на 800 учеников с IB-программой. 40 классных комнат, лаборатории, спортзал.',
    challenge: 'Соответствие педагогической концепции Montessori в начальных классах и IB — в старших.',
    solution: 'Разработали мебельные концепции для каждой возрастной группы в сотрудничестве с педагогическим консультантом.',
    results: [
      { label: 'Учеников', value: '800' },
      { label: 'Классов', value: '40' },
      { label: 'Площадь', value: '6 800 м²' },
      { label: 'Срок', value: '7 мес.' },
    ],
    brands: ['VS Möbel', 'Haba', 'Flötotto', 'Girsberger'],
  },
] as const;

export const PROJECT_YEARS = [...new Set(PROJECTS.map((p) => p.year))].sort((a, b) => b - a);
export const PROJECT_CITIES = [...new Set(PROJECTS.map((p) => p.city))];
export const PROJECT_SECTORS = [...new Set(PROJECTS.map((p) => p.sector))] as ProjectSector[];

export function getProject(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function filterProjects(opts: {
  sector?: string;
  year?: number;
  city?: string;
}): readonly ProjectData[] {
  return PROJECTS.filter((p) => {
    if (opts.sector && p.sector !== opts.sector) return false;
    if (opts.year && p.year !== opts.year) return false;
    if (opts.city && p.city !== opts.city) return false;
    return true;
  });
}
