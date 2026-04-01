# Life Reboot Protocol Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first, serverless web application that guides users through a 1-day psychological reboot and provides a gamified daily dashboard, supporting EN/ZH-CN.

**Architecture:** A pure client-side SPA using Vite + React. Data is persisted to IndexedDB using Zustand's persist middleware. The app handles routing internally to switch between the Wizard (Morning/Evening), Reflect (Daytime), and Dashboard phases based on the user's saved state.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Zustand (state), IndexedDB (localforage), react-i18next (i18n), ics (calendar generation), Vitest (testing).

---

### Task 1: Project Initialization & Core Infrastructure

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite React TS project**
Run: `npm create vite@latest . -- --template react-ts` (force into current directory or handle conflicts carefully, alternatively scaffold in a `web` folder. Let's assume root for now if clean, or standard Vite setup). Install dependencies: `npm install react react-dom zustand localforage react-i18next i18next ics react-router-dom lucide-react` and dev dependencies: `npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom`.

- [ ] **Step 2: Configure Tailwind CSS**
Run `npx tailwindcss init -p`. Configure `tailwind.config.js` with brutalist theme settings (black/white, monospaced/sans fonts). Add Tailwind directives to `src/index.css`.

- [ ] **Step 3: Setup Vitest**
Configure `vitest.config.ts` and setup files for React Testing Library.

- [ ] **Step 4: Run initial tests to verify setup**
Run: `npm run test` (should pass if empty or basic App test).

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: initialize react vite project with tailwind and vitest"
```

### Task 2: State Management & i18n Setup

**Files:**
- Create: `src/store/useStore.ts`
- Create: `src/i18n/config.ts`, `src/i18n/locales/en.json`, `src/i18n/locales/zh.json`
- Test: `src/store/useStore.test.ts`

- [ ] **Step 1: Write failing test for Zustand store**
Write a test in `useStore.test.ts` verifying the initial state (status: `in_progress`, empty answers) and a state update action.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test`

- [ ] **Step 3: Implement Zustand store with IndexedDB persistence**
Implement `useStore.ts` using `zustand/middleware` `persist` and custom storage engine via `localforage`. Define the `ProtocolState` interface (morning answers, daytime answers, evening synthesis, status).

- [ ] **Step 4: Implement i18n configuration**
Setup `react-i18next` in `src/i18n/config.ts` loading `en.json` and `zh.json`. Add basic translation keys for "App Title".

- [ ] **Step 5: Run test to verify passes**
Run: `npm run test`

- [ ] **Step 6: Commit**
```bash
git add src/store src/i18n
git commit -m "feat: setup zustand with indexeddb and i18next"
```

### Task 3: UI Shell, Routing & Private Browsing Warning

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`
- Create: `src/components/Layout.tsx`, `src/components/LanguageToggle.tsx`, `src/components/PrivateBrowsingWarning.tsx`
- Test: `src/components/Layout.test.tsx`

- [ ] **Step 1: Write test for Layout and Warning**
Test that `LanguageToggle` switches language and `PrivateBrowsingWarning` renders if storage quota is minimal.

- [ ] **Step 2: Implement React Router and Layout**
Set up `react-router-dom` in `App.tsx` with routes: `/` (Home/Router logic), `/wizard`, `/reflect`, `/dashboard`. Implement `Layout.tsx` with a minimalist header containing the `LanguageToggle`.

- [ ] **Step 3: Implement Private Browsing Warning**
Create a component that uses a heuristic (e.g., catching quota errors or checking `navigator.storage.estimate`) to show a warning banner.

- [ ] **Step 4: Implement Route Guard Logic**
In `App.tsx`, read `useStore` status. If `completed`, redirect `/` to `/dashboard`. If `in_progress`, redirect `/` to `/wizard`.

- [ ] **Step 5: Run tests**
Run: `npm run test`

- [ ] **Step 6: Commit**
```bash
git add src/App.tsx src/main.tsx src/components
git commit -m "feat: implement routing, layout, and privacy warning"
```

### Task 4: Phase 1 - Morning Wizard

**Files:**
- Create: `src/pages/Wizard/Morning.tsx`
- Create: `src/components/ImmersiveInput.tsx`
- Test: `src/pages/Wizard/Morning.test.tsx`

- [ ] **Step 1: Write test for Morning flow**
Test that user can input Anti-Vision and Vision, and it saves to the store.

- [ ] **Step 2: Implement ImmersiveInput component**
A brutalist textarea component that auto-resizes, hides other UI elements on focus, and emphasizes typography.

- [ ] **Step 3: Implement Morning Wizard**
Render the prompts for Anti-Vision and Vision. Add a "Next: Setup Daytime Interrupts" button.

- [ ] **Step 4: Run tests**
Run: `npm run test`

- [ ] **Step 5: Commit**
```bash
git add src/pages/Wizard src/components/ImmersiveInput.tsx
git commit -m "feat: implement morning psychological excavation wizard"
```

### Task 5: Phase 1 - Daytime Interrupts (ICS & Reflect Route)

**Files:**
- Create: `src/pages/Wizard/DaytimeSetup.tsx`
- Create: `src/pages/Reflect/Reflect.tsx`
- Create: `src/utils/icsGenerator.ts`
- Test: `src/utils/icsGenerator.test.ts`

- [ ] **Step 1: Write test for ICS generator**
Test that `generateInterrupts` creates valid `.ics` content with the correct times and deep links (`/reflect?q=1`).

- [ ] **Step 2: Implement ICS Generator**
Use the `ics` package to create events for 11:00, 13:30, 15:15. Include the WebView warning in the event description.

- [ ] **Step 3: Implement DaytimeSetup UI**
A screen in the wizard explaining the interrupts, with a button to "Download Calendar Events" and a "Continue to Evening Synthesis" button.

- [ ] **Step 4: Implement Reflect Page**
Read `?q=` param from URL. Display the corresponding question. Provide an input to save the answer to the store. Show success message.

- [ ] **Step 5: Run tests**
Run: `npm run test`

- [ ] **Step 6: Commit**
```bash
git add src/pages/Wizard/DaytimeSetup.tsx src/pages/Reflect src/utils
git commit -m "feat: implement daytime ics generation and reflect route"
```

### Task 6: Phase 1 - Evening Synthesis

**Files:**
- Create: `src/pages/Wizard/Evening.tsx`
- Test: `src/pages/Wizard/Evening.test.tsx`

- [ ] **Step 1: Write test for Evening flow**
Test that it displays morning/daytime answers and allows inputting Mission, Boss Fight, Quests, and Rules, then marks protocol as `completed`.

- [ ] **Step 2: Implement Evening Synthesis UI**
Split screen or scrolling view: Left/Top shows previous answers (read-only). Right/Bottom has inputs for the 4 gamified elements.

- [ ] **Step 3: Implement Completion Logic**
On submit, update store status to `completed`, which will trigger the router to redirect to `/dashboard`.

- [ ] **Step 4: Run tests**
Run: `npm run test`

- [ ] **Step 5: Commit**
```bash
git add src/pages/Wizard/Evening.tsx
git commit -m "feat: implement evening synthesis and completion logic"
```

### Task 7: Phase 2 - Gamified Dashboard

**Files:**
- Create: `src/pages/Dashboard/Dashboard.tsx`
- Create: `src/components/QuestChecklist.tsx`
- Test: `src/pages/Dashboard/Dashboard.test.tsx`

- [ ] **Step 1: Write test for Dashboard**
Test that it renders Stakes, Win, Mission, Boss Fight, and allows toggling Quests.

- [ ] **Step 2: Implement Dashboard Layout**
Top Level: Anti-Vision (Red/Dark border) vs Vision (Green/Light border). Mid Level: 1-Year Mission, 1-Month Boss Fight, Rules.

- [ ] **Step 3: Implement Quest Checklist**
Render Daily Quests with checkboxes. State resets daily (can check timestamp in store, out of scope for MVP but good to have a simple "uncheck all" or daily reset logic).

- [ ] **Step 4: Run tests**
Run: `npm run test`

- [ ] **Step 5: Commit**
```bash
git add src/pages/Dashboard src/components/QuestChecklist.tsx
git commit -m "feat: implement gamified dashboard"
```

### Task 8: Settings & Data Management

**Files:**
- Create: `src/pages/Settings/Settings.tsx`
- Modify: `src/store/useStore.ts`
- Test: `src/pages/Settings/Settings.test.tsx`

- [ ] **Step 1: Write test for Settings actions**
Test JSON export/import logic and the "Reboot/Archive" store action.

- [ ] **Step 2: Implement Store Actions**
Add `archiveProtocol` action to `useStore.ts` (moves current state to `archives` array, resets active state to `in_progress`).

- [ ] **Step 3: Implement Settings UI**
Create Settings page with:
1. Export Data (downloads JSON).
2. Import Data (reads JSON, validates, updates store).
3. "Initiate New Reboot" button (with confirmation modal).

- [ ] **Step 4: Run tests**
Run: `npm run test`

- [ ] **Step 5: Commit**
```bash
git add src/pages/Settings src/store/useStore.ts
git commit -m "feat: implement settings, export/import, and reboot archiving"
```