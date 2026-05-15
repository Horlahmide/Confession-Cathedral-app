import { useCallback } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { Confession } from "../types";

const CONFESSIONS_STORAGE_KEY = "confession_cathedral_data";
const MAX_LENGTH = 280;

export function useConfessions() {
  const [confessions, setConfessions] = useLocalStorage<Confession[]>(
    CONFESSIONS_STORAGE_KEY,
    [],
  );

  const addConfession = useCallback(
    (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || trimmedText.length > MAX_LENGTH) return;

      const newConfession: Confession = {
        id: crypto.randomUUID(), // Standard web API for unique IDs
        text: trimmedText,
        timestamp: Date.now(),
      };

      // Add to the beginning so newest is first, but keep only the 500 newest
      setConfessions((prev) => {
        const newList = [newConfession, ...prev];
        return newList.slice(0, 500);
      });
    },
    [setConfessions],
  );

  const deleteConfession = useCallback(
    (id: string) => {
      setConfessions((prev) => prev.filter((c) => c.id !== id));
    },
    [setConfessions],
  );

  const updateConfession = useCallback(
    (id: string, newText: string) => {
      const trimmedText = newText.trim();
      if (!trimmedText || trimmedText.length > MAX_LENGTH) return;

      setConfessions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, text: trimmedText } : c)),
      );
    },
    [setConfessions],
  );

  return {
    confessions,
    addConfession,
    deleteConfession,
    updateConfession,
  };
}
