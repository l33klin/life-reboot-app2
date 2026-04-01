# Life Reboot Protocol - Design Specification

## 1. Overview
The "Life Reboot Protocol" is a web application inspired by Dan Koe's article "How to fix your entire life in 1 day". It translates his philosophical and psychological framework into an interactive, gamified tool. The application serves two primary purposes:
1. **The 1-Day Protocol Wizard**: A guided, immersive experience that takes the user through a day of deep psychological excavation, pattern breaking, and goal synthesis.
2. **The Gamified Dashboard**: A persistent, daily-use control panel that keeps the user's ultimate vision and daily "quests" front and center to ensure long-term behavioral change.

## 2. Architecture & Technical Stack
* **Frontend Framework**: React (via Next.js static export or Vite) + Tailwind CSS.
* **Data Storage**: Local-first architecture. All user data is stored exclusively in the browser using `IndexedDB` (via a wrapper like `localforage` or Zustand's persist middleware) to avoid `localStorage` size limits and provide robust structured storage.
* **Backend**: None. The application is completely serverless to guarantee absolute privacy.
* **Integrations**: `ics` library for generating downloadable calendar events for the "Daytime Interrupts".

## 3. User Journey & Core Features

### Phase 1: The 1-Day Protocol (Onboarding Wizard)
When a user first opens the app, the system checks IndexedDB for an existing completed protocol. If none exists, or if a protocol is `in_progress`, they enter the wizard mode.

* **State Management & Resiliency**:
  * The wizard auto-saves progress on every input change.
  * If a user closes the tab and returns, they resume exactly where they left off.
* **Morning: Psychological Excavation**
  * Immersive, distraction-free writing interface (navigation hidden).
  * Prompts the user to define their "Anti-Vision" and "Vision".
* **Daytime: Interrupting Autopilot**
  * The app generates an `.ics` file containing calendar events for specific times (e.g., 11:00 AM, 1:30 PM, 3:15 PM) based on the user's local timezone.
  * Each calendar event contains a specific reflection question and a deep link back to the app (e.g., `https://[app-url]/reflect?q=1`).
  * **Deep Link Handling**: If the link is opened in an in-app WebView (e.g., from a calendar app) where storage is isolated, the app will display a warning: "Please open this link in your main browser (Safari/Chrome) to access your saved data."
* **Evening: Synthesizing Insight**
  * A review screen showing all morning and daytime answers.
  * A guided flow to synthesize these insights into the Gamified Framework:
    * **1-Year Mission**
    * **1-Month Boss Fight**
    * **Daily Quests (Levers)**
    * **Rules (Constraints)**

### Phase 2: The Gamified Dashboard (Daily Use)
Once the protocol is marked as `completed`, the app defaults to this dashboard on all subsequent visits.

* **Visual Hierarchy**:
  * **Top Level (The Stakes & The Win)**: Persistent display of the Anti-Vision (Red/Dark) and Vision (Green/Light).
  * **Mid Level (Current Objectives)**: The 1-Year Mission, 1-Month Boss Fight, and Rules (Constraints).
  * **Bottom Level (Action)**: A checklist of Daily Quests (Levers). Completing these provides a sense of progression.
* **Reboot Semantics**:
  * Users can click "Initiate a new 1-Day Reboot".
  * Doing so will prompt a warning: "This will archive your current dashboard. Are you sure?"
  * Old data is kept in an `archives` array in IndexedDB for historical review, while the active state is reset to `in_progress`.

## 4. Visual Design & UX
* **Style**: Minimalist & Brutalist.
* **Aesthetics**: High contrast (black and white), sharp edges, monospaced or clean sans-serif typography. No unnecessary shadows, rounded corners, or gradients.
* **UX Principles**: 
  * *Immersion*: During the morning and evening phases, hide all navigation. The user should only see the current question and a blinking cursor.
  * *Frictionless*: The daytime interrupts must be extremely fast to complete. Click link -> type answer -> close.

## 5. Privacy & Data Security
* **Absolute Privacy**: Zero data leaves the device. No analytics, no error tracking tools (like Sentry), and no external font CDNs that could track IP addresses.
* **Data Persistence**: Data survives browser restarts via IndexedDB.
* **Private Browsing Warning**: On first load, the app detects if it might be in Incognito/Private mode (via storage quota heuristics) and warns the user: "Data saved in Private Browsing will be lost when you close the window."
* **Cross-Device Sync**: Users are responsible for their own backups via an "Export to JSON" and "Import from JSON" feature in the settings.

## 6. Future Considerations (Out of Scope for MVP)
* PWA (Progressive Web App) support for native-like installation on mobile devices.
* Advanced analytics or "streak" tracking.
