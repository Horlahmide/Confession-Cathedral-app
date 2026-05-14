import { useEffect, useState } from 'react';
import type { Confession } from '../../types';
import { getRelativeTimeString } from '../../../../utils/timeUtils';
import styles from './ConfessionCard.module.css';

interface ConfessionCardProps {
  confession: Confession;
}

export function ConfessionCard({ confession }: ConfessionCardProps) {
  const [timeAgo, setTimeAgo] = useState(() => getRelativeTimeString(confession.timestamp));

  useEffect(() => {
    // Update the timestamp string every minute
    const interval = setInterval(() => {
      setTimeAgo(getRelativeTimeString(confession.timestamp));
    }, 60000);

    return () => clearInterval(interval);
  }, [confession.timestamp]);

  return (
    <article className={styles.card}>
      <p className={styles.text}>{confession.text}</p>
      <div className={styles.footer}>
        <time 
          dateTime={new Date(confession.timestamp).toISOString()} 
          className={styles.timestamp}
        >
          {timeAgo}
        </time>
      </div>
    </article>
  );
}
