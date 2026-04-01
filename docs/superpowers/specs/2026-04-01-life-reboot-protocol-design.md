# Life Reboot Protocol - Design Specification

## 1. Overview
The "Life Reboot Protocol" is a web application inspired by Dan Koe's article "How to fix your entire life in 1 day". It translates his philosophical and psychological framework into an interactive, gamified tool. The application serves two primary purposes:
1. **The 1-Day Protocol Wizard**: A guided, immersive experience that takes the user through a day of deep psychological excavation, pattern breaking, and goal synthesis.
2. **The Gamified Dashboard**: A persistent, daily-use control panel that keeps the user's ultimate vision and daily "quests" front and center to ensure long-term behavioral change.

## 2. Architecture & Technical Stack
* **Frontend Framework**: React (via Next.js static export or Vite) + Tailwind CSS.
* **Data Storage**: Local-first architecture. All user data is stored exclusively in the browser using `localStorage` or `IndexedDB` (e.g., via Zustand with a persist middleware).
* **Backend**: None. The application is completely serverless to guarantee absolute privacy for the user's deeply personal reflections.
* **Integrations**: `ics` library for generating downloadable calendar events for the "Daytime Interrupts".

## 3. User Journey & Core Features

### Phase 1: The 1-Day Protocol (Onboarding Wizard)
When a user first opens the app (or chooses to "reboot"), they enter the wizard mode.

* **Morning: Psychological Excavation**
  * Immersive, distraction-free writing interface.
  * Prompts the user to define their "Anti-Vision" (the life they refuse to live) and "Vision" (the ideal life).
* **Daytime: Interrupting Autopilot**
  * The app generates an `.ics` file containing calendar events for specific times (e.g., 11:00 AM, 1:30 PM, 3:15 PM).
  * Each calendar event contains a specific reflection question (e.g., "What am I avoiding right now?") and a deep link back to the app (e.g., `https://[app-url]/reflect?q=1`).
  * Clicking the link opens a minimal modal/page in the app to quickly log their answer, saving it to local storage.
* **Evening: Synthesizing Insight**
  * A review screen showing all morning and daytime answers.
  * A guided flow to synthesize these insights into the Gamified Framework:
    * **1-Year Mission**
    * **1-Month Boss Fight**
    * **Daily Quests (Levers)**
    * **Rules (Constraints)**

### Phase 2: The Gamified Dashboard (Daily Use)
Once the protocol is complete, the app defaults to this dashboard on subsequent visits.

* **Visual Hierarchy**:
  * **Top Level (The Stakes & The Win)**: Persistent display of the Anti-Vision (Red/Dark) and Vision (Green/Light) to maintain high intrinsic motivation.
  * **Mid Level (Current Objectives)**: The 1-Year Mission and 1-Month Boss Fight.
  * **Bottom Level (Action)**: A checklist of Daily Quests (Levers). Completing these provides a sense of progression.
* **Settings/Controls**: Option to export/import data (JSON) for backup, and a button to initiate a new "1-Day Reboot" if their life stage changes.

## 4. Visual Design & UX
* **Style**: Minimalist & Brutalist.
* **Aesthetics**: High contrast (black and white), sharp edges, monospaced or clean sans-serif typography. No unnecessary shadows, rounded corners, or gradients. The design forces the user to confront the raw text and truth.
* **UX Principles**: 
  * *Immersion*: During the morning and evening phases, hide all navigation. The user should only see the current question and a blinking cursor.
  * *Frictionless*: The daytime interrupts must be extremely fast to complete. Click link -> type answer -> close.

## 5. Privacy & Data Security
* **Absolute Privacy**: Because the prompts ask for embarrassing and deeply personal truths, the app explicitly states that zero data leaves the device.
* **Data Persistence**: Data survives browser restarts via local storage. Users are responsible for their own backups via an "Export to JSON" feature if they wish to switch devices.

## 6. Future Considerations (Out of Scope for MVP)
* PWA (Progressive Web App) support for native-like installation on mobile devices.
* Advanced analytics or "streak" tracking (keep it simple for now to avoid superficial gamification).
