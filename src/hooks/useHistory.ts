"use client";

import { useState } from "react";
import { AnalysisResult } from "@/types";

const STORAGE_KEY = "realhire_history";

export function useHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved) as AnalysisResult[];
    } catch (e) {
      console.error("Failed to parse history", e);
      return [];
    }
  });

  const addToHistory = (result: AnalysisResult) => {
    setHistory((prev) => {
      const newEntry = {
        ...result,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };

      const updated = [newEntry, ...prev].slice(0, 10);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return { history, addToHistory, clearHistory };
}
