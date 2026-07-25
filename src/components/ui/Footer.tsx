import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 backdrop-blur-md py-6 px-4 text-center text-sm text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
            LD
          </div>
          <span className="font-semibold text-slate-200">LeadDesk Mini</span>
        </div>

        <p className="text-sm text-slate-400">
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 transition-colors"
          >
            Digital Heroes Training Task
          </a>
        </p>

        <div className="flex items-center space-x-4 text-xs text-slate-500">
          <Link href="/admin" className="hover:text-slate-300 transition-colors">
            Admin Portal
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-slate-300 transition-colors">
            Public Page
          </Link>
        </div>
      </div>
    </footer>
  );
}
