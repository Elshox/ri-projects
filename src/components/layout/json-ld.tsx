const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://riprojects.org';

export function JsonLd() {
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'RI PROJECTS',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.svg`,
        width: 160,
        height: 40,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+998-71-200-00-00',
        contactType: 'customer service',
        availableLanguage: ['Russian', 'English'],
      },
      sameAs: [
        'https://www.linkedin.com/company/riprojects',
        'https://t.me/riprojects',
        'https://www.instagram.com/riprojects',
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#local-business`,
      name: 'RI PROJECTS',
      description:
        'Полная комплектация коммерческих и жилых объектов под ключ: отели, рестораны, бизнес-центры, клиники, ЖК. FF&E, OS&E, логистика, таможня, сертификация.',
      url: SITE_URL,
      telephone: '+998712000000',
      email: 'hello@riprojects.org',
      foundingDate: '2015',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: 30 },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Амира Темура, 1',
        addressLocality: 'Ташкент',
        addressCountry: 'UZ',
        postalCode: '100000',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 41.2995,
        longitude: 69.2828,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      priceRange: '$$$',
      areaServed: ['UZ', 'KZ', 'RU', 'AZ', 'GE', 'KG', 'TJ'],
      serviceType: ['FF&E Procurement', 'OS&E Supply', 'Logistics', 'Certification'],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
