"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseFile } from "@/lib/fileParser";
import { Upload, FileText, X, Loader2, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./ResumeForm.module.css";

interface ResumeFormProps {
  onAnalyze: (resume: string, jd: string) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onAnalyze, isLoading }: ResumeFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsParsing(true);
    setFileName(file.name);
    try {
      const text = await parseFile(file);
      setResumeText(text);
    } catch (error) {
      console.error(error);
      alert("Failed to parse file. Please try copying and pasting the text.");
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeText("");
    setFileName(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.card}
    >
      <div className={styles.cardInner}>
        <span className={styles.kicker}>
          <Terminal size={14} />
          Build the perfect match
        </span>
        <h2 className={styles.heading}>Compose your candidate story</h2>
        <p className={styles.helper}>
          Drop a resume or paste raw text. We clean, align to the job description, and output a fresh Markdown draft plus a
          dream-candidate blueprint you can work toward.
        </p>

        <div className={styles.chipRow}>
          <span className={styles.chip}>
            <Upload size={14} />
            PDF / DOCX intake
          </span>
          <span className={styles.chip}>
            <FileText size={14} />
            Clean Markdown output
          </span>
          <span className={styles.chip}>
            <Sparkles size={14} />
            AI rewrite + ideal profile
          </span>
        </div>

        <div className={styles.columns}>
          <div className={styles.column}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionLabel}>Resume source</div>
                <div className={styles.sectionTitle}>Drop a file or paste it raw</div>
                <p className={styles.sectionDescription}>We normalize spacing, extract text, and prep it for scoring.</p>
              </div>
              <button type="button" onClick={open} className={styles.uploadButton}>
                <Upload size={16} />
                Upload file
              </button>
            </div>

            <div
              {...getRootProps({
                className: `${styles.dropZone} ${isDragActive ? styles.dropActive : ""}`,
              })}
            >
              <input {...getInputProps()} />
              <div className={styles.dropContent}>
                <span>{isDragActive ? "Release to add your resume" : "Drag a PDF/DOCX or tap to browse"}</span>
                {fileName ? (
                  <span className={styles.filePill}>
                    <FileText size={14} />
                    {fileName}
                  </span>
                ) : (
                  <span className={styles.dropHint}>Automatic parsing + cleanup</span>
                )}
              </div>
            </div>

            <div className={styles.textAreaWrap}>
              {(fileName || isParsing) && (
                <span className={styles.statusPill}>
                  {isParsing ? <Loader2 size={14} className={styles.spinner} /> : <FileText size={14} />}
                  {isParsing ? "Parsing file..." : fileName}
                  {!isParsing && fileName && (
                    <button type="button" onClick={clearFile} className={styles.clearButton} aria-label="Clear file">
                      <X size={12} />
                    </button>
                  )}
                </span>
              )}

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className={styles.textArea}
                spellCheck={false}
              />
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionLabel}>Target role</div>
                <div className={styles.sectionTitle}>Paste the job description</div>
                <p className={styles.sectionDescription}>
                  Point us at the role, including scope, metrics, and the tech/tool stack that matters.
                </p>
              </div>
            </div>

            <div className={styles.textAreaWrap}>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                className={styles.textArea}
                spellCheck={false}
              />
            </div>

            <div className={styles.hintList}>
              <span className={styles.hintItem}>Impact metrics</span>
              <span className={styles.hintItem}>Team size & scope</span>
              <span className={styles.hintItem}>Tooling & stack</span>
              <span className={styles.hintItem}>Reporting lines</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>Files stay local; history is cached in your browser only.</span>
          <button
            onClick={() => onAnalyze(resumeText, jdText)}
            disabled={isLoading || !resumeText || !jdText}
            className={styles.primaryButton}
          >
            {isLoading ? (
              <>
                <Loader2 className={styles.spinner} size={16} />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Run analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
