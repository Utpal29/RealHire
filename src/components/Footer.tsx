import { Heart } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.status}>
          <span className={styles.dot} />
          <span>Realtime Groq scoring online</span>
        </div>

        <div className={styles.note}>
          <Heart size={12} className={styles.heart} />
          <span>Made for better resumes</span>
        </div>
      </div>
    </footer>
  );
}
