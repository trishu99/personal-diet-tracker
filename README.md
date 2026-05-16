# Mahima's Personal Diet Tracker

A thyroid-aware diet + cycle + shopping tracker with Node.js backend for cross-device sync.

## Quick start (local)

```bash
cd /Users/makothar/personal/personal-diet-tracker
npm install
npm start
```

Server prints:
```
🌸 Mahima's Diet Tracker — backend running
   Local:     http://localhost:3000
   On phone:  http://<your-laptop-ip>:3000   (same Wi-Fi)
```

Open the local URL in your browser, or the LAN URL on your phone (must be on same Wi-Fi).

## How sync works

- Frontend always writes to `localStorage` first (instant, works offline)
- Then debounces a `POST /api/state` to the backend (700ms after last change)
- On page load, frontend renders from `localStorage` immediately, then `GET /api/state` to pull latest
- Tab focus refresh: when you switch back to the tab, it pulls latest from backend
- Backend stores everything in `data/state.json` (one file, atomic writes)

## Sync status indicator (header)

| Badge | Meaning |
|---|---|
| 🟢 Synced | Backend reachable, latest changes saved |
| 🟡 Syncing… | In-flight save or load |
| ⚫ Offline | Backend unreachable; using localStorage only |
| 🔴 Sync error | Backend reachable but request failed |
| ⚫ Local only | No backend detected (opened as `file://`) |

## API

- `GET /api/state` → `{ state, updatedAt }` or `{ state: null }`
- `POST /api/state` with `{ state }` → `{ ok: true, updatedAt }`
- `GET /api/health` → `{ ok: true, hasData: bool }`

No authentication — keep on local network only.

## Files

```
.
├── server.js           # Express backend
├── package.json
├── index.html          # served from same origin
├── app.js
├── data.js
├── styles.css
├── data/
│   └── state.json      # auto-created, gitignored
└── .gitignore
```

## Deployment (when ready)

GitHub Pages is **static-only** — it can't host this Node.js backend. Options for hosting the full app:

- **Render** (free 750hr/mo, spins down after 15 min): connect your GitHub repo, set start command `node server.js`. The backend + frontend serve from the same URL.
- **Railway** ($5/mo credit): similar to Render.
- **Fly.io** (generous free tier): one-time `fly launch` then `fly deploy`.

For all three, you'll want a **persistent volume** mounted at `/app/data` so `state.json` survives restarts.

If you'd rather host frontend on GitHub Pages and use a hosted database instead, swap the backend for **Firebase Firestore** or **Supabase** — both have free tiers and the frontend talks to them directly. Let me know and I'll do that swap.

## Stop the server

`Ctrl+C` in the terminal.
