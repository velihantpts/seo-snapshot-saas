'use client';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />;
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Skeleton className="w-[140px] h-[140px] rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      {/* Action summary */}
      <Skeleton className="h-24 w-full rounded-xl" />
      {/* Tabs */}
      <div className="flex gap-2">
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-24 rounded-xl" />)}
      </div>
      {/* Score cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      {/* Sections */}
      {[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
    </div>
  );
}
