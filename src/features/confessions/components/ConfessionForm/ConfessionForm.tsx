import { useState, useRef, useEffect } from 'react';
import { CharacterCounter } from '../CharacterCounter/CharacterCounter';
import styles from './ConfessionForm.module.css';

interface ConfessionFormProps {
  onSubmit: (text: string) => void;
}

const MAX_LENGTH = 280;

export function ConfessionForm({ onSubmit }: ConfessionFormProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isInvalid = text.trim().length === 0 || text.length > MAX_LENGTH;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    onSubmit(text);
    setText('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="confession-input" className={styles.visuallyHidden}>
        Write your confession
      </label>
      
      <div className={styles.inputWrapper}>
        <textarea
          id="confession-input"
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's weighing on your mind?"
          maxLength={MAX_LENGTH + 50} // Allow typing past limit slightly to show error state, but CharacterCounter handles limit
          rows={3}
        />
      </div>

      <div className={styles.footer}>
        <CharacterCounter currentLength={text.length} maxLength={MAX_LENGTH} />
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isInvalid}
        >
          Confess
        </button>
      </div>
    </form>
  );
}
