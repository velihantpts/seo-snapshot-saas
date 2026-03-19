import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-bold tracking-tighter text-white/[0.06] mb-4">404</div>
        <h1 className="text-xl font-medium tracking-tight mb-2">Page not found</h1>
        <p className="text-white/40 text-sm mb-8">The page you are looking for does not exist.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary text-sm">Go home</Link>
          <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
