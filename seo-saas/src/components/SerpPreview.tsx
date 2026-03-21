'use client';

export function SerpPreview({ title, description, url }: {
  title: string; description: string; url: string;
}) {
  // Truncate like Google
  const maxTitleChars = 60;
  const maxDescChars = 160;
  const displayTitle = title.length > maxTitleChars ? title.slice(0, maxTitleChars - 3) + '...' : title;
  const displayDesc = description.length > maxDescChars ? description.slice(0, maxDescChars - 3) + '...' : description;

  let displayUrl = url;
  try {
    const u = new URL(url);
    displayUrl = `${u.hostname}${u.pathname === '/' ? '' : u.pathname}`;
    if (displayUrl.length > 60) displayUrl = displayUrl.slice(0, 57) + '...';
  } catch (e) { if (typeof console !== "undefined") console.error(e); }

  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-3">Google SERP Preview</h4>
      <div className="bg-white rounded-lg p-4 max-w-[600px]">
        {/* URL breadcrumb */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
            {displayUrl.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-gray-800 leading-tight">{displayUrl.split('/')[0]}</div>
            <div className="text-[11px] text-gray-500 leading-tight">{displayUrl}</div>
          </div>
        </div>
        {/* Title */}
        <a href="#" className="block text-[#1a0dab] text-lg leading-snug hover:underline font-normal mt-1"
          onClick={e => e.preventDefault()}>
          {displayTitle || 'No title set'}
        </a>
        {/* Description */}
        <p className="text-[#4d5156] text-sm leading-relaxed mt-1">
          {displayDesc || 'No meta description set. Google will auto-generate a snippet from your page content.'}
        </p>
      </div>
      {/* Pixel width info */}
      <div className="flex gap-4 mt-3 text-[10px] text-white/30">
        <span>Title: ~{title.length} chars</span>
        <span>Desc: ~{description.length} chars</span>
      </div>
    </div>
  );
}
