import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Link from "next/link";
import { ArrowLeft, Shield, Sparkles } from "lucide-react";
import { Lead } from "@/types/lead";
import type { Lead as PrismaLead } from "@prisma/client";


// Opt out of caching for admin dashboard to ensure fresh data
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  let initialLeads: Lead[] = [];
  let dbError = false;

  try {
    const rawLeads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    initialLeads = rawLeads.map((l: PrismaLead) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch leads from database:", error);
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h1 className="font-bold text-lg text-slate-100 tracking-tight">
                  LeadDesk <span className="text-blue-500 font-normal">Admin</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">Manage and track incoming lead submissions</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              Live Workspace
            </span>

            {/* Signed-in user pill */}
            {session?.email && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {session.email}
              </span>
            )}

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {dbError ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center max-w-lg mx-auto my-12 space-y-3">
            <h3 className="font-bold text-lg text-rose-200">Database Connection Notice</h3>
            <p className="text-sm text-rose-300/80">
              Unable to connect to PostgreSQL database. Please ensure your database server is running and your `DATABASE_URL` environment variable is configured correctly.
            </p>
          </div>
        ) : (
          <LeadsTable initialLeads={initialLeads} />
        )}
      </main>
    </div>
  );
}
