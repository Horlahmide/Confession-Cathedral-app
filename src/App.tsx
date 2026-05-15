import { useState, useMemo, useEffect } from 'react';
import { ConfessionForm } from './features/confessions/components/ConfessionForm/ConfessionForm';
import { ConfessionFeed } from './features/confessions/components/ConfessionFeed/ConfessionFeed';
import { useConfessions } from './features/confessions/hooks/useConfessions';
import { useClock } from './hooks/useClock';
import styles from './App.module.css';

function App() {
  const { confessions, addConfession, deleteConfession, updateConfession } = useConfessions();
  const now = useClock();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Wait 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredConfessions = useMemo(() => {
    return confessions.filter((c) =>
      c.text.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [confessions, debouncedQuery]);

  return (
    <div className={styles.appWrapper}>
      <div className={styles.contentContainer}>
        <nav className={styles.nav} aria-label="Main Navigation">
          <div className={styles.logo}>Confession Cathedral</div>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search reflections..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>Release what weighs on your soul.</h1>
          <p className={styles.subtitle}>
            A sacred digital space for reflection, release, and quiet understanding.
          </p>
        </header>

        <main className={styles.main}>
          <section aria-label="Submit a confession">
            <ConfessionForm onSubmit={addConfession} />
          </section>

          <div className={styles.sectionLabel}>
            {searchQuery ? `Search results for "${searchQuery}"` : "Recent Reflections"}
          </div>

          <section aria-label="Confession feed">
            <ConfessionFeed 
              confessions={filteredConfessions} 
              onDelete={deleteConfession}
              onUpdate={updateConfession}
              now={now}
            />
          </section>
        </main>
      </div>

      <footer className={styles.footerWrapper}>
        <div className={styles.footerContent}>
          <div className={styles.brandInfo}>
            <div className={styles.brandName}>Confession Cathedral</div>
            <p className={styles.brandDescription}>
              Building a bridge between the weight of the past and the lightness of the future.
            </p>
            <div className={styles.copyright}>
              © 2026 Confession Cathedral. A sacred digital space.
            </div>
          </div>
          <nav className={styles.footerLinks} aria-label="Footer Navigation">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms of Silence</a>
            <a href="#support">Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
