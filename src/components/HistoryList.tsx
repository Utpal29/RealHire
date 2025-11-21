"use client";

import { AnalysisResult } from "@/types";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Trash2 } from "lucide-react";
import styles from "./HistoryList.module.css";

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function HistoryList({ history, onSelect, onClear, onClose }: HistoryListProps) {
  const scoreColor = (score: number) => {
    if (score >= 80) return "#7cf4c3";
    if (score >= 60) return "#ffb869";
    return "#ff8a7a";
  };

  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent scans</h2>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <Clock size={42} />
          <p>No recent history</p>
        </div>
      ) : (
        <div className={styles.list}>
          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className={styles.item}
            >
              <div className={styles.itemTop}>
                <span className={styles.score} style={{ color: scoreColor(item.score) }}>
                  Score: {item.score}
                </span>
                <span className={styles.date}>{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
              </div>
              <div className={styles.cta}>
                View analysis <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <button onClick={onClear} className={styles.clearButton}>
          <Trash2 size={16} />
          Clear history
        </button>
      )}
    </div>
  );
}
