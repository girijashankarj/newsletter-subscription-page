<p align="center">
  <h1 align="center">Garry's Daily Digest — Newsletter</h1>
  <p align="center">
    A production-ready newsletter subscription page. Subscribe with name, email, topic tags, and article count — or unsubscribe by email. Data is sent to a Google Sheet via Apps Script.
  </p>
</p>

<p align="center">
  <a href="https://girijashankarj.github.io/garry-newsletter-subscription-page/"><img src="https://img.shields.io/badge/Live-GitHub_Pages-4CAF50?style=flat-square&logo=googlechrome&logoColor=white" alt="live site" /></a>
  <a href="https://github.com/girijashankarj/garry-newsletter-subscription-page"><img src="https://img.shields.io/github/last-commit/girijashankarj/garry-newsletter-subscription-page?style=flat-square&logo=github" alt="last commit" /></a>
  <img src="https://img.shields.io/badge/react-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/vite-7-purple?logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/tailwind-4-blue?logo=tailwindcss" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs welcome" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Sheet Columns](#sheet-columns)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

**Garry's Daily Digest** is a standalone newsletter subscription page built with React, Vite, and Tailwind CSS v4. It supports both subscribe and unsubscribe flows. Subscribers choose topic tags (AI, ML, JavaScript, etc.), configure article count (simple or per-topic), and data is stored in a Google Sheet via Apps Script. Uses the same Apps Script URL as the portfolio — share the sheet if both are in use.

---

## Features

- **Subscribe flow** — 3-step wizard: personal info → topic tags → article count
- **Unsubscribe flow** — one-click by email
- **Light / Dark theme** — toggle with localStorage persistence
- **Portfolio-style UI** — Cormorant Garamond + Inter, clean cards, subtle borders
- **Responsive** — mobile-first layout
- **Google Sheet backend** — no server; Apps Script handles subscribe/unsubscribe
- **Topic tags** — predefined + custom tags (max 10)
- **Article modes** — simple (5–25) or per-topic distribution
- **Delivery time** — 3:30 AM UTC daily (aligned with [garry-tech-news-aggregator](https://github.com/girijashankarj/garry-tech-news-aggregator))

---

## Tech Stack

|                  | Details                    |
| ---------------- | -------------------------- |
| **Framework**    | React 19                   |
| **Build Tool**   | Vite 7                     |
| **Styling**      | Tailwind CSS v4            |
| **Fonts**        | Cormorant Garamond, Inter  |
| **Backend**      | Google Apps Script + Sheet |
| **State**        | React (useState, Context)  |

---

## Quick Start

**Prerequisites**: Node.js 18+, npm

```bash
# Clone the repo
git clone https://github.com/girijashankarj/garry-newsletter-subscription-page.git
cd garry-newsletter-subscription-page

# Install dependencies
npm install

# Copy env and set Apps Script URL
cp .env.example .env
# Edit .env: set VITE_NEWSLETTER_SCRIPT_URL

# Start dev server
npm run dev
```

**Note**: The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for deploying to GitHub Pages. See [Setup](#setup) for deployment steps.

---

## Project Structure

```
garry-newsletter-subscription-page/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions → GitHub Pages
├── public/
├── src/
│   ├── NewsletterPage.jsx   # Main page + subscribe/unsubscribe
│   ├── ThemeContext.jsx     # Light/dark theme + localStorage
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

---

## Setup

1. **Apps Script**  
   Create a Google Apps Script project bound to a Sheet. Deploy as Web App (Execute as: Me, Anyone). Implement `doPost()` for `action: "subscribe"` and `action: "unsubscribe"`.

2. **Environment**  
   Copy `.env.example` to `.env` and set `VITE_NEWSLETTER_SCRIPT_URL` (same var as portfolio; use the same URL if sharing the sheet).

3. **Deploy to GitHub Pages**  
   - Enable GitHub Pages: Repo → **Settings → Pages** → Source: **GitHub Actions**  
   - Add secret: **Settings → Secrets and variables → Actions** → `VITE_NEWSLETTER_SCRIPT_URL` (same Apps Script URL as portfolio)  
   - Push to `main` — the workflow builds and deploys automatically  
   - Live at: `https://<username>.github.io/garry-newsletter-subscription-page/`

---

## Sheet Columns (13)

| Col | Name              | Description                     |
| --- | ----------------- | ------------------------------- |
| A   | Subscriber ID     | Unique ID (e.g. SUB_timestamp)  |
| B   | First Name        |                                 |
| C   | Last Name         |                                 |
| D   | Email             |                                 |
| E   | Country Code      | null (mobile removed from form) |
| F   | Mobile            | null (mobile removed from form) |
| G   | Tags              | JSON array of topic tags        |
| H   | Article Mode      | `simple` or `perTopic`          |
| I   | Total Count       | Total articles per digest       |
| J   | Topic Distribution| JSON (per-topic counts)         |
| K   | Status            | `active` / `unsubscribed`       |
| L   | Subscribed At     | ISO timestamp                   |
| M   | Unsubscribed At   | ISO timestamp (or null)         |

---

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start dev server               |
| `npm run build`  | Production build               |
| `npm run preview`| Preview production build       |
| `npm run lint`   | Run ESLint                     |

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Make** your changes
4. **Run** linting: `npm run lint`
5. **Commit** and open a Pull Request

---

<p align="center">
  Built with discipline by <a href="https://github.com/girijashankarj">GarryTJ</a>
</p>
