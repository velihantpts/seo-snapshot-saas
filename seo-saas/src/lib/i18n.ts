export type Locale = 'en' | 'tr' | 'de' | 'es' | 'fr';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navbar
    'nav.pricing': 'Pricing',
    'nav.compare': 'Compare',
    'nav.api': 'API',
    'nav.dashboard': 'Dashboard',
    'nav.monitor': 'Monitor',
    'nav.signin': 'Sign in',
    'nav.blog': 'Blog',

    // Hero
    'hero.badge': '100 SEO checks in seconds',
    'hero.title1': "Analyze any page's",
    'hero.title2': 'SEO instantly',
    'hero.desc': 'Get a complete SEO audit with actionable fix recommendations. Meta tags, Core Web Vitals, security, accessibility, and more. Check your title tags, meta descriptions, headings, images, links, structured data, security headers, mobile-friendliness, and 100 more on-page SEO factors — all in under 10 seconds, completely free.',
    'hero.analyze': 'Analyze',
    'hero.crawl': 'Crawl Site',
    'hero.free': 'Free: 5 analyses/day · No signup required · Pro: unlimited',

    // Why Different
    'diff.others': 'Other tools say',
    'diff.wegive': 'We give you',
    'diff.other1': '"Add a meta description"',
    'diff.other2': '"Improve security headers"',
    'diff.other3': '"Add structured data"',
    'diff.us1': 'Copy-paste',
    'diff.us1b': 'tag',
    'diff.us2': 'nginx / next.config.js code',
    'diff.us3': 'Complete JSON-LD schema',
    'diff.secgrade': 'Security Grade',
    'diff.impact': 'Impact Score',
    'diff.snippets': 'Fix Snippets',

    // Stats
    'stats.checks': 'SEO Checks',
    'stats.analyzed': 'Sites Analyzed',
    'stats.serverside': 'Server-Side',
    'stats.nosignup': 'No Signup',
    'stats.time': 'Analysis Time',

    // Features
    'features.title': 'Everything you need to audit SEO',
    'features.desc': '100 checks covering every aspect of on-page SEO. Get specific code fixes, not just warnings.',

    // CTA
    'cta.title': 'Ready to fix your SEO?',
    'cta.desc': 'Start free. Upgrade when you need unlimited analyses and full reports.',
    'cta.pricing': 'View Pricing',
    'cta.signin': 'Sign in free',
    'cta.longdesc': 'SEO Snapshot analyzes your website against 100 on-page SEO checks including meta tags, headings, images, links, structured data, security headers, Core Web Vitals, mobile-friendliness, accessibility compliance, and content quality. Get specific code fixes you can copy and paste — not just generic warnings. Used by developers, freelancers, and agencies worldwide.',

    // Pricing
    'pricing.title': 'Simple, transparent pricing',
    'pricing.desc': 'Start free. Upgrade when you need more power.',
    'pricing.trust': 'Trusted by developers, freelancers & agencies worldwide',
    'pricing.free': 'Free',
    'pricing.free.desc': 'Try it out',
    'pricing.free.cta': 'Get started',
    'pricing.pro': 'Pro',
    'pricing.pro.desc': 'For professionals',
    'pricing.pro.cta': 'Unlock All Issues',
    'pricing.lifetime': 'Lifetime',
    'pricing.lifetime.desc': 'One-time. Forever.',
    'pricing.lifetime.cta': 'Buy Lifetime',

    // Footer
    'footer.copy': '© 2026 SEO Snapshot',
  },

  tr: {
    'nav.pricing': 'Fiyatlar',
    'nav.compare': 'Karşılaştır',
    'nav.api': 'API',
    'nav.dashboard': 'Panel',
    'nav.monitor': 'İzleme',
    'nav.signin': 'Giriş yap',
    'nav.blog': 'Blog',

    'hero.badge': 'Saniyeler içinde 100 SEO kontrolü',
    'hero.title1': 'Herhangi bir sayfanın',
    'hero.title2': "SEO'sunu anında analiz edin",
    'hero.desc': "Uygulanabilir düzeltme önerileriyle eksiksiz bir SEO denetimi alın. Meta etiketler, Core Web Vitals, güvenlik, erişilebilirlik ve daha fazlası. Başlık etiketlerinizi, meta açıklamalarınızı, başlıkları, görselleri, bağlantıları, yapılandırılmış verileri, güvenlik başlıklarını, mobil uyumluluğu ve 100'den fazla sayfa içi SEO faktörünü 10 saniyenin altında, tamamen ücretsiz kontrol edin.",
    'hero.analyze': 'Analiz Et',
    'hero.crawl': 'Site Tara',
    'hero.free': 'Ücretsiz: Günde 5 analiz · Kayıt gerekmez · Pro: sınırsız',

    'diff.others': 'Diğer araçlar',
    'diff.wegive': 'Biz size veriyoruz',
    'diff.other1': '"Meta açıklama ekleyin"',
    'diff.other2': '"Güvenlik başlıklarını iyileştirin"',
    'diff.other3': '"Yapılandırılmış veri ekleyin"',
    'diff.us1': 'Kopyala-yapıştır',
    'diff.us1b': 'etiketi',
    'diff.us2': 'nginx / next.config.js kodu',
    'diff.us3': 'Eksiksiz JSON-LD şeması',
    'diff.secgrade': 'Güvenlik Notu',
    'diff.impact': 'Etki Puanı',
    'diff.snippets': 'Düzeltme Kodları',

    'stats.checks': 'SEO Kontrolü',
    'stats.analyzed': 'Site Analiz Edildi',
    'stats.serverside': 'Sunucu Taraflı',
    'stats.nosignup': 'Kayıt Yok',
    'stats.time': 'Analiz Süresi',

    'features.title': "SEO denetimi için ihtiyacınız olan her şey",
    'features.desc': 'Sayfa içi SEO\'nun her yönünü kapsayan 100 kontrol. Sadece uyarı değil, özel kod düzeltmeleri alın.',

    'cta.title': "SEO'nuzu düzeltmeye hazır mısınız?",
    'cta.desc': 'Ücretsiz başlayın. Sınırsız analiz gerektiğinde yükseltin.',
    'cta.pricing': 'Fiyatları Gör',
    'cta.signin': 'Ücretsiz giriş yap',
    'cta.longdesc': 'SEO Snapshot, web sitenizi meta etiketler, başlıklar, görseller, bağlantılar, yapılandırılmış veriler, güvenlik başlıkları, Core Web Vitals, mobil uyumluluk, erişilebilirlik uyumu ve içerik kalitesi dahil 100 sayfa içi SEO kontrolüne göre analiz eder.',

    'pricing.title': 'Basit, şeffaf fiyatlandırma',
    'pricing.desc': 'Ücretsiz başlayın. Daha fazla güce ihtiyaç duyduğunuzda yükseltin.',
    'pricing.trust': 'Dünya genelinde geliştiriciler, serbest çalışanlar ve ajanslar tarafından tercih ediliyor',
    'pricing.free': 'Ücretsiz',
    'pricing.free.desc': 'Deneyin',
    'pricing.free.cta': 'Başla',
    'pricing.pro': 'Pro',
    'pricing.pro.desc': 'Profesyoneller için',
    'pricing.pro.cta': 'Tüm Sorunları Aç',
    'pricing.lifetime': 'Ömür Boyu',
    'pricing.lifetime.desc': 'Tek seferlik. Sonsuza kadar.',
    'pricing.lifetime.cta': 'Ömür Boyu Satın Al',

    'footer.copy': '© 2026 SEO Snapshot',
  },

  de: {
    'nav.pricing': 'Preise',
    'nav.compare': 'Vergleichen',
    'nav.api': 'API',
    'nav.dashboard': 'Dashboard',
    'nav.monitor': 'Monitor',
    'nav.signin': 'Anmelden',
    'nav.blog': 'Blog',

    'hero.badge': '100 SEO-Checks in Sekunden',
    'hero.title1': 'SEO jeder Seite',
    'hero.title2': 'sofort analysieren',
    'hero.desc': 'Erhalten Sie ein vollständiges SEO-Audit mit umsetzbaren Korrekturempfehlungen. Meta-Tags, Core Web Vitals, Sicherheit, Barrierefreiheit und mehr. Prüfen Sie Title-Tags, Meta-Beschreibungen, Überschriften, Bilder, Links, strukturierte Daten, Sicherheits-Header, Mobilfreundlichkeit und über 100 weitere On-Page SEO-Faktoren — in unter 10 Sekunden, völlig kostenlos.',
    'hero.analyze': 'Analysieren',
    'hero.crawl': 'Site crawlen',
    'hero.free': 'Kostenlos: 5 Analysen/Tag · Keine Anmeldung · Pro: unbegrenzt',

    'diff.others': 'Andere Tools sagen',
    'diff.wegive': 'Wir geben Ihnen',
    'diff.other1': '"Meta-Beschreibung hinzufügen"',
    'diff.other2': '"Sicherheits-Header verbessern"',
    'diff.other3': '"Strukturierte Daten hinzufügen"',
    'diff.us1': 'Copy-Paste',
    'diff.us1b': 'Tag',
    'diff.us2': 'nginx / next.config.js Code',
    'diff.us3': 'Vollständiges JSON-LD Schema',
    'diff.secgrade': 'Sicherheitsnote',
    'diff.impact': 'Auswirkungspunkte',
    'diff.snippets': 'Fix-Snippets',

    'stats.checks': 'SEO-Checks',
    'stats.analyzed': 'Seiten analysiert',
    'stats.serverside': 'Serverseitig',
    'stats.nosignup': 'Keine Anmeldung',
    'stats.time': 'Analysezeit',

    'features.title': 'Alles was Sie für SEO-Audits brauchen',
    'features.desc': '100 Checks für jeden Aspekt der On-Page SEO. Konkrete Code-Fixes statt allgemeiner Warnungen.',

    'cta.title': 'Bereit, Ihr SEO zu verbessern?',
    'cta.desc': 'Starten Sie kostenlos. Upgraden Sie für unbegrenzte Analysen.',
    'cta.pricing': 'Preise ansehen',
    'cta.signin': 'Kostenlos anmelden',
    'cta.longdesc': 'SEO Snapshot analysiert Ihre Website mit 100 On-Page SEO-Checks einschließlich Meta-Tags, Überschriften, Bilder, Links, strukturierte Daten, Sicherheits-Header und mehr.',

    'pricing.title': 'Einfache, transparente Preise',
    'pricing.desc': 'Kostenlos starten. Upgraden wenn nötig.',
    'pricing.trust': 'Vertraut von Entwicklern, Freelancern & Agenturen weltweit',
    'pricing.free': 'Kostenlos',
    'pricing.free.desc': 'Ausprobieren',
    'pricing.free.cta': 'Loslegen',
    'pricing.pro': 'Pro',
    'pricing.pro.desc': 'Für Profis',
    'pricing.pro.cta': 'Alle Issues freischalten',
    'pricing.lifetime': 'Lifetime',
    'pricing.lifetime.desc': 'Einmalig. Für immer.',
    'pricing.lifetime.cta': 'Lifetime kaufen',

    'footer.copy': '© 2026 SEO Snapshot',
  },

  es: {
    'nav.pricing': 'Precios',
    'nav.compare': 'Comparar',
    'nav.api': 'API',
    'nav.dashboard': 'Panel',
    'nav.monitor': 'Monitor',
    'nav.signin': 'Iniciar sesión',
    'nav.blog': 'Blog',

    'hero.badge': '100 verificaciones SEO en segundos',
    'hero.title1': 'Analiza el SEO de',
    'hero.title2': 'cualquier página al instante',
    'hero.desc': 'Obtén una auditoría SEO completa con recomendaciones de corrección aplicables. Meta etiquetas, Core Web Vitals, seguridad, accesibilidad y más. Verifica tus etiquetas de título, meta descripciones, encabezados, imágenes, enlaces, datos estructurados, cabeceras de seguridad, compatibilidad móvil y más de 100 factores SEO on-page — todo en menos de 10 segundos, completamente gratis.',
    'hero.analyze': 'Analizar',
    'hero.crawl': 'Rastrear sitio',
    'hero.free': 'Gratis: 5 análisis/día · Sin registro · Pro: ilimitado',

    'diff.others': 'Otras herramientas dicen',
    'diff.wegive': 'Nosotros te damos',
    'diff.other1': '"Añade una meta descripción"',
    'diff.other2': '"Mejora las cabeceras de seguridad"',
    'diff.other3': '"Añade datos estructurados"',
    'diff.us1': 'Copia y pega',
    'diff.us1b': 'etiqueta',
    'diff.us2': 'código nginx / next.config.js',
    'diff.us3': 'Esquema JSON-LD completo',
    'diff.secgrade': 'Nota de Seguridad',
    'diff.impact': 'Puntos de Impacto',
    'diff.snippets': 'Fragmentos de Código',

    'stats.checks': 'Verificaciones SEO',
    'stats.analyzed': 'Sitios Analizados',
    'stats.serverside': 'Del Servidor',
    'stats.nosignup': 'Sin Registro',
    'stats.time': 'Tiempo de Análisis',

    'features.title': 'Todo lo que necesitas para auditar SEO',
    'features.desc': '100 verificaciones cubriendo cada aspecto del SEO on-page. Correcciones de código específicas, no solo advertencias.',

    'cta.title': '¿Listo para arreglar tu SEO?',
    'cta.desc': 'Empieza gratis. Actualiza cuando necesites análisis ilimitados.',
    'cta.pricing': 'Ver Precios',
    'cta.signin': 'Regístrate gratis',
    'cta.longdesc': 'SEO Snapshot analiza tu sitio web con 100 verificaciones SEO on-page incluyendo meta etiquetas, encabezados, imágenes, enlaces, datos estructurados, cabeceras de seguridad y más.',

    'pricing.title': 'Precios simples y transparentes',
    'pricing.desc': 'Empieza gratis. Actualiza cuando necesites más.',
    'pricing.trust': 'Usado por desarrolladores, freelancers y agencias en todo el mundo',
    'pricing.free': 'Gratis',
    'pricing.free.desc': 'Pruébalo',
    'pricing.free.cta': 'Empezar',
    'pricing.pro': 'Pro',
    'pricing.pro.desc': 'Para profesionales',
    'pricing.pro.cta': 'Desbloquear Todo',
    'pricing.lifetime': 'De por vida',
    'pricing.lifetime.desc': 'Pago único. Para siempre.',
    'pricing.lifetime.cta': 'Comprar de por vida',

    'footer.copy': '© 2026 SEO Snapshot',
  },

  fr: {
    'nav.pricing': 'Tarifs',
    'nav.compare': 'Comparer',
    'nav.api': 'API',
    'nav.dashboard': 'Tableau de bord',
    'nav.monitor': 'Surveillance',
    'nav.signin': 'Connexion',
    'nav.blog': 'Blog',

    'hero.badge': '100 vérifications SEO en quelques secondes',
    'hero.title1': "Analysez le SEO de",
    'hero.title2': "n'importe quelle page instantanément",
    'hero.desc': "Obtenez un audit SEO complet avec des recommandations de correction applicables. Balises meta, Core Web Vitals, sécurité, accessibilité et plus encore. Vérifiez vos balises titre, meta descriptions, en-têtes, images, liens, données structurées, en-têtes de sécurité, compatibilité mobile et plus de 100 facteurs SEO on-page — le tout en moins de 10 secondes, entièrement gratuit.",
    'hero.analyze': 'Analyser',
    'hero.crawl': 'Explorer le site',
    'hero.free': 'Gratuit: 5 analyses/jour · Sans inscription · Pro: illimité',

    'diff.others': 'Les autres outils disent',
    'diff.wegive': 'Nous vous donnons',
    'diff.other1': '"Ajoutez une meta description"',
    'diff.other2': '"Améliorez les en-têtes de sécurité"',
    'diff.other3': '"Ajoutez des données structurées"',
    'diff.us1': 'Copier-coller',
    'diff.us1b': 'balise',
    'diff.us2': 'code nginx / next.config.js',
    'diff.us3': 'Schéma JSON-LD complet',
    'diff.secgrade': 'Note de Sécurité',
    'diff.impact': "Score d'Impact",
    'diff.snippets': 'Extraits de Code',

    'stats.checks': 'Vérifications SEO',
    'stats.analyzed': 'Sites Analysés',
    'stats.serverside': 'Côté Serveur',
    'stats.nosignup': 'Sans Inscription',
    'stats.time': "Temps d'Analyse",

    'features.title': "Tout ce qu'il faut pour auditer le SEO",
    'features.desc': '100 vérifications couvrant chaque aspect du SEO on-page. Des corrections de code spécifiques, pas juste des avertissements.',

    'cta.title': 'Prêt à corriger votre SEO?',
    'cta.desc': 'Commencez gratuitement. Passez au niveau supérieur pour des analyses illimitées.',
    'cta.pricing': 'Voir les Tarifs',
    'cta.signin': 'Inscription gratuite',
    'cta.longdesc': "SEO Snapshot analyse votre site web avec 100 vérifications SEO on-page incluant les balises meta, en-têtes, images, liens, données structurées, en-têtes de sécurité et plus encore.",

    'pricing.title': 'Tarification simple et transparente',
    'pricing.desc': 'Commencez gratuitement. Passez au supérieur quand vous en avez besoin.',
    'pricing.trust': 'Utilisé par des développeurs, freelances et agences du monde entier',
    'pricing.free': 'Gratuit',
    'pricing.free.desc': 'Essayez',
    'pricing.free.cta': 'Commencer',
    'pricing.pro': 'Pro',
    'pricing.pro.desc': 'Pour les professionnels',
    'pricing.pro.cta': 'Tout Débloquer',
    'pricing.lifetime': 'À vie',
    'pricing.lifetime.desc': 'Paiement unique. Pour toujours.',
    'pricing.lifetime.cta': 'Acheter à vie',

    'footer.copy': '© 2026 SEO Snapshot',
  },
};

// Get stored locale or detect from browser
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('locale') as Locale;
  if (stored && translations[stored]) return stored;
  const browser = navigator.language?.slice(0, 2) as Locale;
  if (translations[browser]) return browser;
  return 'en';
}

export function setLocale(locale: Locale) {
  localStorage.setItem('locale', locale);
  window.location.reload();
}

export function t(key: string, locale?: Locale): string {
  const l = locale || getLocale();
  return translations[l]?.[key] || translations.en[key] || key;
}

// React hook
import { useState, useEffect } from 'react';

export function useLocale() {
  const [locale, setLoc] = useState<Locale>('en');

  useEffect(() => {
    setLoc(getLocale());
  }, []);

  return {
    locale,
    t: (key: string) => t(key, locale),
    setLocale: (l: Locale) => { setLoc(l); setLocale(l); },
  };
}
