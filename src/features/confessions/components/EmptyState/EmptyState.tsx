import styles from './EmptyState.module.css';

export function EmptyState() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        The wall is empty. Be the first to share a thought.
      </p>
    </div>
  );
}
