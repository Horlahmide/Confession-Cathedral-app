import { useState, useRef, useEffect, memo } from "react";
import type { Confession } from "../../types";
import { getRelativeTimeString } from "../../../../utils/timeUtils";
import styles from "./ConfessionCard.module.css";

interface ConfessionCardProps {
  confession: Confession;
  onDelete: () => void;
  onUpdate: (newText: string) => void;
  now: number;
}

export const ConfessionCard = memo(({ confession, onDelete, onUpdate, now }: ConfessionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(confession.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management: return focus to Edit button when closing edit mode
  useEffect(() => {
    if (!isEditing && editButtonRef.current) {
      editButtonRef.current.focus();
    }
  }, [isEditing]);

  // Auto-resize textarea while editing (more efficient)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (isEditing && textarea) {
      // Temporarily set to 0 to get the true scrollHeight
      textarea.style.height = "0px"; 
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [isEditing, editText]);

  const handleUpdate = () => {
    if (editText.trim() && editText !== confession.text) {
      onUpdate(editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(confession.text);
    setIsEditing(false);
  };

  return (
    <article className={styles.card}>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={styles.editArea}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
        />
      ) : (
        <p className={styles.text}>"{confession.text}"</p>
      )}

      <div className={styles.footer}>
        <div className={styles.meta}>
          <time className={styles.timestamp} dateTime={new Date(confession.timestamp).toISOString()}>
            {getRelativeTimeString(confession.timestamp, now)}
          </time>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleUpdate} className={styles.actionBtn}>Save</button>
              <button onClick={handleCancel} className={styles.actionBtn}>Cancel</button>
            </>
          ) : (
            <>
              <button 
                ref={editButtonRef}
                onClick={() => setIsEditing(true)} 
                className={styles.actionBtn}
              >
                Edit
              </button>
              <button onClick={onDelete} className={styles.deleteBtn}>Delete</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
});
