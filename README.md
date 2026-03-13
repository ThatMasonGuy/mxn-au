# 🛠️ mxn.au — Personal Dev Playground

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Functions%20%2B%20Hosting-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Welcome to the public repo for [mxn.au](https://mxn.au) — a **big stupid experimentation project** where I build tools I actually use, test weird ideas, and iterate in public.

---

## 📚 Table of Contents

- [What this project is](#-what-this-project-is)
- [Core sections in this repo](#-core-sections-in-this-repo)
- [Feature sections](#-feature-sections)
  - [TopHeroes](#1-topheroes)
  - [Destiny 2](#2-destiny-2)
  - [Everhomes](#3-everhomes)
  - [Minecraft + Server Admin](#4-minecraft--server-admin)
  - [Translate + Discord bots](#5-translate--discord-bots)
  - [Daily games + personal tools](#6-daily-games--personal-tools)
- [Tech stack](#-tech-stack)
- [Getting started](#-getting-started)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧪 What this project is

This repo is intentionally broad and messy-in-a-good-way:

- A production playground for tools, dashboards, calculators, and prototypes.
- A shared home for game utilities, admin apps, automation features, and experiments.
- A place where features can start rough, then get polished over time.

If you're expecting one narrow app, this is not that. This is a build-lab.

---

## 🗂️ Core sections in this repo

### `src/` — Frontend application
The Vue app, route pages, UI components, composables, and client-side feature logic.

### `functions/` — Firebase Cloud Functions backend
Serverless APIs, scheduled jobs, handlers, integrations, and report/automation logic.

### `public/` — Static files
Public assets served directly by the frontend.

### `dist/` — Build output
Compiled frontend artifacts from `vite build`.

---

## 🚀 Feature sections

### 1) TopHeroes
TopHeroes is one of the largest feature areas in this project.

Includes:
- Resource/speedup/star calculators.
- Event guides and progression helpers.
- Team builder and trait trade tools.
- Queue tools, rankings, and public insight pages.
- Velaris admin/event dashboards and analytics.

Primary source areas:
- `src/pages/topheroes/`
- `src/pages/topheroes/velaris/`

### 2) Destiny 2
Destiny-focused pages and stat views for quick info and tracking.

Primary source area:
- `src/pages/destiny/`

### 3) Everhomes
Everhomes backend workflows for checklist/report generation and schema-driven report data.

Primary source areas:
- `functions/everhomes/`
- `functions/everhomes/checklistSchemas/`

### 4) Minecraft + Server Admin
Operational tools and dashboards for server visibility/management.

Includes:
- Minecraft log/dashboard views.
- Server admin dashboards and landing pages.

Primary source areas:
- `src/pages/minecraft/`
- `src/pages/server/`

### 5) Translate + Discord bots
Translation tooling, usage/rebuild/admin views, and Discord bot integration paths.

Primary source areas:
- `src/pages/translate/`
- `src/pages/discord/`
- `functions/api/` (translation + Discord endpoints)

### 6) Daily games + personal tools
Small apps and utility surfaces for recurring use.

Includes:
- Daily game generation/handlers (Wordle, Flagle, Connections).
- Personal notes, tracker, journal, and task utilities.

Primary source areas:
- `functions/dailyGames/`
- `src/pages/personal/`
- `src/pages/MXNDaily.vue`

---

## ⚙️ Tech stack

- **Frontend:** Vue 3, Vue Router, Pinia, Vite
- **Styling/UI:** Tailwind CSS, Radix/Reka UI, Heroicons/Lucide
- **Charts & data viz:** ECharts, Chart.js
- **Backend:** Firebase Cloud Functions (Node 20)
- **Integrations:** Discord APIs, OpenAI, Firebase Admin, assorted utility services

---

## 🧰 Getting started

### Prerequisites
- Node.js 20+
- npm
- Firebase CLI (for local Cloud Functions emulation)

### Install dependencies
```bash
npm install
cd functions && npm install
```

### Run frontend
```bash
npm run dev
```

### Build frontend
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Run Cloud Functions emulator
```bash
cd functions
npm run serve
```

---

## 🤝 Contributing

This project evolves quickly. If you spot something useful (or cursed), open an issue or PR.

Feedback on UX, performance, clarity, and feature ideas is always welcome.

---

## 📄 License

No explicit license file is currently present in this repository.
Unless a license is added, treat this project as all rights reserved.

---

<sub>— Mason (Yes, this was written by AI)</sub>
