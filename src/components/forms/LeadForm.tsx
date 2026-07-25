"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, LeadFormSchema } from "@/lib/validations/lead";
import { BUDGET_RANGES } from "@/types/lead";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormSchema>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      budgetRange: "",
      message: "",
    },
  });

  const onSubmit = async (data: LeadFormSchema) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || "Failed to submit lead");
      }

      setIsSuccess(true);
      reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">
        {/* Ambient background glow inside form card */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Submission Received!</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Thank you for reaching out. Our team has received your details and will get back to you within 24 hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all duration-200 hover:shadow-lg"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
            <div>
              <h3 className="text-xl font-bold text-slate-100 mb-1">
                Get Started Today
              </h3>
              <p className="text-sm text-slate-400">
                Fill in the details below and we&apos;ll connect with you shortly.
              </p>
            </div>

            {serverError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Submission failed</p>
                  <p className="text-xs text-rose-300/80 mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border ${
                  errors.name
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                } text-slate-100 placeholder-slate-500 text-sm outline-none ring-4 ring-transparent transition-all duration-200`}
              />
              {errors.name && (
                <p className="text-xs text-rose-400 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border ${
                  errors.email
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                } text-slate-100 placeholder-slate-500 text-sm outline-none ring-4 ring-transparent transition-all duration-200`}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Budget Range Field */}
            <div className="space-y-1.5">
              <label htmlFor="budgetRange" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Estimated Budget Range <span className="text-rose-400">*</span>
              </label>
              <select
                id="budgetRange"
                {...register("budgetRange")}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border ${
                  errors.budgetRange
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                } text-slate-100 text-sm outline-none ring-4 ring-transparent transition-all duration-200 cursor-pointer`}
              >
                <option value="" disabled className="bg-slate-900 text-slate-500">
                  Select your project budget
                </option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range} className="bg-slate-900 text-slate-100">
                    {range}
                  </option>
                ))}
              </select>
              {errors.budgetRange && (
                <p className="text-xs text-rose-400 font-medium">{errors.budgetRange.message}</p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Project Details / Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell us about your project, timeline, or key objectives..."
                {...register("message")}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border ${
                  errors.message
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                } text-slate-100 placeholder-slate-500 text-sm outline-none ring-4 ring-transparent transition-all duration-200 resize-none`}
              />
              {errors.message && (
                <p className="text-xs text-rose-400 font-medium">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Lead...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
