"use client";

import { useState } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResultsView from "@/components/ResultsView";
import HistoryList from "@/components/HistoryList";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import { AnalysisResult } from "@/types";
import { useHistory } from "@/hooks/useHistory";
import { History, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addToHistory, clearHistory } = useHistory();

  const handleAnalyze = async (resume: string, jd: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resume, jobDescription: jd }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
      addToHistory(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <Background />

      <div className={styles.wrapper}>
        <header className={styles.hero}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.heroCopy}
          >
            <div className={styles.badgeRow}>
              <span className={styles.badge}>
                <Sparkles size={16} />
                AI Resume Studio
              </span>
              <span className={styles.pulseDot} />
              <span>Groq + Llama 3.1 instant responses</span>
            </div>

            <h1 className={styles.title}>
              RealHire <span className={styles.titleEmphasis}>AI Studio</span>
            </h1>
            <p className={styles.subtitle}>
              Turn raw resumes into polished, ATS-friendly documents in minutes. Paste or drop files,
              compare against any JD, and export the rewrite or a perfect-match blueprint instantly.
            </p>

            <div className={styles.metaGrid}>
              <div className={styles.metaCard}>
                <div className={styles.metaAccent} />
                <span className={styles.metaLabel}>Multi-format intake</span>
                <span className={styles.metaValue}>PDF / DOCX parsing with smart clean-up.</span>
              </div>
              <div className={styles.metaCard}>
                <div className={styles.metaAccent} />
                <span className={styles.metaLabel}>Private by default</span>
                <span className={styles.metaValue}>History lives locally. Data stays on your device.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.heroPanel}
          >
            <div className={styles.statRow}>
              <div>
                <div className={styles.statTitle}>Analysis cadence</div>
                <div className={styles.statValue}>Realtime scoring</div>
              </div>
              <div className={styles.historyIcon}>
                <Sparkles size={18} />
              </div>
            </div>
            <p className={styles.historyHint}>
              Track your last ten scans for quick iteration and role-specific rewrites.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowHistory(true)}
              className={styles.historyButton}
            >
              <div className={styles.historyIcon}>
                <History size={18} />
              </div>
              <div className={styles.historyCopy}>
                <span className={styles.historyTitle}>Open history</span>
                <span className={styles.historyHint}>Recent analyses, 10-entry log</span>
              </div>
              <Sparkles size={16} />
            </motion.button>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.stage}
        >
          {result ? (
            <ResultsView result={result} onReset={() => setResult(null)} />
          ) : (
            <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          )}
        </motion.div>
      </div>

      <Footer />

      {showHistory && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHistory(false)}
            className={styles.overlay}
          />
          <HistoryList
            history={history}
            onSelect={(item) => setResult(item)}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        </>
      )}
    </main>
  );
}
