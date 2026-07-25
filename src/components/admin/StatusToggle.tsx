"use client";

import { useState } from "react";
import { LeadStatus } from "@/types/lead";
import { Loader2, RefreshCw } from "lucide-react";

interface StatusToggleProps {
  leadId: string;
  currentStatus: LeadStatus;
  onStatusChange?: (newStatus: LeadStatus) => void;
}

const STATUS_ORDER: LeadStatus[] = ["NEW", "CONTACTED", "CLOSED"];

export function StatusToggle({ leadId, currentStatus, onStatusChange }: StatusToggleProps) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const getNextStatus = (curr: LeadStatus): LeadStatus => {
    const currentIndex = STATUS_ORDER.indexOf(curr);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    return STATUS_ORDER[nextIndex];
  };

  const handleToggle = async (targetStatus?: LeadStatus) => {
    if (isUpdating) return;

    const nextStatus = targetStatus || getNextStatus(status);
    if (nextStatus === status) return;

    const previousStatus = status;
    setStatus(nextStatus); // Optimistic update
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      onStatusChange?.(nextStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(previousStatus); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
      {STATUS_ORDER.map((st) => {
        const isActive = status === st;
        return (
          <button
            key={st}
            type="button"
            disabled={isUpdating}
            onClick={() => handleToggle(st)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? st === "NEW"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : st === "CONTACTED"
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-500/30"
                  : "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {isUpdating && isActive ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                {st}
              </span>
            ) : (
              st
            )}
          </button>
        );
      })}
    </div>
  );
}
