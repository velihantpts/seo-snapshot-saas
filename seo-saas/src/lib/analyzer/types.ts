import { PageSpeedResult } from '../pagespeed';

export interface Issue {
  severity: string;
  problem: string;
  fix: string;
  category?: string;
  impact?: number;
}

export interface CheckContext {
  html: string;
  $: cheerio.CheerioAPI;
  response: Response;
  targetUrl: string;
  parsedUrl: URL;
  issues: Issue[];
}

export interface SEOResult {
  url: string;
  score: number;
  potentialScore: number;
  categoryScores: { meta: number; technical: number; performance: number; security: number; content: number; social: number; accessibility: number };
  fetchTime: number;
  statusCode: number;
  redirectChain: { url: string; status: number }[];
  meta: {
    title: { text: string; length: number; status: string } | null;
    description: { text: string; length: number; status: string } | null;
    titlePixelWidth: number; descPixelWidth: number;
    canonical: string; canonicalAnalysis: { selfReferencing: boolean; httpsMismatch: boolean; ogUrlMismatch: boolean };
    robots: string; lang: string; charset: string; viewport: string; isNoindex: boolean;
    hasFavicon: boolean; hasDoctype: boolean; textToHtmlRatio: number;
  };
  headings: Record<string, { count: number; texts: string[] }>;
  images: { total: number; missingAlt: number; withoutDimensions: number; largeCount: number; notLazy: number; noWebP: number; };
  links: { total: number; internal: number; external: number; nofollow: number; broken: string[]; uniqueInternal: number; uniqueExternal: number; emptyAnchor: number; genericAnchor: number; brokenLinks: string[]; };
  wordCount: number;
  topKeywords: { word: string; count: number; density: string }[];
  og: Record<string, string>;
  twitter: Record<string, string>;
  schemas: { type: string; valid: boolean; issues: string[] }[];
  hreflang: { tags: { lang: string; url: string }[]; hasXDefault: boolean; issues: string[] };
  techStack: { name: string; confidence: string; icon: string }[];
  security: { https: boolean; headers: Record<string, string | null>; mixedContent: number; score: number; grade: string; issues: string[]; };
  performance: { responseTime: number; htmlSize: number; totalScripts: number; totalStylesheets: number; deferScripts: number; asyncScripts: number; inlineScripts: number; inlineScriptSize: number; renderBlocking: number; renderBlockingList: string[]; };
  mobile: { viewport: boolean; scalable: boolean; score: number; issues: string[]; };
  accessibility: { score: number; issues: string[]; };
  contentQuality: { readabilityScore: number; readabilityGrade: string; avgSentenceLength: number; totalSentences: number; longSentences: number; };
  robots: { exists: boolean; disallowCount: number; hasSitemapRef: boolean; userAgents: string[]; urlBlocked: boolean; };
  sitemap: { exists: boolean; urls: string[]; };
  pageSpeed: PageSpeedResult | null;
  crux: { lcp: any; fid: any; cls: any; inp: any; ttfb: any; available: boolean } | null;
  issues: Issue[];
}

export const GENERIC_ANCHORS = new Set(['click here','read more','learn more','here','link','more','details','see more','view more','continue','go']);

export const STOP_WORDS = new Set([
  // English
  'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us','are','was','were','been','has','had','more','may','such','using','via','per','off','via',
  // German — the "sie" bug came from here
  'sie','und','der','die','das','ist','ein','eine','den','dem','des','mit','ich','nicht','auch','wie','war','sind','hat','aus','bei','wird','werden','zum','zur','oder','aber','wenn','nur','wir','was','man','kann','hier','mehr','sein','ihre','ihr','uns','alle','dass','als','auf','von','fur','uber','sich','noch','wenn','wurde','einer','einen','einem','vom','beim','durch','ohne','gegen','schon','immer',
  // French
  'les','des','une','est','pour','que','qui','dans','pas','sur','avec','plus','par','sont','vous','nous','mais','ses','ces','son','aux','ils','elle','tout','fait','etre','ont','comme','cette','leur','vos','nos','tous','bien','sans','deux','dont','peut','ou','au','du','le','la','et','un',
  // Spanish
  'los','las','una','por','para','con','que','del','sus','este','esta','como','mas','pero','muy','son','han','sin','sobre','entre','cuando','todo','hay','fue','ser','esta','esto','esos','esas',' este','nos','les','uno','tambien','desde','hasta','donde','porque','al','el','en','de','y','un',
  // Italian
  'che','non','per','con','una','dei','del','gli','nel','sono','come','piu','alla','dalla','questo','questa','anche','sono','loro','sui','sulla','delle','degli','nella','tra','fra','ma','se','al','il','lo',
  // Portuguese
  'que','nao','com','uma','por','para','dos','das','como','mais','mas','sua','seu','isso','esse','essa','pelo','pela','entre','sobre','quando','onde','porque','ao','os','as','de','em','um',
  // Turkish
  'bir','bu','ve','icin','ile','cok','daha','gibi','ama','olarak','olan','var','her','yok','mi','en','su','ki','ise','ya','de','da','ne','ancak','veya','gore','kadar','sonra','once','hem','tum',
  // Dutch
  'de','het','een','van','en','op','met','voor','aan','dat','die','niet','ook','maar','als','zijn','hebben','worden','deze','naar','bij','door','over','wordt','kan','heeft',
]);

// Average character widths in Arial (Google SERP font) at 20px
const CHAR_WIDTHS: Record<string, number> = {
  'W':14,'M':13,'m':12,'w':10,'G':11,'O':11,'Q':11,'D':11,'H':11,'N':11,'U':11,
  'A':9,'B':9,'C':9,'K':9,'P':9,'R':9,'V':9,'X':9,'Y':9,'S':9,'T':9,'Z':9,
  'E':8,'F':8,'J':7,'L':7,'a':8,'b':8,'d':8,'e':8,'g':8,'h':8,'k':8,'n':8,
  'o':8,'p':8,'q':8,'u':8,'v':8,'x':8,'y':8,'c':7,'s':7,'z':7,'f':5,'r':5,
  't':5,'j':4,'l':4,'i':4,'I':4,'1':7,' ':4,'.':4,',':4,'-':5,'|':4,
};

export function estimatePixelWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += CHAR_WIDTHS[ch] || 8;
  return w;
}

// Cheerio type import helper
import type * as cheerio from 'cheerio';
