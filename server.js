// Mahima's Diet Tracker — minimal Express backend
// No auth (LAN-only by design). State stored as JSON file.

const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json({ limit: '5mb' }));

// Don't expose server files
const STATIC_BLOCKED = new Set(['server.js', 'package.json', 'package-lock.json', '.env']);
app.use((req, res, next) => {
  const requested = req.path.replace(/^\//, '');
  if (STATIC_BLOCKED.has(requested) || requested.startsWith('data/') || requested.startsWith('node_modules/')) {
    return res.status(404).send('Not found');
  }
  next();
});

app.use(express.static(__dirname));

// ===== API =====
app.get('/api/state', (req, res) => {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return res.json({ state: null, updatedAt: null });
    }
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (e) {
    console.error('Read error:', e);
    res.status(500).json({ error: 'Failed to read state' });
  }
});

app.post('/api/state', (req, res) => {
  try {
    const { state } = req.body;
    if (!state || typeof state !== 'object') {
      return res.status(400).json({ error: 'Invalid state' });
    }
    const payload = { state, updatedAt: Date.now() };
    // Atomic write: write to temp file, then rename
    const tmp = STATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2));
    fs.renameSync(tmp, STATE_FILE);
    res.json({ ok: true, updatedAt: payload.updatedAt });
  } catch (e) {
    console.error('Write error:', e);
    res.status(500).json({ error: 'Failed to save state' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasData: fs.existsSync(STATE_FILE) });
});

// Helper to find local IP for phone access
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🌸 Mahima\'s Diet Tracker — backend running\n');
  console.log(`   Local:     http://localhost:${PORT}`);
  const ips = getLocalIPs();
  ips.forEach(ip => console.log(`   On phone:  http://${ip}:${PORT}   (same Wi-Fi)`));
  console.log(`\n   Data file: ${STATE_FILE}`);
  console.log('   Press Ctrl+C to stop\n');
});
