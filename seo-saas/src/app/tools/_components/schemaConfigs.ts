import type { SchemaConfig } from './SchemaBuilder';

const CTX = 'https://schema.org';

export const localBusinessConfig: SchemaConfig = {
  fields: [
    { key: 'businessType', label: 'Business type', type: 'select', options: ['LocalBusiness', 'Restaurant', 'Store', 'ProfessionalService', 'MedicalBusiness', 'LegalService', 'HealthAndBeautyBusiness', 'AutomotiveBusiness', 'FinancialService'] },
    { key: 'name', label: 'Business name', ph: 'Acme Coffee Roasters' },
    { key: 'image', label: 'Image URL', type: 'url', ph: 'https://example.com/photo.jpg' },
    { key: 'telephone', label: 'Phone', ph: '+1-555-123-4567' },
    { key: 'priceRange', label: 'Price range', ph: '$$' },
    { key: 'url', label: 'Website URL', type: 'url', ph: 'https://example.com' },
    { key: 'streetAddress', label: 'Street address', ph: '123 Main St' },
    { key: 'addressLocality', label: 'City', ph: 'Portland' },
    { key: 'addressRegion', label: 'State / region', ph: 'OR' },
    { key: 'postalCode', label: 'Postal code', ph: '97201' },
    { key: 'addressCountry', label: 'Country code', ph: 'US' },
    { key: 'openingHours', label: 'Opening hours', ph: 'Mo-Fr 09:00-17:00' },
  ],
  defaults: { businessType: 'LocalBusiness', addressCountry: 'US' },
  build: (v) => ({
    '@context': CTX,
    '@type': v.businessType || 'LocalBusiness',
    name: v.name,
    image: v.image,
    telephone: v.telephone,
    priceRange: v.priceRange,
    url: v.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: v.streetAddress,
      addressLocality: v.addressLocality,
      addressRegion: v.addressRegion,
      postalCode: v.postalCode,
      addressCountry: v.addressCountry,
    },
    openingHours: v.openingHours,
  }),
};

export const faqConfig: SchemaConfig = {
  fields: [],
  list: {
    key: 'faqs', label: 'Questions & answers', addLabel: 'Add question',
    itemFields: [
      { key: 'question', label: 'Question', ph: 'Do you offer refunds?' },
      { key: 'answer', label: 'Answer', type: 'textarea', ph: 'Yes, within 30 days of purchase.' },
    ],
  },
  defaultItems: [
    { question: 'Do you offer a free trial?', answer: 'Yes — you can use the free tier with no signup and no time limit.' },
    { question: 'How do I get support?', answer: 'Email support@example.com and we reply within one business day.' },
  ],
  build: (_v, items) => ({
    '@context': CTX,
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }),
};

