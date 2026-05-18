export type SectorSlug =
  | 'hotels'
  | 'restaurants'
  | 'residential'
  | 'business-centers'
  | 'medical'
  | 'education'
  | 'retail'
  | 'banks';

export type SectorFeature = {
  icon: string;
  title: string;
  desc: string;
};

export type SectorSupplyItem = {
  category: string;
  items: string[];
};

export type SectorData = {
  slug: SectorSlug;
  /** Optional. PageHero falls back to beige bg if absent. */
  heroImage?: string;
  priority: number;
  features: SectorFeature[];
  supply: SectorSupplyItem[];
  standards: string[];
  relatedCases: string[]; // project slugs
};

export const SECTORS: readonly SectorData[] = [
  {
    slug: 'hotels',
    heroImage: '/images/sectors/hotels.jpg',
    priority: 1,
    features: [
      { icon: 'Star', title: 'Стандарты операторов', desc: 'Hilton, Marriott, Hyatt, IHG — знаем требования каждого бренда изнутри.' },
      { icon: 'Layers', title: 'Полный FF&E и OS&E', desc: 'Номерной фонд, рестораны, лобби, SPA, конференц-зоны — всё за один договор.' },
      { icon: 'Clock', title: 'Жёсткие сроки', desc: 'Открытие отеля — дедлайн без права переноса. Мы это понимаем.' },
    ],
    supply: [
      { category: 'Номера', items: ['Кровати и матрасы', 'Мебель (тумбы, столы, кресла)', 'Текстиль (бельё, полотенца, халаты)', 'Освещение', 'Мини-бар', 'Сейфы и аксессуары'] },
      { category: 'Рестораны', items: ['Столы и стулья', 'Фарфор, стекло, столовые приборы', 'Буфетное оборудование', 'Скатерти и салфетки'] },
      { category: 'Лобби и зоны', items: ['Декоративная мебель', 'Освещение (люстры, бра)', 'Ковровые покрытия', 'Арт и декор'] },
    ],
    standards: ['Brand standards Hilton / Marriott / IHG', 'ГОСТ 30335 (гостиничные услуги)', 'Пожарная безопасность', 'ТР ЕАЭС 025/2012 (мебель)'],
    relatedCases: ['hilton-tashkent', 'radisson-samarkand'],
  },
  {
    slug: 'restaurants',
    heroImage: '/images/sectors/restaurants.jpg',
    priority: 2,
    features: [
      { icon: 'UtensilsCrossed', title: 'Концепция на столе', desc: 'Подбор посуды и мебели, точно отражающих концепцию заведения.' },
      { icon: 'Zap', title: 'Быстрый старт', desc: 'Ресторанный бизнес не ждёт: умеем работать в сжатые сроки.' },
      { icon: 'RefreshCw', title: 'Замена по сезону', desc: 'Организуем периодическое пополнение OS&E для действующих заведений.' },
    ],
    supply: [
      { category: 'Зал', items: ['Столы (обеденные, барные, кофейные)', 'Стулья и барные табуреты', 'Диваны и банкетки', 'Освещение'] },
      { category: 'Сервировка', items: ['Фарфор и фаянс', 'Хрусталь и стекло', 'Столовые приборы', 'Скатерти и текстиль', 'Подставки и аксессуары'] },
      { category: 'Кухня', items: ['Профессиональное кухонное оборудование', 'Инвентарь шефа', 'Хранение и стеллажи'] },
    ],
    standards: ['СанПиН 2.3.6', 'Пожарная безопасность', 'EN 1022 (устойчивость мебели)', 'ГОСТ 30524 (общественное питание)'],
    relatedCases: ['hyatt-regency', 'local-restaurant-tashkent'],
  },
  {
    slug: 'residential',
    heroImage: '/images/sectors/residential.jpg',
    priority: 3,
    features: [
      { icon: 'Building2', title: 'Масштаб и повторяемость', desc: 'Сотни однотипных квартир — без потери качества и сроков.' },
      { icon: 'Paintbrush', title: 'Под дизайн-проект', desc: 'Работаем со спецификациями архитектора и интерьерного дизайнера.' },
      { icon: 'Truck', title: 'Доставка поэтажно', desc: 'Логистика до каждого этажа, сортировка по квартирам.' },
    ],
    supply: [
      { category: 'Кухня', items: ['Кухонная мебель', 'Встраиваемая техника', 'Смесители и мойки', 'Аксессуары'] },
      { category: 'Спальня и гостиная', items: ['Кровати и матрасы', 'Мягкая мебель', 'Шкафы и системы хранения', 'Освещение'] },
      { category: 'Ванная', items: ['Сантехника', 'Аксессуары', 'Зеркала', 'Полотенцесушители'] },
    ],
    standards: ['ТР ЕАЭС 025/2012 (мебель)', 'ГОСТ Р 51768 (матрасы)', 'СНиП (строительные нормы)', 'Пожарная безопасность'],
    relatedCases: ['residential-tashkent-city', 'high-rise-almaty'],
  },
  {
    slug: 'business-centers',
    heroImage: '/images/sectors/business-centers.jpg',
    priority: 4,
    features: [
      { icon: 'Monitor', title: 'Рабочие пространства', desc: 'Эргономика, акустика и технологическое оснащение офисов класса А.' },
      { icon: 'Users', title: 'Переговорные зоны', desc: 'Конференц-столы, кресла, AV-оборудование, акустические перегородки.' },
      { icon: 'Coffee', title: 'Зоны отдыха', desc: 'Лаундж, кухонные зоны, ресепшн — атмосфера, которая продаёт аренду.' },
    ],
    supply: [
      { category: 'Open Space', items: ['Рабочие столы и кресла', 'Перегородки и экраны', 'Мобильные стеллажи', 'Освещение рабочих мест'] },
      { category: 'Переговорные', items: ['Конференц-столы', 'Кресла', 'AV-стойки', 'Акустические панели'] },
      { category: 'Лобби и ресепшн', items: ['Ресепшн-стойки', 'Зона ожидания', 'Навигация и знаки', 'Декор'] },
    ],
    standards: ['LEED / BREEAM (при необходимости)', 'Пожарная безопасность', 'Эргономические нормы ЕС', 'ГОСТ 12.2.032 (рабочие места)'],
    relatedCases: ['business-center-tashkent', 'tech-campus-almaty'],
  },
  {
    slug: 'medical',
    heroImage: '/images/sectors/medical.jpg',
    priority: 5,
    features: [
      { icon: 'ShieldCheck', title: 'Медицинские стандарты', desc: 'Только сертифицированное оборудование с соответствующей документацией.' },
      { icon: 'Microscope', title: 'Специализация', desc: 'Клиники, лаборатории, стоматологии, реабилитационные центры.' },
      { icon: 'FileCheck', title: 'Полный пакет документов', desc: 'Сертификаты, паспорта, санэпидзаключения для лицензирования.' },
    ],
    supply: [
      { category: 'Медоборудование', items: ['Смотровые столы и кресла', 'Медицинская мебель', 'Стерилизационное оборудование', 'Лабораторная мебель'] },
      { category: 'Зоны пациентов', items: ['Стулья и диваны для ожидания', 'Ресепшн-стойки', 'Навигация', 'Освещение'] },
      { category: 'Операционные', items: ['Операционные столы', 'Медицинские светильники', 'Хирургическая мебель'] },
    ],
    standards: ['ISO 13485 (медицинские изделия)', 'Лицензионные требования МЗ РУз', 'СанПиН для ЛПУ', 'Пожарная безопасность'],
    relatedCases: ['clinic-tashkent', 'dental-center'],
  },
  {
    slug: 'education',
    heroImage: '/images/sectors/education.jpg',
    priority: 6,
    features: [
      { icon: 'GraduationCap', title: 'Учебная среда', desc: 'Мебель и оборудование, адаптированные к возрасту и образовательной концепции.' },
      { icon: 'BookOpen', title: 'Библиотеки и labs', desc: 'Библиотечные системы, лабораторная мебель, IT-оснащение.' },
      { icon: 'Shield', title: 'Безопасность', desc: 'Сертифицированная мебель без острых углов, экологически чистые материалы.' },
    ],
    supply: [
      { category: 'Классные комнаты', items: ['Парты и стулья', 'Учительские столы', 'Доски и экраны', 'Шкафы и стеллажи'] },
      { category: 'Общие зоны', items: ['Столовые комплекты', 'Зоны отдыха', 'Гардеробные', 'Навигация'] },
      { category: 'Лаборатории', items: ['Лабораторные столы и стеллажи', 'Вытяжные шкафы', 'IT-оборудование'] },
    ],
    standards: ['СанПиН для учебных заведений', 'ГОСТ 22046 (школьная мебель)', 'Пожарная безопасность', 'Экологические требования'],
    relatedCases: ['international-school-tashkent'],
  },
  {
    slug: 'retail',
    priority: 7,
    features: [
      { icon: 'ShoppingCart', title: 'Торговое оборудование', desc: 'Стеллажи, витрины, прилавки — под любой формат ритейла.' },
      { icon: 'Lightbulb', title: 'Световой дизайн', desc: 'Акцентное освещение, которое продаёт: LED-системы, световые панели.' },
      { icon: 'Repeat', title: 'Тиражирование', desc: 'Оснащаем сети магазинов под единый стандарт торгового бренда.' },
    ],
    supply: [
      { category: 'Торговый зал', items: ['Торговые стеллажи', 'Витрины и прилавки', 'Примерочные кабины', 'Торговое освещение'] },
      { category: 'Ресепшн и касса', items: ['Кассовые зоны', 'POS-стойки', 'Навигация', 'Упаковочные зоны'] },
      { category: 'Склад', items: ['Складские стеллажи', 'Мобильные тележки', 'Упаковочные столы'] },
    ],
    standards: ['Пожарная безопасность', 'Строительные нормы для ТЦ', 'Доступная среда (инвалиды)', 'ГОСТ EN 15635 (стеллажное оборудование)'],
    relatedCases: ['fashion-retail-tashkent'],
  },
  {
    slug: 'banks',
    heroImage: '/images/sectors/banks.jpg',
    priority: 8,
    features: [
      { icon: 'Lock', title: 'Безопасность и надёжность', desc: 'Банковская мебель и оборудование с повышенными требованиями к прочности.' },
      { icon: 'Star', title: 'Представительский уровень', desc: 'VIP-зоны, переговорные, ресепшн — уровень, который внушает доверие.' },
      { icon: 'Building', title: 'Стандарт сети', desc: 'Тиражируем оснащение по всей сети отделений под единый стандарт.' },
    ],
    supply: [
      { category: 'Клиентская зона', items: ['Стойки операционистов', 'Зоны ожидания', 'Навигация', 'Банкоматные зоны'] },
      { category: 'Переговорные', items: ['VIP-мебель', 'Конференц-столы', 'Кресла', 'Аксессуары'] },
      { category: 'Офис', items: ['Рабочие места', 'Хранение и сейфы', 'Кухонные зоны', 'Серверные комнаты'] },
    ],
    standards: ['Требования ЦБ РУз', 'Стандарты физической безопасности', 'Доступная среда', 'Пожарная безопасность'],
    relatedCases: ['kapitalbank-branches', 'national-bank-renovation'],
  },
] as const;

export function getSector(slug: string): SectorData | undefined {
  return SECTORS.find((s) => s.slug === slug);
}
