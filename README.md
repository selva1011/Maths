# Numberly Maths Practice

A lightweight, browser-based maths challenge built with React, Vite, and Tailwind CSS. Choose a session length and difficulty, solve dynamically generated questions, and review your score and time.
The app also includes a separate Memory Training module for sentence recall, word order, missing words, and sequences.

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite to use the app.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build in `dist/`
- `npm run preview` — preview the production build locally

## How to play

1. Choose a session of 10, 20, 30, 50, or 100 questions.
2. Select Easy, Medium, or Hard.
3. Enter an answer and press **Enter** or **Check answer**.
4. After feedback, press **Enter** or **Next question** to continue.
5. Review your score, accuracy, and elapsed time at the end.

The challenge timer continues while you answer questions. Use the exit button to leave a challenge and return to difficulty selection.

## Memory Training

Open **Memory** in the header or from the Maths Dashboard. Choose an exercise, difficulty, question count, and display duration. During recall, tap words to build an answer; on supported desktop browsers, words can also be dragged and dropped. Missing-word recall uses text inputs.

Completed memory sessions, accuracy trends, and recommendations are stored locally under `memory_training_sessions`. Recommendations use recent results for the selected exercise and do not change difficulty automatically. These exercises are for practice and reflection, not diagnosis or proof of memory improvement.

## Dashboard and local data

On first use, choose a display name or nickname. The app creates a participant ID and saves the name, basic device/browser information, and completed challenge results in this browser’s `localStorage`. The Dashboard shows your performance and Easy, Medium, and Hard leaderboards based on saved results.

Leaderboard data is local to this browser and device. It is not shared across browsers or devices and is not a global leaderboard. Clearing browser storage removes the participant profile and challenge history.

## Project structure

```text
src/
  components/   Maths screens, dashboards, participant setup, and memory exercises
  hooks/        Reusable challenge timer
  utils/        Maths and memory generation, scoring, storage, and ranking logic
  App.jsx       Session flow and state
  index.css     Styling and responsive layouts
```

The app runs entirely in the browser and does not use a backend.
