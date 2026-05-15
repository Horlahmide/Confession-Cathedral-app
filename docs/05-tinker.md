# Tinker Exercise: The Mystery of the Missing Empty Confession

This document records our journey of breaking the code to understand how it protects itself!

---

## 1. Finding the Function
The function that handles the submission is `handleSubmit` in `src/features/confessions/components/ConfessionForm/ConfessionForm.tsx`.

## 2. My Prediction
Before trying it, my prediction was:
> "Once I removed the empty submission check, it is going to submit and it is going to record and submit an empty confession."

## 3. The Experiment
I performed the following modifications to the code:
*   Commented out the logic inside `handleSubmit` that checks for invalid submissions.
*   Commented out the `disabled` attribute on the **Confess** button so I could click it even when the textarea was empty.

## 4. The Result
**Observation:**
> "I clicked on the submit button, nothing happened. No empty confession was being recorded."

## 5. Digging Deeper (The Mystery)
Even though I removed the "Front Gate" security (the `isInvalid` check in the component), the application is still behaving as if the check is there. It refuses to save an empty confession.

**My Next Step:**
I am going to investigate the rest of the codebase to find out why it is still behaving like that. There must be another layer of protection hidden somewhere!
