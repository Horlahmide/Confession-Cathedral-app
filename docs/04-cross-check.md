# Cross-Check Audit: Current Codebase vs. Existing Audit (`docs/03-audit.md`)

**Written on:** May 14, 2026  
**What we checked:** The old report (`docs/03-audit.md`) talked about XSS, slow lists, too many timers, and localStorage getting too big. We checked if those are still problems.

---

## What the Symbols Mean

| Symbol | Meaning |
|--------|---------|
| ✅ Still a problem | The bug is still there — nobody fixed it yet |
| ⚠️ Kind of fixed | Someone tried to fix it, but it's not fully done |
| 🔴 New problem | We found a brand new issue the old report didn't catch |
| 🟢 Fixed / Gone | The problem was fixed since the last report |

---

## 1. XSS Security (Bad Guys Putting Code in Text)

| # | What's the Problem? | Is It Still There? | How Bad? |
|---|---------------------|--------------------|----------|
| 1.1 | React automatically escapes text (makes it safe). So `{confession.text}` is safe by default. | ✅ Still a problem | Just info — not dangerous |
| 1.2 | The text box lets you type **330** characters, but the rules say only **280** are allowed. That means characters 281–330 get saved but shouldn't. | 🔴 New problem | Low — not scary |

**Simple explanation:** React protects you from bad guys putting JavaScript in text. That's still true. But there's a new, small problem: the text box and the rules don't agree on how many characters are okay. It's like a door that says "max 10 people" but the hallway lets 15 people in.

---

## 2. Long List Performance (The Page Gets Slow)

| # | What's the Problem? | Is It Still There? | How Bad? |
|---|---------------------|--------------------|----------|
| 2.1 | Every single confession shows up on screen at once. No lazy loading. | ✅ Still a problem | Medium |

**Simple explanation:** Imagine reading a book that shows every page at the same time — it would be heavy and slow. The page needs to only show the confessions you can see (virtualization). Nobody fixed this yet.

---

## 3. Too Many Timers (The Battery Drainer)

| # | What's the Problem? | Is It Still There? | How Bad? |
|---|---------------------|--------------------|----------|
| 3.1 | Every single confession card runs its own timer. | ✅ Still a problem | Medium |

**Simple explanation:** Imagine every person in a room has their own clock ticking. That's 50 clocks! It's way better to have ONE clock on the wall that everyone looks at. Nobody switched to the one-clock system yet.

---

## 4. Storage Getting Too Big (The Hoarding Problem)

| # | What's the Problem? | Is It Still There? | How Bad? |
|---|---------------------|--------------------|----------|
| 4.1 | Confessions keep piling up with no limit. The browser only has ~5 MB of space. | ✅ Still a problem | Medium |

**Simple explanation:** It's like a toy box that never gets cleaned out. Eventually it overflows. We should only keep the newest 500 confessions (like `.slice(0, 500)`). Nobody did that yet.

---

## 5. Stale Closure Bug (The Memory Problem) — NEW

| # | What's the Problem? | Is It Still There? | How Bad? |
|---|---------------------|--------------------|----------|
| 5.1 | When you add confessions really fast, some of them get dropped because the code remembers the OLD list instead of the NEW list. | 🔴 New problem | **High — very bad** |

**Simple explanation:** In the file `src/hooks/useLocalStorage.ts:24`:

```ts
const valueToStore = value instanceof Function ? value(storedValue) : value;
```

Imagine you have a whiteboard with a list of names. You want to add "Sam" and "Joe" quickly. But the code looks at an old photo of the whiteboard instead of the real whiteboard. So it writes "Sam" on top of "Joe" by mistake. **You lose data.**

**How to fix it:** Make the code always check the REAL whiteboard (the latest value):

```ts
setStoredValue((prev) => {
  const resolved = value instanceof Function ? value(prev) : value;
  window.localStorage.setItem(key, JSON.stringify(resolved));
  return resolved;
});
```

---

## 6. Performance Problems — NEW

