// SEO glossary terms. One page each at /glossary/[slug]. Data-only module.
export interface GlossaryTerm {
  slug: string;
  term: string;
  short: string;
  long: string;
  related: string[];
  link: { href: string; label: string };
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    "slug": "alt-text",
    "term": "Alt text",
    "short": "A text description of an image, read by screen readers and used by search engines to understand what the image shows.",
    "long": "Alt text serves two audiences at once: screen-reader users who can't see the image, and crawlers that can't reliably interpret pixels. Describe what the image actually shows rather than stuffing keywords — \"barista pouring latte art\" beats \"coffee coffee shop best coffee.\" Decorative images that add no meaning should get an empty alt attribute (alt=\"\") so screen readers skip them, and every alt-bearing image is also a candidate for Google Images traffic.",
    "related": [
      "anchor-text",
      "title-tag",
      "schema-markup"
    ],
    "link": {
      "href": "/blog/image-seo-optimization",
      "label": "Image SEO optimization guide"
    }
  },
  {
    "slug": "anchor-text",
    "term": "Anchor text",
    "short": "The clickable text of a link — descriptive wording helps search engines and users understand where the link leads.",
    "long": "Search engines read anchor text as a signal about the destination page's topic, which is why \"download our pricing PDF\" outperforms a bare \"click here.\" Over-optimizing internal links with the exact same keyword-rich anchor can look manipulative and, on external links, invite a spam penalty, so vary the wording naturally. Anchor text is also an accessibility win: screen-reader users often navigate by pulling up a list of links out of context.",
    "related": [
      "backlink",
      "alt-text",
      "keyword-cannibalization"
    ],
    "link": {
      "href": "/",
      "label": "Analyze your on-page links"
    }
  },
  {
    "slug": "backlink",
    "term": "Backlink",
    "short": "A link from another website to yours — high-quality backlinks remain one of the strongest ranking signals.",
    "long": "Not all backlinks are equal: one editorial link from a trusted industry publication outweighs hundreds from scraper directories. Google evaluates relevance and authority of the linking domain, so a link from a site in your niche passes more value than an unrelated one. Chasing volume through paid or low-quality link schemes is the fastest way to trigger a manual action — earn links by publishing content people actually want to cite.",
    "related": [
      "anchor-text",
      "nofollow",
      "e-e-a-t"
    ],
    "link": {
      "href": "/blog/eeat-seo-guide",
      "label": "E-E-A-T and authority signals"
    }
  },
  {
    "slug": "canonical-url",
    "term": "Canonical URL",
    "short": "A tag that tells search engines which version of a duplicate or similar page is the master version to index.",
    "long": "The rel=canonical tag consolidates ranking signals onto one preferred URL when the same content is reachable through multiple addresses — think tracking parameters, print versions, or http vs https. A classic mistake is pointing every page's canonical at the homepage, which tells Google to drop the rest of your site from the index. Canonicals are a hint, not a directive, so keep them consistent with your sitemap and internal links or Google may pick a different URL than you intended.",
    "related": [
      "canonicalization",
      "indexing",
      "sitemap-xml"
    ],
    "link": {
      "href": "/blog/canonical-url-explained",
      "label": "Canonical URLs explained"
    }
  },
  {
    "slug": "cls",
    "term": "CLS (Cumulative Layout Shift)",
    "short": "A Core Web Vital measuring unexpected layout movement while a page loads — aim for a score under 0.1.",
    "long": "CLS quantifies the annoyance of content jumping around as a page loads — the moment you go to tap a button and an ad pushes it out from under your finger. The usual culprits are images and iframes without width and height attributes, web fonts that reflow text, and content injected above what's already on screen. Reserve space for anything that loads late, and set explicit dimensions on media, to keep shifts near zero.",
    "related": [
      "core-web-vitals",
      "lcp",
      "inp"
    ],
    "link": {
      "href": "/blog/how-to-improve-core-web-vitals",
      "label": "How to improve Core Web Vitals"
    }
  },
  {
    "slug": "core-web-vitals",
    "term": "Core Web Vitals",
    "short": "Google's set of user-experience metrics — LCP, CLS, and INP — that feed directly into rankings.",
    "long": "Core Web Vitals turn \"the page feels slow\" into three measurable numbers: loading (LCP), visual stability (CLS), and responsiveness (INP). They're a ranking factor, but a tie-breaker one — great vitals won't rescue weak content, and Google uses real Chrome user data (field data), not just lab tests, to score you. Passing all three across most page views is the practical target, and mobile scores usually lag desktop, so optimize there first.",
    "related": [
      "lcp",
      "cls",
      "inp"
    ],
    "link": {
      "href": "/blog/how-to-improve-core-web-vitals",
      "label": "How to improve Core Web Vitals"
    }
  },
  {
    "slug": "crawl-budget",
    "term": "Crawl budget",
    "short": "The number of pages a search engine will crawl on your site in a given window — wasting it on junk URLs hurts indexing.",
    "long": "Crawl budget only becomes a real constraint on large sites — tens of thousands of URLs or more — where Googlebot won't fetch everything every day. Faceted navigation, session IDs, and infinite calendar pages can generate millions of low-value URLs that soak up crawls your important pages needed. Trim the waste with robots.txt blocks, canonical tags, and clean internal linking so the budget flows to pages you actually want indexed.",
    "related": [
      "crawlability",
      "robots-txt",
      "indexing"
    ],
    "link": {
      "href": "/blog/fix-discovered-currently-not-indexed",
      "label": "Fix Discovered – currently not indexed"
    }
  },
  {
    "slug": "crawlability",
    "term": "Crawlability",
    "short": "How easily search engine bots can reach and navigate the pages on your site.",
    "long": "A page can't rank if a crawler can't reach it, so crawlability is the foundation everything else sits on. Common blockers include orphan pages with no internal links, content locked behind JavaScript that never renders, broken redirect chains, and accidental robots.txt disallows. A flat, well-linked architecture where every important page is a few clicks from the homepage keeps bots (and users) moving efficiently.",
    "related": [
      "crawl-budget",
      "robots-txt",
      "indexing"
    ],
    "link": {
      "href": "/blog/technical-seo-audit-complete-guide",
      "label": "Technical SEO audit guide"
    }
  },
  {
    "slug": "e-e-a-t",
    "term": "E-E-A-T",
    "short": "Experience, Expertise, Authoritativeness, and Trust — the quality signals Google's raters use to judge content.",
    "long": "E-E-A-T isn't a direct ranking score you can measure; it's the lens Google's quality-rater guidelines apply, especially to \"Your Money or Your Life\" topics like health and finance. The first E, Experience, rewards firsthand knowledge — a review written by someone who actually used the product beats a rewrite of the spec sheet. Demonstrate it with named authors, real credentials, cited sources, and transparent contact and policy pages rather than treating it as a checkbox.",
    "related": [
      "backlink",
      "organic-traffic",
      "schema-markup"
    ],
    "link": {
      "href": "/blog/eeat-seo-guide",
      "label": "E-E-A-T SEO guide"
    }
  },
  {
    "slug": "hreflang",
    "term": "Hreflang",
    "short": "An attribute telling Google which language and region a page targets, for multilingual or multi-regional sites.",
    "long": "Hreflang stops Google from showing your French page to English users, and it consolidates duplicate-language variants so they don't compete as duplicate content. The rules trip people up: annotations must be reciprocal (each page points back), you need a valid language-region code like en-GB, and adding an x-default catches everyone your specific versions miss. Get one direction wrong and Google silently ignores the whole cluster, so validate before shipping.",
    "related": [
      "canonical-url",
      "indexing",
      "serp"
    ],
    "link": {
      "href": "/blog/hreflang-tags-complete-guide",
      "label": "Hreflang tags complete guide"
    }
  },
  {
    "slug": "indexing",
    "term": "Indexing",
    "short": "The process of a search engine storing a page so it can appear in results — crawling and indexing are not the same thing.",
    "long": "Crawling is Google fetching a page; indexing is deciding it's worth keeping and eligible to rank — a page can be crawled and still never indexed. The two statuses that catch site owners out are \"Discovered – currently not indexed\" (Google knows the URL but hasn't prioritized crawling it) and \"Crawled – currently not indexed\" (it looked but judged the content too thin or duplicate). Use the URL Inspection tool in Search Console to see which state a page is in before guessing at fixes.",
    "related": [
      "crawlability",
      "canonical-url",
      "sitemap-xml"
    ],
    "link": {
      "href": "/blog/fix-crawled-currently-not-indexed",
      "label": "Fix Crawled – currently not indexed"
    }
  },
  {
    "slug": "inp",
    "term": "INP (Interaction to Next Paint)",
    "short": "A Core Web Vital measuring how quickly a page responds to user input — it replaced FID in 2024. Aim for under 200ms.",
    "long": "INP measures the delay between a tap, click, or keypress and the next visual update, sampled across the whole visit rather than just the first interaction like the old FID metric. The usual cause of a bad score is heavy JavaScript blocking the main thread — large third-party scripts, unbroken long tasks, or expensive event handlers. Break work into smaller chunks, defer non-critical scripts, and use techniques like requestIdleCallback so the browser can paint between tasks.",
    "related": [
      "core-web-vitals",
      "lcp",
      "cls"
    ],
    "link": {
      "href": "/blog/fix-render-blocking-resources",
      "label": "Fix render-blocking resources"
    }
  },
  {
    "slug": "json-ld",
    "term": "JSON-LD",
    "short": "Google's recommended format for structured data — a script block that describes your content to enable rich results.",
    "long": "JSON-LD keeps structured data in a single script tag in the head or body, separate from your visible HTML, which makes it far easier to maintain than the inline microdata it replaced. The cardinal rule is that the markup must match what users actually see on the page — marking up a 5-star rating that doesn't appear anywhere is a guidelines violation that can lose you rich results entirely. Validate every block with the Rich Results Test before deploying, since a single syntax error can invalidate the whole object.",
    "related": [
      "structured-data",
      "schema-markup",
      "rich-results"
    ],
    "link": {
      "href": "/blog/structured-data-json-ld-guide",
      "label": "Structured data with JSON-LD"
    }
  },
  {
    "slug": "keyword-cannibalization",
    "term": "Keyword cannibalization",
    "short": "When multiple pages target the same keyword and compete with each other, weakening all of them in search.",
    "long": "Cannibalization happens when two or more of your pages chase the same intent — Google can't decide which to rank, so it splits signals and both end up lower than a single strong page would. It's most common on blogs that publish near-duplicate posts over time or e-commerce sites with overlapping category and filter pages. The fix is usually to consolidate the weaker page into the stronger one with a 301 redirect, or to differentiate their intent so each owns a distinct query.",
    "related": [
      "canonical-url",
      "anchor-text",
      "organic-traffic"
    ],
    "link": {
      "href": "/blog/keyword-cannibalization-fix",
      "label": "How to fix keyword cannibalization"
    }
  },
  {
    "slug": "lcp",
    "term": "LCP (Largest Contentful Paint)",
    "short": "A Core Web Vital measuring how fast the largest visible element renders — aim for under 2.5 seconds.",
    "long": "LCP marks the moment the main content — usually a hero image, video poster, or big block of text — finishes rendering, which is roughly when the page feels usable. A slow TTFB, render-blocking CSS and JavaScript, and unoptimized images are the top offenders, and lazy-loading the LCP element itself is a common self-inflicted wound. Preload the hero image, serve it in a modern format like WebP or AVIF, and keep the critical rendering path lean to hit the target.",
    "related": [
      "core-web-vitals",
      "ttfb",
      "cls"
    ],
    "link": {
      "href": "/blog/website-speed-optimization-guide",
      "label": "Website speed optimization guide"
    }
  },
  {
    "slug": "meta-description",
    "term": "Meta description",
    "short": "The summary shown under your title in search results — it doesn't rank pages but heavily influences click-through rate.",
    "long": "The meta description isn't a ranking factor, but it's your ad copy in the SERP: a compelling one earns clicks that a blank or auto-generated snippet won't. Google frequently rewrites it — often pulling a passage that better matches the query — so write one anyway for the queries you care about and keep it around 150 to 160 characters before truncation. When a search term matches words in your description, Google bolds them, so working the target phrase in naturally can lift visibility.",
    "related": [
      "title-tag",
      "serp",
      "open-graph"
    ],
    "link": {
      "href": "/blog/meta-description-length-2026",
      "label": "Meta description length in 2026"
    }
  },
  {
    "slug": "noindex",
    "term": "noindex",
    "short": "A directive telling search engines not to show a page in results — the page can still be crawled.",
    "long": "noindex is the right tool for pages that need to exist but shouldn't rank — thank-you pages, internal search results, staging content, thin tag archives. The critical gotcha is that Google must crawl the page to see the directive, so never block a URL in robots.txt and expect noindex to work; a blocked page can still appear as a bare link. Deliver it via the meta robots tag or the X-Robots-Tag HTTP header, and pair it with follow if you still want link equity to flow through the page.",
    "related": [
      "robots-txt",
      "indexing",
      "crawlability"
    ],
    "link": {
      "href": "/tools/robots-meta-generator",
      "label": "Robots meta tag generator"
    }
  },
  {
    "slug": "nofollow",
    "term": "nofollow",
    "short": "A link attribute telling search engines not to pass ranking authority through that link.",
    "long": "nofollow originally sculpted PageRank and kept spammy links from vouching for pages you don't trust — user-generated comments, paid placements, untrusted external sites. Since 2019 Google treats it as a hint rather than a strict directive, and added rel=\"sponsored\" for paid links and rel=\"ugc\" for user-generated content to describe intent more precisely. Google also requires nofollow or sponsored on any link you were paid for; unmarked paid links are a link-scheme violation.",
    "related": [
      "backlink",
      "anchor-text",
      "noindex"
    ],
    "link": {
      "href": "/",
      "label": "Check your outbound link attributes"
    }
  },
  {
    "slug": "open-graph",
    "term": "Open Graph",
    "short": "Meta tags that control how your page looks when shared on social media — title, description, and preview image.",
    "long": "Open Graph tags (og:title, og:description, og:image) decide whether a shared link shows a rich, clickable card or an ugly bare URL, which directly affects social click-through. The image is the highest-leverage tag: aim for 1200x630 pixels so it renders sharp without cropping across Facebook, LinkedIn, and Slack. Twitter/X layers its own twitter:card tags on top, but it falls back to Open Graph, so getting OG right covers most platforms in one pass.",
    "related": [
      "meta-description",
      "title-tag",
      "serp"
    ],
    "link": {
      "href": "/blog/open-graph-meta-tags-guide",
      "label": "Open Graph meta tags guide"
    }
  },
  {
    "slug": "organic-traffic",
    "term": "Organic traffic",
    "short": "Visitors who arrive from unpaid search engine results rather than ads, social, or direct links.",
    "long": "Organic traffic is the compounding payoff of SEO — unlike paid clicks, it keeps arriving after you stop spending, which is why it's the metric most SEO work ultimately targets. Judge it by segment rather than a single line: a rise driven by branded searches means something very different from growth on non-brand, high-intent queries. Watch it alongside Search Console impressions and average position so you can tell a ranking gain from a seasonal swing or an algorithm update.",
    "related": [
      "serp",
      "keyword-cannibalization",
      "e-e-a-t"
    ],
    "link": {
      "href": "/blog/what-is-a-good-seo-score",
      "label": "What is a good SEO score?"
    }
  },
  {
    "slug": "rich-results",
    "term": "Rich results",
    "short": "Enhanced search listings — star ratings, FAQs, images, prices — that structured data makes eligible in the SERP.",
    "long": "Rich results make your listing physically larger and more eye-catching, which can lift click-through even when your ranking position doesn't change. Eligibility comes from valid structured data matching a supported type — Product, Recipe, FAQ, Breadcrumb, and so on — but eligibility is never a guarantee; Google decides per query whether to show the enhancement. Google has also pulled back some types over time (like FAQ rich results for most sites), so track what's actually appearing rather than assuming markup equals display.",
    "related": [
      "structured-data",
      "json-ld",
      "schema-markup"
    ],
    "link": {
      "href": "/tools/schema-generator",
      "label": "Schema markup generator"
    }
  },
  {
    "slug": "robots-txt",
    "term": "Robots.txt",
    "short": "A file at your site root that tells crawlers which URLs they may or may not request.",
    "long": "Robots.txt controls crawling, not indexing — a disallowed URL can still show up in results as a bare link if other pages point to it, so it's the wrong tool for hiding a page (use noindex for that). Its real jobs are conserving crawl budget on large sites and keeping bots out of admin, cart, or infinite-parameter areas. One misplaced \"Disallow: /\" can deindex an entire site, so test changes in Search Console's robots tester before pushing them live.",
    "related": [
      "crawlability",
      "crawl-delay",
      "sitemap-xml"
    ],
    "link": {
      "href": "/blog/robots-txt-guide",
      "label": "Robots.txt complete guide"
    }
  },
  {
    "slug": "schema-markup",
    "term": "Schema markup",
    "short": "Structured data, usually written in JSON-LD, that labels your content type so search engines can parse it precisely.",
    "long": "Schema markup uses the shared Schema.org vocabulary to tell search engines exactly what a page represents — that this is a Product with a price, or an Article with an author and publish date. Beyond rich results, it feeds knowledge panels and helps AI-driven answers cite your content accurately, so it's increasingly about being understood, not just being decorated. Start with the types that map to your actual pages rather than marking up everything, and keep the markup in sync when the visible content changes.",
    "related": [
      "structured-data",
      "json-ld",
      "rich-results"
    ],
    "link": {
      "href": "/blog/how-to-add-structured-data-json-ld",
      "label": "How to add structured data"
    }
  },
  {
    "slug": "serp",
    "term": "SERP",
    "short": "Search Engine Results Page — the page of results a search engine returns for a query.",
    "long": "The modern SERP is far more than ten blue links: AI overviews, featured snippets, People Also Ask, local packs, images, and video carousels all compete for attention above your organic listing. That means true visibility depends on which features a query triggers, not just your ranking number — position 3 under an AI overview can get fewer clicks than position 5 on a plain results page. Study the SERP layout for your target queries before writing content, so you shape it to win the feature that's actually there.",
    "related": [
      "meta-description",
      "title-tag",
      "rich-results"
    ],
    "link": {
      "href": "/tools/serp-snippet-preview",
      "label": "SERP snippet preview tool"
    }
  },
  {
    "slug": "sitemap-xml",
    "term": "Sitemap (XML)",
    "short": "A file listing your important URLs to help search engines discover and prioritize crawling them.",
    "long": "An XML sitemap is a discovery aid, not a ranking booster — it helps Google find deep or newly published pages faster, which matters most on large or poorly linked sites. Only include canonical, indexable URLs that return 200: listing redirected, noindexed, or 404 pages sends mixed signals and erodes Google's trust in the file. Reference it from robots.txt and submit it in Search Console, and let your CMS keep the lastmod dates honest so recrawls target what actually changed.",
    "related": [
      "indexing",
      "crawlability",
      "robots-txt"
    ],
    "link": {
      "href": "/blog/sitemap-xml-guide",
      "label": "XML sitemap guide"
    }
  },
  {
    "slug": "structured-data",
    "term": "Structured data",
    "short": "Machine-readable markup that describes your content so search engines can understand and enhance it.",
    "long": "Structured data is the umbrella concept; JSON-LD is the preferred syntax and Schema.org is the vocabulary it uses. It doesn't directly raise rankings, but it makes pages eligible for rich results and helps engines and AI answer boxes extract facts — an author, a rating, an event date — without guessing from prose. The recurring failure mode is drift: markup that once matched the page but now advertises a price or rating the page no longer shows, which risks a manual action.",
    "related": [
      "json-ld",
      "schema-markup",
      "rich-results"
    ],
    "link": {
      "href": "/blog/structured-data-json-ld-guide",
      "label": "Structured data with JSON-LD"
    }
  },
  {
    "slug": "title-tag",
    "term": "Title tag",
    "short": "The clickable headline in search results and browser tabs — the single strongest on-page signal. Aim for 50–60 characters.",
    "long": "The title tag tells both Google and the searcher what a page is about in one line, and it carries more on-page ranking weight than any other element. Front-load the primary keyword, keep it under roughly 60 characters so it doesn't truncate in the SERP, and make each title unique — duplicate titles across pages muddy relevance. Google will rewrite titles it finds unhelpful (too long, keyword-stuffed, or mismatched with the H1), so write for the searcher, not the algorithm.",
    "related": [
      "meta-description",
      "serp",
      "keyword-cannibalization"
    ],
    "link": {
      "href": "/tools/meta-tag-generator",
      "label": "Meta tag generator"
    }
  },
  {
    "slug": "ttfb",
    "term": "TTFB (Time to First Byte)",
    "short": "The time from a request to the first byte of the server's response — a slow TTFB delays everything after it, including LCP.",
    "long": "TTFB captures server think-time plus network latency: DNS lookup, connection setup, and how long your backend takes to generate the response. It isn't a Core Web Vital itself, but a high TTFB pushes back LCP and every other paint, so it's often the hidden cause of \"my page is slow but I can't see why.\" Cutting it usually means caching, a CDN to shorten physical distance, faster database queries, or moving from render-on-request to static or edge-rendered pages.",
    "related": [
      "lcp",
      "core-web-vitals",
      "crawlability"
    ],
    "link": {
      "href": "/blog/website-speed-optimization-guide",
      "label": "Website speed optimization guide"
    }
  },
  {
    "slug": "canonicalization",
    "term": "Canonicalization",
    "short": "The process of choosing the single preferred URL when several addresses serve the same or near-identical content.",
    "long": "Canonicalization is what Google does behind the scenes when duplicate URLs exist — it clusters them and picks one representative to index and rank. Your rel=canonical tag is a strong hint in that decision, but Google weighs it against internal links, redirects, sitemap entries, and hreflang, and it will overrule you if those signals conflict. Keep every signal pointing at the same URL — consistent protocol, trailing slash, and casing — or Google may canonicalize to a version you didn't intend and drop the rest.",
    "related": [
      "canonical-url",
      "indexing",
      "hreflang"
    ],
    "link": {
      "href": "/blog/canonical-url-explained",
      "label": "Canonical URLs explained"
    }
  },
  {
    "slug": "crawl-delay",
    "term": "Crawl-delay",
    "short": "A robots.txt directive asking bots to wait a set interval between requests, to reduce server load.",
    "long": "Crawl-delay was meant to throttle aggressive bots on fragile servers, but Google ignores it entirely — you control Googlebot's rate through Search Console settings, not this line. Bing and some other crawlers do honor it, so it retains niche value for taming lesser bots that would otherwise hammer a small site. If Googlebot is genuinely overloading your server the better fixes are faster responses, caching, or a temporary 503, since a large crawl-delay elsewhere can starve your pages of crawling instead.",
    "related": [
      "robots-txt",
      "crawl-budget",
      "crawlability"
    ],
    "link": {
      "href": "/blog/robots-txt-guide",
      "label": "Robots.txt complete guide"
    }
  }
];

export const glossaryBySlug = new Map(GLOSSARY.map((t) => [t.slug, t]));
