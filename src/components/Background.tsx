import styles from "./Background.module.css";

export default function Background() {
  return (
    <div className={styles.backdrop}>
      <div className={styles.base} />
      <div className={styles.grid} />
      <div className={styles.grain} />
    </div>
  );
}
