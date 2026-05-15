# The Lie Detector Test: Codebase Knowledge

As part of validating my understanding of the Confession Cathedral codebase, I was presented with "Four Truths and a Lie" about how the application works.

## The Five Statements

1. **Storage (True):** The application stores confessions entirely in the user's browser using `localStorage`, meaning no backend database is required to remember the notes after a page refresh.
2. **Textarea Resizing (The Lie):** When the textarea automatically grows taller as the user types a long confession, this behavior is handled entirely by a special CSS rule (`resize: auto`).
3. **Adding Data (True):** When a new confession is successfully submitted, the `useConfessions` hook uses the spread operator (`...prev`) to create a brand-new array, placing the newest confession at the very beginning of the list.
4. **Security (True):** The application prevents XSS (Cross-Site Scripting) attacks naturally because it relies on React's default behavior, which automatically escapes variables placed inside curly braces like `{confession.text}`.
5. **Form State (True):** The `ConfessionForm` uses a "controlled input" pattern, meaning the React state (the `text` variable) acts as the absolute boss and single source of truth for what letters are currently displayed in the typing box.

---

## My Answer & Explanation

**Identifying the Lie:**
I correctly identified that **Statement #2 is the lie.**

**How I Spotted It:**
There is no special CSS rule that says `resize: auto;` to automatically grow a text box. In fact, inside `ConfessionForm.module.css`, we specifically wrote `resize: none;` to hide the default browser drag handle! 

Instead, the resizing magic is completely controlled by React. Inside `ConfessionForm.tsx`, we use a `useEffect` hook that listens for changes to the `text` state. Every time the user types, the hook recalculates the actual pixel height (`scrollHeight`) and updates the inline style of the textarea to perfectly match the height of the words.

This proves the difference between static CSS and dynamic React logic!
