import { useState, useEffect } from 'react';

/**
 * A hook that provides the current timestamp, 
 * updating every minute to sync relative time strings.
 */
export function useClock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // Tick every minute

    return () => clearInterval(interval);
  }, []);

  return now;
}
