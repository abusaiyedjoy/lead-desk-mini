import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              LD
            </div>
            <div>
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                LeadDesk <span className="text-blue-500 font-normal">Mini</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all duration-200 shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
