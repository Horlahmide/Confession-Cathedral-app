import { useCallback } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { Confession } from "../types";

const CONFESSIONS_STORAGE_KEY = "confession_cathedral_data";

export function useConfessions() {
  const [confessions, setConfessions] = useLocalStorage<Confession[]>(
    CONFESSIONS_STORAGE_KEY,
    []
  );

  const addConfession = useCallback(
    (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      const newConfession: Confession = {
        id: crypto.randomUUID(), // Standard web API for unique IDs
        text: trimmedText,
        timestamp: Date.now(),
      };

      // Add to the beginning so newest is first
      setConfessions((prev) => [newConfession, ...prev]);
    },
    [setConfessions]
  );

  return {
    confessions,
    addConfession,
  };
}
