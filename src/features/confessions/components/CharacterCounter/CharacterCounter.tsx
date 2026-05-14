import styles from './CharacterCounter.module.css';

interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
}

export function CharacterCounter({ currentLength, maxLength }: CharacterCounterProps) {
  const isNearLimit = currentLength >= maxLength * 0.9;
  const isAtLimit = currentLength >= maxLength;
  
  return (
    <div 
      className={`${styles.counter} ${isAtLimit ? styles.atLimit : isNearLimit ? styles.nearLimit : ''}`}
      aria-live="polite"
    >
      {currentLength}/{maxLength}
    </div>
  );
}
