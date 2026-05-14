import type { Confession } from '../../types';
import { ConfessionCard } from '../ConfessionCard/ConfessionCard';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './ConfessionFeed.module.css';

interface ConfessionFeedProps {
  confessions: Confession[];
}

export function ConfessionFeed({ confessions }: ConfessionFeedProps) {
  if (confessions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.feed} role="feed" aria-busy="false">
      {confessions.map((confession) => (
        <ConfessionCard key={confession.id} confession={confession} />
      ))}
    </div>
  );
}