| # | What's the Problem? | Is It Still There? | How Bad? |
|---|---------------------|--------------------|----------|
| 6.1 | Every time you type a letter, the text box recalculates its height. That's like measuring the box 100 times while you write one sentence. | 🔴 New problem | Medium |
| 6.2 | Every confession card refreshes even when nothing changed about it. It's like re-painting a picture every time someone in the other room sneezes. | 🔴 New problem | Low-Medium |
| 6.3 | The "time ago" calculator (like "2 minutes ago") builds a brand new calculator every single time instead of reusing one. | 🔴 New problem | Low |
| 6.4 | Every card has a "will-change" CSS tag that tells the browser "I'm about to move!" — even for cards sitting still. This wastes memory. | 🔴 New problem | Low |
| 6.5 | Two different tools (`@vitejs/plugin-react` and `@rolldown/plugin-babel`) might be processing the same files twice. | 🔴 New problem | Low |

**Quick fixes:**
- **6.1** (`ConfessionForm.tsx:17-23`): Wait a tiny bit before recalculating the height (debouncing), or use `ResizeObserver`.
- **6.3** (`timeUtils.ts:24`): Create the calculator once at the top of the file and reuse it everywhere.
- **6.4** (`ConfessionCard.module.css`): Only use `will-change` on cards that are actually moving.

---

## 7. Design Problems — NEW

| # | What's Wrong? | What Rule Does It Break? | How Bad? |
|---|--------------|--------------------------|----------|
| 7.1 | **Text box says 330 but rules say 280** — the component lies about its own limit | Predictability / Honesty | Medium |
| 7.2 | `ConfessionForm` does TWO jobs: handles the form AND resizes the text box | Single Responsibility | Low |
| 7.3 | `ConfessionCard` runs its own timer (we already talked about this) | Single Responsibility | Medium |
| 7.4 | The storage code remembers OLD data instead of checking current data (same as #5.1) | Single Source of Truth | **High** |
| 7.5 | TypeScript isn't in "strict mode" — it lets bugs slip through | Type Safety | Medium |
| 7.6 | The "time ago" calculator is built over and over (same as #6.3) | DRY (Don't Repeat Yourself) | Low |
| 7.7 | The time text is stuck in English — doesn't respect the user's language setting | Internationalisation | Low |
| 7.8 | `aria-busy="false"` on the feed does nothing — it's like a button that says "don't press me" | Accessibility | Low |
| 7.9 | `aria-live="polite"` on the character counter announces EVERY keystroke to screen readers — annoying! Should only speak at 90% or 100%. | Accessibility | Low |
| 7.10 | No delete button — once you confess, it's stuck forever | Least Surprise | Low |
| 7.11 | React Compiler config is wired strangely between two build plugins | Separation of Concerns | Low |

---

## 8. Summary: How Many Problems?

| Type of Problem | Old Report | New Problems | Total |
|----------------|-----------|-------------|-------|
| Security holes | 1 (XSS) | 1 | 2 |
| Slow / performance | 2 (timers, storage) | 5 | 7 |
| Design rule breaks | 0* | 11 | 11 |
| **Total** | **3** | **17** | **20** |

*The old report called these "bad patterns" but didn't give them fancy names.

---

## 9. What Should We Fix First? (Priority List)

| Priority | What to Fix |
|----------|-------------|
| **🔥 Fix NOW** | #5.1 / #7.4 (the memory bug that drops your data) |
| **⚠️ Fix soon** | #2.1 (make the list lazy), #3.1 (one clock for everyone), #4.1 (clean the toy box), #6.1 (stop measuring the box on every letter), #7.1 (fix the text limit lie), #7.5 (turn on strict mode) |
| **🧹 Nice to fix** | #6.2 (memo), #6.3 (reuse the calculator), #6.4 (will-change), #6.5 (double processing), #7.2 (split up the form), #7.6–7.11 (small cleanups) |
| **👀 Just know about it** | #1.1 (XSS is still safe — good!) |
