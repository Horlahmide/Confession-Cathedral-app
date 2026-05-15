import type { Confession } from "../../types";
import { ConfessionCard } from "../ConfessionCard/ConfessionCard";
import { EmptyState } from "../EmptyState/EmptyState";
import styles from "./ConfessionFeed.module.css";

interface ConfessionFeedProps {
  confessions: Confession[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  now: number;
}

export function ConfessionFeed({
  confessions,
  onDelete,
  onUpdate,
  now,
}: ConfessionFeedProps) {
  if (confessions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.feed}>
      {confessions.map((confession) => (
        <ConfessionCard
          key={confession.id}
          confession={confession}
          onDelete={() => onDelete(confession.id)}
          onUpdate={(newText) => onUpdate(confession.id, newText)}
          now={now}
        />
      ))}
    </div>
  );
}
