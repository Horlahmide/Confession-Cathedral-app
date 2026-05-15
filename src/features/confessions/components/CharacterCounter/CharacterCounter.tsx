import styles from './CharacterCounter.module.css';

interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
}

export function CharacterCounter({ currentLength, maxLength }: CharacterCounterProps) {
  const isNearLimit = currentLength >= maxLength * 0.9 && currentLength < maxLength;
  const isAtLimit = currentLength >= maxLength;
  
  return (
    <div 
      className={`${styles.counter} ${isNearLimit ? styles.nearLimit : ''} ${isAtLimit ? styles.atLimit : ''}`}
      aria-live={currentLength >= maxLength * 0.9 ? 'polite' : 'off'}
    >
      {currentLength}/{maxLength}
    </div>
  );
}
