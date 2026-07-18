"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// INACTIVITY TIMEOUT AND WARNING CONTROLLER
// Auto-logout after 15 minutes of inactivity.
// Warns the user with an overlay countdown 1 minute before.
// ============================================================

const INACTIVITY_LIMIT = 14 * 60 * 1000; // 14 minutes warning trigger
const WARNING_LIMIT = 60 * 1000;        // 1 minute warning countdown

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const warnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<number>(Date.now());

  // Perform secure sign out and redirect to login
  const handleLogout = useCallback(() => {
    // Clear timeouts and intervals
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    void signOut({ callbackUrl: "/login" });
  }, []);

  // Tick the countdown every second
  const startCountdown = useCallback(() => {
    setCountdown(60);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleLogout]);

  // Sets the main warning trigger timeout
  const resetTimer = useCallback(() => {
    // If warning is already active, don't auto-reset from passive background mouse events
    if (showWarning) return;

    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    activityTimeoutRef.current = Date.now();

    warnTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, INACTIVITY_LIMIT);
  }, [showWarning, startCountdown]);

  // Keep Session Alive: Reset state and start a fresh inactivity window
  const keepSessionAlive = () => {
    setShowWarning(false);
    resetTimer();
  };

  useEffect(() => {
    // Track interactions
    const activities = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    
    // Throttle listener to avoid rendering lags
    let throttleTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetTimer();
          throttleTimeout = null;
        }, 1000);
      }
    };

    activities.forEach((act) => {
      window.addEventListener(act, handleActivity, { passive: true });
    });

    // Initial timer startup
    resetTimer();

    // Cleanup listeners and intervals
    return () => {
      activities.forEach((act) => {
        window.removeEventListener(act, handleActivity);
      });
      if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [resetTimer]);

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={keepSessionAlive}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl z-10 space-y-6"
          >
            {/* Header Icon + Description */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">Are you still there?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your Aventra console session is about to expire due to inactivity. For your security, you will be signed out automatically in:
                </p>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-4 space-y-1">
              <span className="text-3xl font-extrabold text-aventra-600 tabular-nums animate-pulse">
                {countdown}s
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining Time</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </Button>
              <Button
                onClick={keepSessionAlive}
                className="flex-1 py-2.5 bg-aventra-600 hover:bg-aventra-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Stay Logged In
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
