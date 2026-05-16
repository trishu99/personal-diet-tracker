# 💗 Mahima's Personal Diet Tracker

A thyroid-aware diet tracker with meal plan, recipes, period cycle tracking, and shopping list. Free, simple, mobile-friendly.

🔗 **Live**: https://trishu99.github.io/personal-diet-tracker/

## Features

- **7-day meal plan** with collapsible cards
- **Recipes** with ingredients + steps for every dish
- **Tonight's prep** — auto-detects what to soak/prepare for tomorrow
- **Period cycle tracker** with phase-aware diet tips (menstrual / follicular / ovulation / luteal)
- **Weekly shopping list** with category grouping and auto-aggregated quantities
- **Water, supplements, weight, streak tracking**
- **Thyroid quick-note** — what to eat ✅ / what to ease off ❌
- **Browser notifications** for meal reminders
- **PWA** — install to phone home screen for app-like experience

## How it works

- 100% free, runs entirely in the browser
- Data stored in your browser's **localStorage** — private to each device
- Hosted on **GitHub Pages** — no servers, no costs, no signup

## Install on your phone

1. Open https://trishu99.github.io/personal-diet-tracker/ in Safari (iPhone) or Chrome (Android)
2. Share → **Add to Home Screen**
3. The pink-heart icon appears like a native app

## Edit content

Open `data.js` to change meal plans, recipes, or shopping essentials. After editing:
```bash
git add -A
git commit -m "your change"
git push
```
Pages rebuilds in ~30s.

## Files

```
.
├── index.html          # main page
├── data.js             # meal plan, recipes, cycle phases
├── app.js              # all interactive logic
├── styles.css          # styling
├── icon.svg            # app icon (pink heart + green check)
├── server.js           # OPTIONAL local backend (see below)
├── package.json
└── .nojekyll
```

## Optional: local cross-device sync

If you want to sync data between phone and laptop (instead of independent localStorage per device), you can run the included Node backend locally:

```bash
npm install
npm start
```

Then open `http://localhost:3000` on laptop and `http://<your-ip>:3000` on phone (same Wi-Fi). The frontend will pick up the backend and show a green "Synced" pill.

This is optional — the live GitHub Pages site works perfectly with localStorage alone.

## Tech

Vanilla JavaScript + Bootstrap 5 (accordion only) + zero build step. No frameworks, no bundlers, no dependencies in the published version.
