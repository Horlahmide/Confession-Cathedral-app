# Software Engineering Principles in Confession Cathedral

This document outlines the core software engineering principles and React best practices utilized in building the Confession Cathedral application.

---

## 1. Separation of Concerns (SoC) / Modularity
**Plain Language Definition:** 
Breaking down an application into distinct, independent parts so that each part handles one specific job. It ensures that changes in one area (like how something looks) don't accidentally break another area (like how something saves data).

**Where it appears:**
*   **Folder Structure:** The codebase is split by domain (`src/features/confessions`), generic logic (`src/hooks`), and utility functions (`src/utils`).
*   **Styles:** Every component has its own `.module.css` file (e.g., `ConfessionForm.module.css`). The styling is separated from the JavaScript logic to prevent CSS collisions.
*   **State Management:** `src/features/confessions/hooks/useConfessions.ts` manages the "thinking" (adding a confession), while components like `ConfessionFeed.tsx` only handle the "showing" (rendering the cards).

---

## 2. Controlled Components
**Plain Language Definition:** 
A pattern where the application's code is the "single source of truth" for what is currently typed in an input field. Instead of the browser remembering what you typed, the React component stores the typing in its memory (state) and explicitly tells the input what to display.

**Where it appears:**
*   **`src/features/confessions/components/ConfessionForm/ConfessionForm.tsx`**:
    *   State definition: `const [text, setText] = useState('');`
    *   The textarea element binds its value and change event to React:
        ```tsx
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        ```

---

## 3. Immutability
**Plain Language Definition:** 
The rule that you should never change (mutate) existing data directly. If you want to update a list or an object, you create a brand-new copy of it with the changes included. This makes it much easier for the app to track exactly when and how data changed so it can update the screen accurately.

**Where it appears:**
*   **`src/features/confessions/hooks/useConfessions.ts`**:
    *   When adding a new confession, we do not use `.push()` to modify the old array. Instead, we create a completely new array by spreading the old items `...prev` behind the `newConfession`:
        ```tsx
        setConfessions((prev) => [newConfession, ...prev]);
        ```

---

## 4. Lifting State Up
**Plain Language Definition:** 
Moving data (state) to the closest common parent of the components that need it. If Component A needs to write data and Component B needs to read that same data, you store the data in their Parent Component and pass it down to both.

**Where it appears:**
*   **`src/App.tsx`**:
    *   The `App` component acts as the parent. It calls `useConfessions()` to hold the state.
    *   It passes the ability to write down to the form: `<ConfessionForm onSubmit={addConfession} />`
    *   It passes the list to read down to the feed: `<ConfessionFeed confessions={confessions} />`

---

## 5. Single Responsibility Principle (SRP)
**Plain Language Definition:** 
Every file, function, or component should do exactly one thing, and do it well. It should have only one reason to change.

**Where it appears:**
*   **`src/features/confessions/components/CharacterCounter/CharacterCounter.tsx`**: Its only job is to display the `current/max` text and calculate if it should turn red. It doesn't care what the text actually says.
*   **`src/utils/timeUtils.ts`**: The `getRelativeTimeString` function knows absolutely nothing about React. Its single responsibility is doing math on dates to output strings like `"2 minutes ago"`.

---

## 6. Composition (Custom Hooks)
**Plain Language Definition:** 
Building complex behaviors by combining smaller, reusable pieces of logic together, rather than writing one giant, messy function.

**Where it appears:**
*   **`src/hooks/useLocalStorage.ts`**: A generic hook that only knows how to sync data to the browser's storage.
*   **`src/features/confessions/hooks/useConfessions.ts`**: This hook composes the generic `useLocalStorage` hook to build a specific manager for Confessions. It leverages the generic behavior to achieve domain-specific results.

---

## 7. Semantic HTML & Accessibility
**Plain Language Definition:** 
Writing code that describes *what* things are, not just how they look. This ensures that screen readers and other assistive technologies can understand the web page and help users navigate it.

**Where it appears:**
*   **`src/features/confessions/components/ConfessionForm/ConfessionForm.tsx`**:
    *   Uses a `<form>` element instead of a generic `<div>` so users can submit by pressing Enter.
    *   Includes a `<label>` explicitly tied to the textarea (`htmlFor="confession-input"`), styled as `.visuallyHidden` so sighted users see the placeholder, but screen readers still read the explicit label.
*   **`src/App.tsx`**: Uses semantic landmarks like `<header>`, `<main>`, and `<section aria-label="...">` to structure the page content.
