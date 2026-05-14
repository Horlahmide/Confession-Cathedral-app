import { ConfessionForm } from './features/confessions/components/ConfessionForm/ConfessionForm';
import { ConfessionFeed } from './features/confessions/components/ConfessionFeed/ConfessionFeed';
import { useConfessions } from './features/confessions/hooks/useConfessions';
import styles from './App.module.css';

function App() {
  const { confessions, addConfession } = useConfessions();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Confession Cathedral</h1>
      </header>

      <main className={styles.main}>
        <section aria-label="Submit a confession">
          <ConfessionForm onSubmit={addConfession} />
        </section>

        <section aria-label="Confession feed">
          <ConfessionFeed confessions={confessions} />
        </section>
      </main>
    </div>
  );
}

export default App;
