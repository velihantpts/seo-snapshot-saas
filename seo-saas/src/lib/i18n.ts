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

    // Features
    'feat.seo': 'SEO Score', 'feat.seo.d': 'Title, meta, headings, OG tags, schema — scored 0-100 with actionable fix recommendations.',
    'feat.cwv': 'Core Web Vitals', 'feat.cwv.d': 'FCP, LCP, CLS, TBT via Google PageSpeed Insights API. Real data, not estimates.',
    'feat.sec': 'Security', 'feat.sec.d': 'HSTS, CSP, X-Frame-Options — real HTTP headers from server response.',
    'feat.mob': 'Mobile', 'feat.mob.d': 'Viewport, zoom, touch targets — scored with specific fixes for mobile issues.',
    'feat.a11y': 'Accessibility', 'feat.a11y.d': 'Form labels, heading hierarchy, alt text, lang — WCAG compliance checks.',
    'feat.pdf': 'PDF Reports', 'feat.pdf.d': 'Export branded PDF reports. Share public report links with clients or team.',
    'feat.social': 'Social & OG', 'feat.social.d': 'Open Graph, Twitter Card, JSON-LD structured data validation.',
    'feat.tech': 'Technical', 'feat.tech.d': 'Robots.txt, sitemap.xml, canonical, render-blocking resources.',
    'feat.mon': 'Monitoring', 'feat.mon.d': 'Schedule weekly SEO checks. Get notified when your score drops.',

    // Compare
    'compare.title': 'Compare Two URLs', 'compare.desc': 'Side-by-side SEO comparison. See who wins.', 'compare.btn': 'Compare',

    // Monitor
    'monitor.title': 'Monitoring', 'monitor.desc': 'Get notified when your SEO score changes.',
    'monitor.placeholder': 'Enter URL to monitor...', 'monitor.add': 'Add',
    'monitor.empty': 'No monitors yet. Add a URL above to start tracking.',
    'monitor.footer': 'Pro feature · Monitors run automatically on your schedule',

    // UserMenu
    'menu.dashboard': 'Dashboard', 'menu.billing': 'Billing', 'menu.signout': 'Sign out',

    // Pricing features
    'pf.5day': '5 analyses per day', 'pf.score': 'SEO score & issues', 'pf.meta': 'Meta tag analysis',
    'pf.og': 'Open Graph & schema', 'pf.json': 'JSON export', 'pf.cwv': 'Core Web Vitals',
    'pf.pdf': 'PDF reports', 'pf.monitor': 'Scheduled monitoring',
    'pf.unlimited': 'Unlimited analyses', 'pf.everything': 'Everything in Free',
    'pf.cwvfull': 'Core Web Vitals (FCP, LCP, CLS)', 'pf.secaudit': 'Security & accessibility audit',
    'pf.pdfexport': 'PDF report export', 'pf.share': 'Shareable public reports',
    'pf.weekly': 'Weekly monitoring', 'pf.priority': 'Priority support',
    'pf.everythingpro': 'Everything in Pro', 'pf.norecurring': 'No recurring fees',
    'pf.allfuture': 'All future features', 'pf.daily': 'Daily monitoring',
    'pf.api': 'API access (coming soon)', 'pf.early': 'Early access',

    // Early adopter
    'early.badge': 'Early Adopter Pricing — These prices will increase. Lock in your rate now.',

    // Login
    'login.title': 'Sign in to SEO Snapshot', 'login.title.register': 'Create your account',
    'login.desc': 'Save your analyses and unlock Pro features', 'login.desc.register': 'Start analyzing for free — no credit card needed',
    'login.name': 'Name', 'login.email': 'Email', 'login.password': 'Password',
    'login.submit': 'Sign in', 'login.submit.register': 'Create account', 'login.wait': 'Please wait...',
    'login.noAccount': "Don't have an account?", 'login.signupFree': 'Sign up free',
    'login.hasAccount': 'Already have an account?', 'login.signinLink': 'Sign in',
    'login.agree': 'By signing up, you agree to our', 'login.and': 'and',

    // Dashboard
    'dash.title': 'Dashboard', 'dash.desc': 'Your SEO analysis history',
    'dash.upgrade': 'Upgrade', 'dash.new': '+ New Analysis',
    'dash.analyses': 'Analyses', 'dash.avg': 'Avg Score', 'dash.best': 'Best Score', 'dash.sites': 'Unique Sites',
    'dash.empty': 'No analyses yet', 'dash.first': 'Run your first SEO analysis →',
    'dash.crawls': 'Site Crawls', 'dash.issues': 'issues', 'dash.pages': 'pages',

    // 404
    '404.title': 'Page not found', '404.desc': "The page you're looking for doesn't exist.", '404.home': 'Go home',

    // Blog
    'blog.title': 'SEO Blog', 'blog.desc': 'Practical guides to improve your website\'s SEO. No fluff.',
    'blog.readmore': 'Read more', 'blog.back': 'Back to blog', 'blog.cta': 'Check your site\'s SEO score for free',
    'blog.analyze': 'Analyze your site',

    // Docs
    'docs.title': 'API Documentation', 'docs.desc': 'Integrate SEO Snapshot into your workflow with our REST API.',
    'docs.ratelimits': 'Rate Limits', 'docs.response': 'Response Fields', 'docs.auth': 'Authentication',

    // Terms & Privacy
    'terms.title': 'Terms of Service', 'privacy.title': 'Privacy Policy',

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

    'login.title': 'Giri\u015f yap', 'login.title.register': 'Hesap olu\u015ftur',
    'login.desc': 'Analizlerinizi kaydedin', 'login.desc.register': '\u00dccretsiz ba\u015flay\u0131n',
    'login.name': '\u0130sim', 'login.email': 'E-posta', 'login.password': '\u015eifre',
    'login.submit': 'Giri\u015f yap', 'login.submit.register': 'Hesap olu\u015ftur', 'login.wait': 'L\u00fctfen bekleyin...',
    'login.noAccount': 'Hesab\u0131n\u0131z yok mu?', 'login.signupFree': '\u00dccretsiz kaydol',
    'login.hasAccount': 'Zaten hesab\u0131n\u0131z var m\u0131?', 'login.signinLink': 'Giri\u015f yap',
    'login.agree': 'Kaydolarak kabul edersiniz:', 'login.and': 've',
    'dash.title': 'Panel', 'dash.desc': 'SEO analiz ge\u00e7mi\u015finiz',
    'dash.upgrade': 'Y\u00fckselt', 'dash.new': '+ Yeni Analiz',
    'dash.analyses': 'Analizler', 'dash.avg': 'Ort. Puan', 'dash.best': 'En \u0130yi', 'dash.sites': 'Benzersiz Site',
    'dash.empty': 'Hen\u00fcz analiz yok', 'dash.first': '\u0130lk SEO analizinizi \u00e7al\u0131\u015ft\u0131r\u0131n',
    'dash.crawls': 'Site Taramalar\u0131', 'dash.issues': 'sorun', 'dash.pages': 'sayfa',
    '404.title': 'Sayfa bulunamad\u0131', '404.desc': 'Arad\u0131\u011f\u0131n\u0131z sayfa mevcut de\u011fil.', '404.home': 'Ana sayfaya d\u00f6n',
    'blog.title': 'SEO Blog', 'blog.desc': 'SEO rehberleri.', 'blog.readmore': 'Devam\u0131n\u0131 oku',
    'blog.back': 'Bloga d\u00f6n', 'blog.cta': 'SEO puan\u0131n\u0131z\u0131 kontrol edin', 'blog.analyze': 'Sitenizi analiz edin',
    'docs.title': 'API Dok\u00fcmantasyonu', 'docs.desc': 'REST API entegrasyonu.',
    'terms.title': 'Kullan\u0131m \u015eartlar\u0131', 'privacy.title': 'Gizlilik Politikas\u0131',
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

    'login.title': 'Anmelden', 'login.title.register': 'Konto erstellen',
    'login.desc': 'Analysen speichern', 'login.desc.register': 'Kostenlos starten',
    'login.name': 'Name', 'login.email': 'E-Mail', 'login.password': 'Passwort',
    'login.submit': 'Anmelden', 'login.submit.register': 'Erstellen', 'login.wait': 'Bitte warten...',
    'login.noAccount': 'Kein Konto?', 'login.signupFree': 'Registrieren',
    'login.hasAccount': 'Bereits ein Konto?', 'login.signinLink': 'Anmelden',
    'login.agree': 'Mit der Registrierung akzeptieren Sie', 'login.and': 'und',
    'dash.title': 'Dashboard', 'dash.desc': 'SEO-Analyseverlauf',
    'dash.upgrade': 'Upgraden', 'dash.new': '+ Neue Analyse',
    'dash.analyses': 'Analysen', 'dash.avg': 'Durchschn.', 'dash.best': 'Bester', 'dash.sites': 'Einzigartige',
    'dash.empty': 'Noch keine Analysen', 'dash.first': 'Erste Analyse starten',
    'dash.crawls': 'Site-Crawls', 'dash.issues': 'Probleme', 'dash.pages': 'Seiten',
    '404.title': 'Seite nicht gefunden', '404.desc': 'Diese Seite existiert nicht.', '404.home': 'Startseite',
    'blog.title': 'SEO-Blog', 'blog.desc': 'SEO-Anleitungen.', 'blog.readmore': 'Weiterlesen',
    'blog.back': 'Zur\u00fcck', 'blog.cta': 'SEO-Score pr\u00fcfen', 'blog.analyze': 'Analysieren',
    'docs.title': 'API-Dokumentation', 'docs.desc': 'REST API Integration.',
    'terms.title': 'Nutzungsbedingungen', 'privacy.title': 'Datenschutz',
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

    'login.title': 'Iniciar sesi\u00f3n', 'login.title.register': 'Crear cuenta',
    'login.desc': 'Guarda tus an\u00e1lisis', 'login.desc.register': 'Empieza gratis',
    'login.name': 'Nombre', 'login.email': 'Correo', 'login.password': 'Contrase\u00f1a',
    'login.submit': 'Entrar', 'login.submit.register': 'Crear', 'login.wait': 'Espere...',
    'login.noAccount': 'Sin cuenta?', 'login.signupFree': 'Reg\u00edstrate',
    'login.hasAccount': 'Ya tienes cuenta?', 'login.signinLink': 'Entrar',
    'login.agree': 'Al registrarte aceptas', 'login.and': 'y',
    'dash.title': 'Panel', 'dash.desc': 'Historial SEO',
    'dash.upgrade': 'Mejorar', 'dash.new': '+ Nuevo',
    'dash.analyses': 'An\u00e1lisis', 'dash.avg': 'Prom.', 'dash.best': 'Mejor', 'dash.sites': 'Sitios',
    'dash.empty': 'Sin an\u00e1lisis', 'dash.first': 'Primer an\u00e1lisis SEO',
    'dash.crawls': 'Rastreos', 'dash.issues': 'problemas', 'dash.pages': 'p\u00e1ginas',
    '404.title': 'P\u00e1gina no encontrada', '404.desc': 'No existe.', '404.home': 'Inicio',
    'blog.title': 'Blog SEO', 'blog.desc': 'Gu\u00edas SEO.', 'blog.readmore': 'Leer m\u00e1s',
    'blog.back': 'Volver', 'blog.cta': 'Verifica tu SEO', 'blog.analyze': 'Analizar',
    'docs.title': 'Documentaci\u00f3n API', 'docs.desc': 'API REST.',
    'terms.title': 'T\u00e9rminos', 'privacy.title': 'Privacidad',
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

    'login.title': 'Connexion', 'login.title.register': 'Cr\u00e9er un compte',
    'login.desc': 'Sauvegardez vos analyses', 'login.desc.register': 'Commencez gratuitement',
    'login.name': 'Nom', 'login.email': 'E-mail', 'login.password': 'Mot de passe',
    'login.submit': 'Se connecter', 'login.submit.register': 'Cr\u00e9er', 'login.wait': 'Patientez...',
    'login.noAccount': 'Pas de compte ?', 'login.signupFree': 'Inscription',
    'login.hasAccount': 'D\u00e9j\u00e0 un compte ?', 'login.signinLink': 'Connexion',
    'login.agree': 'En vous inscrivant, vous acceptez', 'login.and': 'et',
    'dash.title': 'Tableau de bord', 'dash.desc': 'Historique SEO',
    'dash.upgrade': 'Am\u00e9liorer', 'dash.new': '+ Nouvelle Analyse',
    'dash.analyses': 'Analyses', 'dash.avg': 'Moy.', 'dash.best': 'Meilleur', 'dash.sites': 'Sites',
    'dash.empty': 'Pas encore', 'dash.first': 'Premi\u00e8re analyse SEO',
    'dash.crawls': 'Crawls', 'dash.issues': 'probl\u00e8mes', 'dash.pages': 'pages',
    '404.title': 'Page non trouv\u00e9e', '404.desc': 'Cette page n\'existe pas.', '404.home': 'Accueil',
    'blog.title': 'Blog SEO', 'blog.desc': 'Guides SEO.', 'blog.readmore': 'Lire la suite',
    'blog.back': 'Retour', 'blog.cta': 'V\u00e9rifiez votre SEO', 'blog.analyze': 'Analyser',
    'docs.title': 'Documentation API', 'docs.desc': 'API REST.',
    'terms.title': 'Conditions', 'privacy.title': 'Confidentialit\u00e9',
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
