"use client";

import { AnalysisResult } from "@/types";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle, AlertCircle, Copy, Check, ArrowLeft, Sparkles, X } from "lucide-react";
import { useState } from "react";
import styles from "./ResultsView.module.css";

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  const [copied, setCopied] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.fixedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.results}
    >
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.badge}>
            <Sparkles size={14} />
            Analysis complete
          </span>
          <h2 className={styles.title}>Match insights ready</h2>
          <p className={styles.subtitle}>Your resume is remixed for this JD alongside a perfect-match reference profile.</p>
        </div>
        <div className={styles.actionGroup}>
          <button onClick={onReset} className={styles.ghostButton}>
            <ArrowLeft size={16} />
            Start another analysis
          </button>
        </div>
      </div>

      <div className={styles.metrics}>
        <motion.div variants={itemVariants} className={styles.card}>
          <div className={styles.cardAccent} />
          <div className={styles.metricTitle}>
            <Sparkles size={16} />
            Match score
          </div>
          <div className={styles.scoreDial}>
            <div className={styles.scoreShell}>
              <svg className={styles.scoreRing}>
                <circle
                  cx="90"
                  cy="90"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  className={styles.scoreCircleBase}
                />
                <circle
                  cx="90"
                  cy="90"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  className={styles.scoreTrail}
                />
                <motion.circle
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: result.score / 100 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                  cx="90"
                  cy="90"
                  r="78"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  className={styles.scoreHighlight}
                />
              </svg>
              <div className={styles.scoreValue}>
                <span className={styles.scoreNumber}>{result.score}</span>
                <span className={styles.scoreLabel}>match</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.card}>
          <div className={styles.cardAccent} />
          <div className={styles.metricTitle}>
            <AlertCircle size={16} />
            Missing skills
          </div>
          <div className={styles.chips}>
            {result.missingSkills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className={styles.chip}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.card}>
          <div className={styles.cardAccent} />
          <div className={styles.metricTitle}>
            <Sparkles size={16} />
            AI suggestions
          </div>
          <div className={styles.suggestions}>
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className={styles.suggestionItem}>
                <CheckCircle size={16} color="#7ee0ff" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className={styles.documentCard}>
        <div className={styles.documentHeader}>
          <div className={styles.documentTitle}>
            <span style={{ width: 12, height: 12, borderRadius: "999px", background: "var(--accent-sky)" }} />
            Optimized resume draft
          </div>
          <div className={styles.documentActions}>
            <button onClick={() => setShowIdeal(true)} className={styles.buttonOutline}>
              <Sparkles size={16} />
              View ideal resume
            </button>
            <button onClick={handleCopy} className={styles.buttonOutline}>
              {copied ? <Check size={16} color="#7cf4c3" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy Markdown"}
            </button>
          </div>
        </div>
        <div className={styles.markdown}>
          <ReactMarkdown>{result.fixedResume}</ReactMarkdown>
        </div>
      </motion.div>

      <AnimatePresence>
        {showIdeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowIdeal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 14 }}
              onClick={(e) => e.stopPropagation()}
              className={styles.modal}
            >
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <Sparkles size={20} />
                  Ideal candidate resume (100% match)
                </div>
                <button onClick={() => setShowIdeal(false)} className={styles.closeButton} aria-label="Close ideal resume">
                  <X size={16} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.markdown}>
                  <ReactMarkdown>{result.idealResume || "Ideal resume generation failed."}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
