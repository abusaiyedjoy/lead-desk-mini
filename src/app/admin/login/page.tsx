"use client";

import { useActionState, useEffect, useRef } from "react";
import { loginAction, LoginState } from "./actions";
import { Shield, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  );

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus email on mount
    emailRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b from-blue-600/12 via-indigo-600/6 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950/60">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-lg shadow-blue-500/25 mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Sign in to access the LeadDesk dashboard
            </p>
          </div>

          {/* Error banner */}
          {state?.error && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Login Form */}
          <form action={action} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  ref={emailRef}
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    state?.fieldErrors?.email
                      ? "border-rose-500/60"
                      : "border-slate-800 hover:border-slate-700 focus:border-blue-500/50"
                  }`}
                />
              </div>
              {state?.fieldErrors?.email && (
                <p className="text-xs text-rose-400 mt-1">
                  {state.fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                    state?.fieldErrors?.password
                      ? "border-rose-500/60"
                      : "border-slate-800 hover:border-slate-700 focus:border-blue-500/50"
                  }`}
                />
              </div>
              {state?.fieldErrors?.password && (
                <p className="text-xs text-rose-400 mt-1">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In to Admin</span>
              )}
            </button>
          </form>

          {/* Divider & footer note */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-center text-xs text-slate-500">
              Access restricted to authorized administrators only.
            </p>
          </div>
        </div>

        {/* Back to public site link */}
        <p className="text-center text-xs text-slate-500 mt-5">
          <a
            href="/"
            className="text-slate-400 hover:text-slate-200 transition-colors underline underline-offset-4"
          >
            ← Back to Public Site
          </a>
        </p>

        {/* Footer credit */}
        <p className="text-center text-xs text-slate-600 mt-3">
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-400 transition-colors underline underline-offset-2"
          >
            Digital Heroes Training Task
          </a>
        </p>
      </div>
    </div>
  );
}
