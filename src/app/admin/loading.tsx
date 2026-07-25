export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Metric skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-900/60 border border-slate-800" />
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="h-16 rounded-2xl bg-slate-900/60 border border-slate-800" />

      {/* Table skeleton */}
      <div className="h-96 rounded-2xl bg-slate-900/40 border border-slate-800" />
    </div>
  );
}