export const productConfig: SchemaConfig = {
  fields: [
    { key: 'name', label: 'Product name', ph: 'Wireless Headphones' },
    { key: 'image', label: 'Image URL', type: 'url', ph: 'https://example.com/product.jpg' },
    { key: 'description', label: 'Description', type: 'textarea', ph: 'Over-ear headphones with 30h battery.' },
    { key: 'brand', label: 'Brand', ph: 'Acme' },
    { key: 'sku', label: 'SKU', ph: 'ACM-1000' },
    { key: 'price', label: 'Price', type: 'number', ph: '199.00' },
    { key: 'priceCurrency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'TRY', 'CAD', 'AUD', 'JPY'] },
    { key: 'availability', label: 'Availability', type: 'select', options: ['InStock', 'OutOfStock', 'PreOrder', 'BackOrder'] },
    { key: 'url', label: 'Product URL', type: 'url', ph: 'https://example.com/product' },
    { key: 'ratingValue', label: 'Rating (optional)', type: 'number', ph: '4.6' },
    { key: 'reviewCount', label: 'Review count (optional)', type: 'number', ph: '128' },
  ],
  defaults: { priceCurrency: 'USD', availability: 'InStock' },
  build: (v) => ({
    '@context': CTX,
    '@type': 'Product',
    name: v.name,
    image: v.image,
    description: v.description,
    brand: v.brand ? { '@type': 'Brand', name: v.brand } : '',
    sku: v.sku,
    offers: {
      '@type': 'Offer',
      price: v.price,
      priceCurrency: v.priceCurrency,
      availability: v.availability ? `https://schema.org/${v.availability}` : '',
      url: v.url,
    },
    aggregateRating: v.ratingValue ? { '@type': 'AggregateRating', ratingValue: v.ratingValue, reviewCount: v.reviewCount } : '',
  }),
};

export const breadcrumbConfig: SchemaConfig = {
  fields: [],
  list: {
    key: 'crumbs', label: 'Breadcrumb trail (top to bottom)', addLabel: 'Add level',
    itemFields: [
      { key: 'name', label: 'Name', ph: 'Home' },
      { key: 'url', label: 'URL', type: 'url', ph: 'https://example.com/' },
    ],
  },
  defaultItems: [
    { name: 'Home', url: 'https://example.com/' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: 'This article', url: 'https://example.com/blog/this-article' },
  ],
  build: (_v, items) => ({
    '@context': CTX,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }),
};

export const articleConfig: SchemaConfig = {
  fields: [
    { key: 'headline', label: 'Headline', ph: 'How to Fix Core Web Vitals' },
    { key: 'author', label: 'Author name', ph: 'Jane Doe' },
    { key: 'image', label: 'Image URL', type: 'url', ph: 'https://example.com/cover.jpg' },
    { key: 'datePublished', label: 'Date published', type: 'date' },
    { key: 'dateModified', label: 'Date modified', type: 'date' },
    { key: 'publisher', label: 'Publisher name', ph: 'Acme Media' },
    { key: 'publisherLogo', label: 'Publisher logo URL', type: 'url', ph: 'https://example.com/logo.png' },
    { key: 'url', label: 'Article URL', type: 'url', ph: 'https://example.com/blog/post' },
  ],
  build: (v) => ({
    '@context': CTX,
    '@type': 'Article',
    headline: v.headline,
    image: v.image,
    datePublished: v.datePublished,
    dateModified: v.dateModified || v.datePublished,
    author: { '@type': 'Person', name: v.author },
    publisher: {
      '@type': 'Organization',
      name: v.publisher,
      logo: v.publisherLogo ? { '@type': 'ImageObject', url: v.publisherLogo } : '',
    },
    mainEntityOfPage: v.url ? { '@type': 'WebPage', '@id': v.url } : '',
  }),
};

export const eventConfig: SchemaConfig = {
  fields: [
    { key: 'name', label: 'Event name', ph: 'Product Launch Webinar' },
    { key: 'startDate', label: 'Start', type: 'datetime-local' },
    { key: 'endDate', label: 'End', type: 'datetime-local' },
    { key: 'locationName', label: 'Location name', ph: 'Online / Acme HQ' },
    { key: 'address', label: 'Address (or "Online")', ph: '123 Main St, Portland, OR' },
    { key: 'url', label: 'Event URL', type: 'url', ph: 'https://example.com/event' },
    { key: 'description', label: 'Description', type: 'textarea', ph: 'Join us for the launch…' },
    { key: 'price', label: 'Ticket price', type: 'number', ph: '0' },
    { key: 'priceCurrency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'TRY', 'CAD', 'AUD', 'JPY'] },
  ],
  defaults: { priceCurrency: 'USD' },
  build: (v) => ({
    '@context': CTX,
    '@type': 'Event',
    name: v.name,
    startDate: v.startDate,
    endDate: v.endDate,
    description: v.description,
    url: v.url,
    location: { '@type': 'Place', name: v.locationName, address: v.address },
    offers: v.price !== undefined && v.price !== '' ? { '@type': 'Offer', price: v.price, priceCurrency: v.priceCurrency, url: v.url } : '',
  }),
};
