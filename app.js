// Mahima's Personal Diet Tracker — app logic

// ============================================
// STATE
// ============================================
const STORAGE_KEY = 'mahima-diet-tracker-v1';

let state = {
  selectedDay: getTodayName(),
  meals: {},
  water: {},
  supplements: {},
  weights: [],
  remindersEnabled: false,
  expandedRecipes: {},
  expandedOptions: {},   // key: "Monday-6" → true if the swap picker is open
  mealSwaps: {},         // key: "Monday-6" → { food, recipes } chosen alternative
  collapsedMeals: {},    // key: "Monday-0" → true if collapsed (default = expanded)
  prepDone: {},
  shopping: {},
  period: {
    cycles: [],
    symptoms: {},
    settings: { avgCycleLength: 28, avgPeriodLength: 5 }
  }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
      if (!state.period) state.period = { cycles: [], symptoms: {}, settings: { avgCycleLength: 28, avgPeriodLength: 5 } };
      if (!state.period.settings) state.period.settings = { avgCycleLength: 28, avgPeriodLength: 5 };
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }

  // Seed Mahima's known May 2026 cycle (9–11 May, 3 days).
  // Uses versioning so it overwrites any stale test data, but only runs once.
  // Bump PERIOD_SEED_VERSION to re-seed in the future.
  const PERIOD_SEED_VERSION = 2;
  if (state.period.seedVersion !== PERIOD_SEED_VERSION) {
    state.period.cycles = [{ start: '2026-05-09', end: '2026-05-11' }];
    state.period.settings.avgPeriodLength = 3;
    state.period.seedVersion = PERIOD_SEED_VERSION;
    delete state.period.seeded;  // cleanup old flag
    saveState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  pushToBackend();
}

// ============================================
// BACKEND SYNC
// ============================================
const API_BASE = window.location.origin;
let backendAvailable = false;
let lastSyncedAt = null;
let pushTimer = null;
let syncStatus = 'unknown';  // 'unknown' | 'syncing' | 'synced' | 'offline' | 'error' | 'local'

function setSyncStatus(s) {
  syncStatus = s;
  const el = document.getElementById('sync-status');
  if (!el) return;
  // Hide pill entirely when there's no backend (e.g. GitHub Pages).
  // Only show it when sync is actually happening or available.
  if (s === 'local' || s === 'unknown') {
    el.style.display = 'none';
    return;
  }
  el.style.display = '';
  const labels = {
    syncing: { dot: '🟡', text: 'Syncing…' },
    synced:  { dot: '🟢', text: 'Synced' },
    offline: { dot: '⚫', text: 'Offline' },
    error:   { dot: '🔴', text: 'Sync error' }
  };
  const { dot, text } = labels[s] || { dot: '⚪', text: '' };
  el.innerHTML = `<span class="sync-dot">${dot}</span><span class="sync-text">${text}</span>`;
  el.className = `sync-status sync-${s}`;
  el.title = lastSyncedAt ? `Last synced: ${new Date(lastSyncedAt).toLocaleTimeString()}` : '';
}

async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
    if (res.ok) {
      backendAvailable = true;
      return true;
    }
  } catch (e) {
    // no backend (e.g. opened as file://)
  }
  backendAvailable = false;
  return false;
}

async function pullFromBackend() {
  if (!backendAvailable) return false;
  try {
    setSyncStatus('syncing');
    const res = await fetch(`${API_BASE}/api/state`);
    if (!res.ok) {
      setSyncStatus('error');
      return false;
    }
    const { state: remoteState, updatedAt } = await res.json();
    if (remoteState) {
      // Merge remote over local (remote wins as source of truth)
      state = { ...state, ...remoteState };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSyncedAt = updatedAt;
    }
    setSyncStatus('synced');
    return true;
  } catch (e) {
    console.warn('Pull failed:', e);
    setSyncStatus('offline');
    return false;
  }
}

function pushToBackend() {
  if (!backendAvailable) return;
  // Debounce: only push 700ms after the last change
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      setSyncStatus('syncing');
      const res = await fetch(`${API_BASE}/api/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      });
      if (res.ok) {
        const data = await res.json();
        lastSyncedAt = data.updatedAt;
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (e) {
      console.warn('Push failed:', e);
      setSyncStatus('offline');
    }
  }, 700);
}

// Refresh from backend when tab gets focus (catches edits from another device)
window.addEventListener('focus', async () => {
  if (backendAvailable) {
    await pullFromBackend();
    render();
  }
});

// ============================================
// HELPERS
// ============================================
function getTodayName() {
  return DAYS_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function mealKey(day, slotIndex) {
  return `${getTodayKey()}-${day}-${slotIndex}`;
}

function supplementKey(supp) {
  return `${getTodayKey()}-${supp}`;
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function getDateForDay(dayName) {
  const today = new Date();
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const targetIdx = DAYS_ORDER.indexOf(dayName);
  const diff = targetIdx - todayIdx;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(d1, d2) {
  const a = typeof d1 === 'string' ? new Date(d1) : d1;
  const b = typeof d2 === 'string' ? new Date(d2) : d2;
  a.setHours(0,0,0,0); b.setHours(0,0,0,0);
  return Math.round((b - a) / 86400000);
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ============================================
// PERIOD TRACKER LOGIC
// ============================================
function getCyclePhase() {
  const cycles = state.period.cycles || [];
  if (cycles.length === 0) return { phase: 'unknown', day: null, daysUntilNext: null, nextDate: null };

  const latest = cycles[cycles.length - 1];
  const day = daysBetween(latest.start, getTodayKey()) + 1;
  const cycleLen = state.period.settings.avgCycleLength || 28;
  const periodLen = state.period.settings.avgPeriodLength || 5;

  let phase;
  const ovStart = Math.max(periodLen + 1, Math.floor(cycleLen / 2) - 2);
  const ovEnd = ovStart + 3;
  if (day < 1) phase = 'unknown';
  else if (day <= periodLen) phase = 'menstrual';
  else if (day < ovStart) phase = 'follicular';
  else if (day <= ovEnd) phase = 'ovulation';
  else if (day <= cycleLen + 2) phase = 'luteal';
  else phase = 'late';

  const daysUntilNext = Math.max(0, cycleLen - day + 1);
  const nextDate = new Date(latest.start);
  nextDate.setDate(nextDate.getDate() + cycleLen);

  return { phase, day, daysUntilNext, nextDate, latest, cycleLen, periodLen };
}

function getCycleStats() {
  const cycles = state.period.cycles || [];
  if (cycles.length < 2) return { avgCycle: null, avgPeriod: null };
  const cycleLengths = [];
  const periodLengths = [];
  for (let i = 1; i < cycles.length; i++) {
    cycleLengths.push(daysBetween(cycles[i-1].start, cycles[i].start));
  }
  cycles.forEach(c => {
    if (c.end) periodLengths.push(daysBetween(c.start, c.end) + 1);
  });
  const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0) / arr.length) : null;
  return { avgCycle: avg(cycleLengths), avgPeriod: avg(periodLengths), cycleLengths, periodLengths };
}

function logPeriodStart() {
  const today = getTodayKey();
  const cycles = state.period.cycles;
  if (cycles.length > 0 && !cycles[cycles.length - 1].end) {
    if (!confirm("There's an open period log. Did you mean to start a NEW cycle? (OK = add new, Cancel = abort)")) return;
  }
  cycles.push({ start: today });
  const stats = getCycleStats();
  if (stats.avgCycle) state.period.settings.avgCycleLength = stats.avgCycle;
  if (stats.avgPeriod) state.period.settings.avgPeriodLength = stats.avgPeriod;
  saveState();
  showToast('🌑 Period start logged');
  refreshPeriodModal();
  render();
}

function logPeriodEnd() {
  const today = getTodayKey();
  const cycles = state.period.cycles;
  if (cycles.length === 0) {
    showToast('Log a period start first');
    return;
  }
  cycles[cycles.length - 1].end = today;
  const stats = getCycleStats();
  if (stats.avgPeriod) state.period.settings.avgPeriodLength = stats.avgPeriod;
  saveState();
  showToast('✓ Period end logged');
  refreshPeriodModal();
  render();
}

function deleteLastCycle() {
  if (!confirm('Delete the most recent period entry?')) return;
  state.period.cycles.pop();
  saveState();
  refreshPeriodModal();
  render();
}

function dateKeyFromDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Flatten all logged cycles into a Set of YYYY-MM-DD period days.
function getPeriodDaySet() {
  const set = new Set();
  (state.period.cycles || []).forEach(c => {
    const start = new Date(c.start + 'T00:00:00');
    const end = c.end ? new Date(c.end + 'T00:00:00') : start;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      set.add(dateKeyFromDate(d));
    }
  });
  return set;
}

// Rebuild {start, end} cycle ranges from a set of period days by grouping
// contiguous runs. A run that ends on today is left "ongoing" (no end).
function rebuildCyclesFromDaySet(daySet) {
  const keys = Array.from(daySet).sort();
  const todayKey = getTodayKey();
  const cycles = [];
  let runStart = null, prev = null;
  const closeRun = () => {
    const c = { start: runStart };
    if (prev !== todayKey) c.end = prev;
    cycles.push(c);
  };
  keys.forEach(k => {
    if (runStart === null) { runStart = k; prev = k; return; }
    if (daysBetween(prev, k) === 1) { prev = k; return; }
    closeRun();
    runStart = k; prev = k;
  });
  if (runStart !== null) closeRun();
  return cycles;
}

// Toggle a single calendar day on/off as a period day.
function togglePeriodDay(key) {
  if (key > getTodayKey()) { showToast("Can't log a future date"); return; }
  const set = getPeriodDaySet();
  if (set.has(key)) set.delete(key);
  else set.add(key);
  state.period.cycles = rebuildCyclesFromDaySet(set);
  const stats = getCycleStats();
  if (stats.avgCycle) state.period.settings.avgCycleLength = stats.avgCycle;
  if (stats.avgPeriod) state.period.settings.avgPeriodLength = stats.avgPeriod;
  saveState();
  refreshPeriodModal();
  render();
}

function logSymptomToday(field, value) {
  const today = getTodayKey();
  if (!state.period.symptoms[today]) state.period.symptoms[today] = {};
  state.period.symptoms[today][field] = value;
  saveState();
}

// ============================================
// RENDER
// ============================================
function render() {
  renderWarningBanner();
  renderDaySelector();
  renderDayContent();
  renderSidebar();
}

function renderWarningBanner() {
  const el = document.getElementById('warning-banner');
  el.className = 'thyroid-note';
  el.innerHTML = `
    <div class="thyroid-note-header">
      <span class="thyroid-note-icon">🦋</span>
      <span class="thyroid-note-title">Thyroid Quick Note</span>
    </div>
    <div class="thyroid-note-grid">
      <div class="thyroid-col eat">
        <div class="thyroid-col-header">✅ Prioritise</div>
        <ul>
          ${THYROID_GUIDE.eat.map(x => `<li><strong>${x.item}</strong><span>${x.why}</span></li>`).join('')}
        </ul>
      </div>
      <div class="thyroid-col avoid">
        <div class="thyroid-col-header">❌ Ease off</div>
        <ul>
          ${THYROID_GUIDE.avoid.map(x => `<li><strong>${x.item}</strong><span>${x.why}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderDaySelector() {
  const el = document.getElementById('day-selector');
  const today = getTodayName();
  el.innerHTML = DAYS_ORDER.map(day => `
    <button class="day-btn ${state.selectedDay === day ? 'active' : ''} ${day === today ? 'today' : ''}" data-day="${day}">
      ${day.slice(0, 3)}
    </button>
  `).join('');
  el.querySelectorAll('.day-btn').forEach(btn => {
    btn.onclick = () => {
      state.selectedDay = btn.dataset.day;
      saveState();
      render();
    };
  });
}

function renderDayContent() {
  const main = document.getElementById('main-content');
  const day = WEEKLY_PLAN[state.selectedDay];
  const isToday = state.selectedDay === getTodayName();
  const phaseInfo = getCyclePhase();
  const phase = PHASES[phaseInfo.phase];

  const phaseChip = phaseInfo.phase !== 'unknown' ? `
    <span class="phase-chip" style="background:${phase.bg};color:${phase.color}" title="Cycle Day ${phaseInfo.day}">
      ${phase.emoji} ${phase.label} · Day ${phaseInfo.day}
    </span>
  ` : '';

  // Count collapsed for the toolbar
  const totalMeals = day.slots.length;
  let collapsedCount = 0;
  for (let i = 0; i < totalMeals; i++) {
    if (state.collapsedMeals[`${state.selectedDay}-${i}`]) collapsedCount++;
  }
  const allCollapsed = collapsedCount === totalMeals;

  main.innerHTML = `
    <div class="day-header">
      <h2>${state.selectedDay} ${isToday ? '· Today' : ''}</h2>
      <div class="theme">${day.theme}</div>
      <div class="day-tags">
        <span class="seed-tag">Daily Seed: ${day.seed}</span>
        ${phaseChip}
      </div>
      <div class="day-toolbar">
        <button class="toolbar-btn" id="toggle-all-meals">
          ${allCollapsed ? '▼ Expand all' : '▶ Collapse all'}
        </button>
      </div>
    </div>
    <div class="accordion accordion-flush meals-accordion" id="meals-accordion">
      ${day.slots.map((slot, i) => renderMealCard(slot, i)).join('')}
    </div>
  `;

  // Checkbox toggle
  main.querySelectorAll('.meal-checkbox[data-key]').forEach(cb => {
    cb.onclick = (e) => {
      e.stopPropagation();
      const key = cb.dataset.key;
      state.meals[key] = !state.meals[key];
      saveState();
      if (state.meals[key]) showToast('✓ Logged!');
      render();
    };
  });

  // Recipe expand (still my own toggle, not Bootstrap)
  main.querySelectorAll('.recipe-toggle').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      state.expandedRecipes[id] = !state.expandedRecipes[id];
      saveState();
      render();
    };
  });

  // "More options" swap picker
  main.querySelectorAll('.options-toggle').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.optionsId;
      state.expandedOptions[id] = !state.expandedOptions[id];
      saveState();
      render();
    };
  });

  main.querySelectorAll('.option-pick').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      applyMealSwap(parseInt(btn.dataset.slotIdx), btn.dataset.optType, parseInt(btn.dataset.optIdx));
    };
  });

  main.querySelectorAll('.option-reset').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      resetMealSwap(parseInt(btn.dataset.resetSlot));
    };
  });

  // Sync Bootstrap accordion state back to localStorage (no re-render to avoid loops)
  main.querySelectorAll('.accordion-collapse').forEach(el => {
    el.addEventListener('shown.bs.collapse', () => {
      delete state.collapsedMeals[el.dataset.collapseKey];
      saveState();
    });
    el.addEventListener('hidden.bs.collapse', () => {
      state.collapsedMeals[el.dataset.collapseKey] = true;
      saveState();
    });
  });

  // Expand/collapse all — drives Bootstrap programmatically
  const toggleAllBtn = document.getElementById('toggle-all-meals');
  if (toggleAllBtn) {
    toggleAllBtn.onclick = () => {
      const shouldExpand = allCollapsed;
      main.querySelectorAll('.accordion-collapse').forEach(el => {
        if (typeof bootstrap === 'undefined') return;
        const inst = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
        if (shouldExpand) inst.show(); else inst.hide();
      });
      // toolbar label flips on next user interaction; render to update it
      setTimeout(() => render(), 400);
    };
  }
}

// Resolve a slot for a given day/index, applying any saved swap override.
function getEffectiveSlot(dayName, i) {
  const slot = WEEKLY_PLAN[dayName].slots[i];
  const sw = state.mealSwaps && state.mealSwaps[`${dayName}-${i}`];
  if (sw) return { ...slot, food: sw.food, recipes: sw.recipes || [], swapped: true };
  return slot;
}

function applyMealSwap(i, type, optIdx) {
  const opt = (MEAL_OPTIONS[type] || [])[optIdx];
  if (!opt) return;
  const swapId = `${state.selectedDay}-${i}`;
  const defaultFood = WEEKLY_PLAN[state.selectedDay].slots[i].food;
  if (!state.mealSwaps) state.mealSwaps = {};
  if (opt.food === defaultFood) {
    // Picked the original plan dish — clear any override.
    delete state.mealSwaps[swapId];
  } else {
    state.mealSwaps[swapId] = { food: opt.food, recipes: opt.recipes || [] };
  }
  delete state.expandedOptions[swapId];   // collapse picker after choosing
  delete state.expandedRecipes[swapId];   // recipe view may no longer match
  saveState();
  showToast('🍽️ Meal swapped');
  render();
}

function resetMealSwap(i) {
  const swapId = `${state.selectedDay}-${i}`;
  if (state.mealSwaps) delete state.mealSwaps[swapId];
  delete state.expandedRecipes[swapId];
  saveState();
  showToast('↩︎ Reset to plan default');
  render();
}

function renderMealCard(slotArg, i) {
  const slot = getEffectiveSlot(state.selectedDay, i);
  const key = mealKey(state.selectedDay, i);
  const collapseKey = `${state.selectedDay}-${i}`;
  const collapseId = `meal-collapse-${state.selectedDay}-${i}`;
  const isDone = !!state.meals[key];
  const isExpanded = !state.collapsedMeals[collapseKey];
  const recipeId = `${state.selectedDay}-${i}`;
  const recipeKeys = slot.recipes || [];
  const hasRecipes = recipeKeys.length > 0;

  const recipeHTML = hasRecipes ? `
    <button class="recipe-toggle" data-id="${recipeId}">
      ${state.expandedRecipes[recipeId] ? '▼ Hide recipe' + (recipeKeys.length > 1 ? 's' : '') : `▶ Show ${recipeKeys.length === 1 ? 'recipe' : `${recipeKeys.length} recipes`}`}
    </button>
    ${state.expandedRecipes[recipeId] ? renderRecipes(recipeKeys) : ''}
  ` : '';

  const optionsHTML = renderMealOptions(slot, i);

  return `
    <div class="accordion-item meal-acc-item ${isDone ? 'done' : ''}">
      <div class="meal-acc-row">
        <div class="meal-checkbox-side">
          <div class="meal-checkbox ${isDone ? 'checked' : ''}" data-key="${key}"></div>
        </div>
        <h2 class="accordion-header flex-grow-1" id="meal-h-${collapseKey}">
          <button class="accordion-button ${isExpanded ? '' : 'collapsed'}"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#${collapseId}"
                  aria-expanded="${isExpanded}"
                  aria-controls="${collapseId}">
            <div class="meal-acc-info">
              <div class="meal-time-row">
                <span class="meal-time">${slot.time}</span>
                <span class="meal-type-badge type-${slot.type}">${slot.type}</span>
              </div>
              <div class="meal-title">${slot.title}</div>
            </div>
          </button>
        </h2>
      </div>
      <div id="${collapseId}" class="accordion-collapse collapse ${isExpanded ? 'show' : ''}"
           data-collapse-key="${collapseKey}"
           aria-labelledby="meal-h-${collapseKey}">
        <div class="accordion-body">
          <div class="meal-content">${slot.food || ''}${slot.swapped ? ' <span class="swapped-tag">swapped</span>' : ''}</div>
          ${recipeHTML}
          ${optionsHTML}
        </div>
      </div>
    </div>
  `;
}

function renderMealOptions(slot, i) {
  const opts = MEAL_OPTIONS[slot.type];
  if (!opts || opts.length === 0) return '';
  const optId = `${state.selectedDay}-${i}`;
  const isOpen = !!state.expandedOptions[optId];

  if (!isOpen) {
    return `<button class="options-toggle" data-options-id="${optId}">🔄 More options</button>`;
  }

  const list = opts.map((opt, idx) => {
    const active = opt.food === slot.food;
    return `
      <button class="option-pick ${active ? 'active' : ''}"
              data-opt-type="${slot.type}" data-opt-idx="${idx}" data-slot-idx="${i}">
        <span class="option-check">${active ? '✓' : '+'}</span>
        <span class="option-food">${opt.food}</span>
      </button>`;
  }).join('');

  const resetBtn = slot.swapped
    ? `<button class="option-reset" data-reset-slot="${i}">↩︎ Reset to plan default</button>`
    : '';

  return `
    <button class="options-toggle open" data-options-id="${optId}">▼ Hide options</button>
    <div class="options-panel">
      <div class="options-hint">Tap an option to swap this ${slot.type}:</div>
      ${list}
      ${resetBtn}
    </div>`;
}

function renderRecipes(recipeKeys) {
  return `<div class="recipes-container">` +
    recipeKeys.map(key => {
      const r = RECIPES[key];
      if (!r) return `<div class="recipe-details"><em>Recipe "${key}" not found</em></div>`;
      return renderSingleRecipe(r);
    }).join('') + `</div>`;
}

function renderSingleRecipe(r) {
  const prep = (r.prepAhead && r.prepAhead.length > 0) ? `
    <div class="recipe-prep">
      <strong>🌙 Prep ahead:</strong>
      <ul>${r.prepAhead.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
  ` : '';

  const ingredients = `
    <div class="recipe-section">
      <strong>🧾 Ingredients</strong>
      <table class="ingredients-table">
        <thead>
          <tr><th>Item</th><th>Quantity</th></tr>
        </thead>
        <tbody>
          ${r.ingredients.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;

  const steps = `
    <div class="recipe-section">
      <strong>👨‍🍳 Steps</strong>
      <ol class="recipe-steps">
        ${r.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>
  `;

  const tip = r.tip ? `<div class="recipe-tip">💡 <em>${r.tip}</em></div>` : '';

  return `
    <div class="recipe-details">
      <div class="recipe-name">${r.name}</div>
      ${prep}
      ${ingredients}
      ${steps}
      ${tip}
    </div>
  `;
}

// ============================================
// SIDEBAR
// ============================================
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    ${renderProgressCard()}
    ${renderPeriodCard()}
    ${renderTonightPrepCard()}
    ${renderWaterCard()}
    ${renderSupplementsCard()}
    ${renderStreakCard()}
    ${renderWeightCard()}
    ${renderRemindersCard()}
    ${renderEssentialsCard()}
    ${renderResetCard()}
  `;
  attachSidebarHandlers();
}

function renderProgressCard() {
  const day = WEEKLY_PLAN[state.selectedDay];
  const total = day.slots.length;
  let done = 0;
  for (let i = 0; i < total; i++) {
    if (state.meals[mealKey(state.selectedDay, i)]) done++;
  }
  const pct = Math.round((done / total) * 100);

  return `
    <div class="sidebar-card">
      <h3>🌸 Today's Progress</h3>
      <div class="tracker-row">
        <span class="tracker-label">Meals logged</span>
        <span class="tracker-value">${done}/${total}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill mahima" style="width: ${pct}%"></div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:8px;">
        ${pct === 100 ? '🎉 Day complete!' : pct >= 70 ? '🔥 Great progress!' : pct >= 40 ? '👍 Keep going' : '💪 Just start'}
      </div>
    </div>
  `;
}

function renderPeriodCard() {
  const info = getCyclePhase();
  const phase = PHASES[info.phase];
  const stats = getCycleStats();

  if (info.phase === 'unknown') {
    return `
      <div class="sidebar-card period-card-sidebar">
        <h3>🌸 Cycle Tracker</h3>
        <div class="period-empty">
          <div style="font-size:36px;text-align:center;">❓</div>
          <p style="font-size:13px;color:var(--muted);margin:8px 0;text-align:center;">Not tracked yet.<br>Log your last period start to begin.</p>
          <button class="btn" id="open-period" style="width:100%">Open Period Tracker</button>
        </div>
      </div>
    `;
  }

  const nextStr = info.daysUntilNext === 0 ? "Today"
    : info.daysUntilNext === 1 ? "Tomorrow"
    : info.phase === 'late' ? `${Math.abs(info.cycleLen - info.day)}d overdue`
    : `in ${info.daysUntilNext}d`;

  return `
    <div class="sidebar-card period-card-sidebar">
      <h3>🌸 Cycle Tracker</h3>
      <div class="phase-display" style="background:${phase.bg};border-color:${phase.color}">
        <div class="phase-emoji-big">${phase.emoji}</div>
        <div class="phase-label-big" style="color:${phase.color}">${phase.label}</div>
        <div class="phase-day-big">Day ${info.day}</div>
      </div>
      <div class="period-stats">
        <div class="period-stat">
          <div class="period-stat-label">Next period</div>
          <div class="period-stat-value">${nextStr}</div>
        </div>
        <div class="period-stat">
          <div class="period-stat-label">Avg cycle</div>
          <div class="period-stat-value">${stats.avgCycle || info.cycleLen}d</div>
        </div>
      </div>
      <button class="btn" style="width:100%;margin-top:10px" id="open-period">Open Tracker</button>
    </div>
  `;
}

function renderTonightPrepCard() {
  const selectedIdx = DAYS_ORDER.indexOf(state.selectedDay);
  const nextIdx = (selectedIdx + 1) % 7;
  const nextDay = DAYS_ORDER[nextIdx];
  const nextDayPlan = WEEKLY_PLAN[nextDay];

  const prepItems = [];
  const seenKeys = new Set();
  nextDayPlan.slots.forEach((_, idx) => {
    const slot = getEffectiveSlot(nextDay, idx);
    if (!slot.recipes) return;
    slot.recipes.forEach(rKey => {
      if (seenKeys.has(rKey)) return;
      seenKeys.add(rKey);
      const r = RECIPES[rKey];
      if (r && r.prepAhead && r.prepAhead.length > 0) {
        r.prepAhead.forEach(p => prepItems.push({ text: p, recipe: r.name }));
      }
    });
  });

  DAILY_ESSENTIALS.dailySoak.forEach(item => {
    prepItems.unshift({ text: item, recipe: 'Daily' });
  });

  const dateKey = getDateForDay(state.selectedDay);
  const tk = `prep-${dateKey}`;
  if (!state.prepDone) state.prepDone = {};
  const doneMap = state.prepDone[tk] || {};

  const isToday = state.selectedDay === getTodayName();
  const headerLabel = isToday ? `Tonight's Prep` : `${state.selectedDay} Night Prep`;

  return `
    <div class="sidebar-card prep-card">
      <h3>🌙 ${headerLabel} <span class="for-tomorrow">→ for ${nextDay}</span></h3>
      <div class="prep-list">
        ${prepItems.length === 0
          ? '<div style="font-size:12px;color:#94a3b8;text-align:center;padding:8px;">Nothing extra to prep — enjoy the night ✨</div>'
          : prepItems.map((item, i) => `
              <div class="prep-item ${doneMap[i] ? 'done' : ''}" data-prep-idx="${i}" data-prep-tk="${tk}">
                <div class="meal-checkbox ${doneMap[i] ? 'checked' : ''}"></div>
                <div class="prep-text">
                  <div>${item.text}</div>
                  <div class="prep-recipe">${item.recipe}</div>
                </div>
              </div>
            `).join('')
        }
      </div>
    </div>
  `;
}

function renderWaterCard() {
  const filled = state.water[getTodayKey()] || 0;
  const target = PROFILE.waterTarget;

  const drops = [];
  for (let i = 0; i < target; i++) {
    drops.push(`<div class="water-drop ${i < filled ? 'filled' : ''}" data-water-idx="${i}">💧</div>`);
  }

  return `
    <div class="sidebar-card">
      <h3>💧 Water (${filled}/${target} glasses)</h3>
      <div class="water-grid">${drops.join('')}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:8px;text-align:center;">
        ~${(filled * 0.25).toFixed(2)}L of ${(target * 0.25).toFixed(1)}L target
      </div>
    </div>
  `;
}

function renderSupplementsCard() {
  const items = PROFILE.supplements.map(s => {
    const k = supplementKey(s);
    const done = !!state.supplements[k];
    return `
      <div class="supplement-item ${done ? 'done' : ''}" data-supp="${s}">
        <div class="meal-checkbox ${done ? 'checked' : ''}"></div>
        <span>${s}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="sidebar-card">
      <h3>💊 Supplements</h3>
      ${items}
    </div>
  `;
}

function renderStreakCard() {
  const streak = calculateStreak();
  return `
    <div class="sidebar-card">
      <h3>🔥 Streak</h3>
      <div class="streak-display">
        <div class="streak-number">${streak}</div>
        <div class="streak-label">${streak === 1 ? 'day' : 'days'} strong</div>
      </div>
    </div>
  `;
}

function calculateStreak() {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = DAYS_ORDER[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const slots = WEEKLY_PLAN[dayName].slots;
    let done = 0;
    for (let j = 0; j < slots.length; j++) {
      const key = `${dateKey}-${dayName}-${j}`;
      if (state.meals[key]) done++;
    }
    const pct = done / slots.length;
    if (pct >= 0.5) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

function renderWeightCard() {
  const entries = state.weights || [];
  const latest = entries[entries.length - 1];
  const start = PROFILE.weight;
  const current = latest ? latest.kg : start;
  const diff = (current - start).toFixed(1);
  const diffStr = diff > 0 ? `+${diff}` : diff;
  const history = entries.slice(-5).reverse().map(e =>
    `<div class="weight-entry"><span>${e.date}</span><span>${e.kg} kg</span></div>`
  ).join('');

  return `
    <div class="sidebar-card">
      <h3>⚖️ Weight (${current} kg, ${diffStr})</h3>
      <div class="weight-form">
        <input type="number" step="0.1" class="weight-input" id="weight-input" placeholder="Enter kg" />
        <button class="btn" id="log-weight-btn">Log</button>
      </div>
      ${entries.length > 0 ? `<div class="weight-history">${history}</div>` : ''}
    </div>
  `;
}

function renderRemindersCard() {
  return `
    <div class="sidebar-card">
      <h3>🔔 Meal Reminders</h3>
      <div style="font-size:13px;color:var(--muted);">Browser notifications at meal times.</div>
      <button class="reminder-btn ${state.remindersEnabled ? 'active' : ''}" id="reminder-toggle">
        ${state.remindersEnabled ? '✓ Reminders ON' : 'Enable Reminders'}
      </button>
      <div class="reminder-status" id="reminder-status"></div>
    </div>
  `;
}

function renderEssentialsCard() {
  return `
    <div class="sidebar-card">
      <h3>🌿 Daily Essentials</h3>
      <ul class="essentials-list">
        <li><strong>Seed mix:</strong> ${DAILY_ESSENTIALS.seedMix}</li>
        <li><strong>Nuts:</strong> ${DAILY_ESSENTIALS.nuts}</li>
        ${DAILY_ESSENTIALS.rules.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderResetCard() {
  return `
    <div class="sidebar-card" style="text-align:center;">
      <button class="danger-btn" id="reset-today">Reset today's check-ins</button>
    </div>
  `;
}

function attachSidebarHandlers() {
  document.querySelectorAll('.water-drop').forEach(drop => {
    drop.onclick = () => {
      const idx = parseInt(drop.dataset.waterIdx);
      const wk = getTodayKey();
      const current = state.water[wk] || 0;
      state.water[wk] = idx + 1 === current ? idx : idx + 1;
      saveState();
      render();
    };
  });

  document.querySelectorAll('.supplement-item').forEach(item => {
    item.onclick = () => {
      const k = supplementKey(item.dataset.supp);
      state.supplements[k] = !state.supplements[k];
      saveState();
      render();
    };
  });

  const logBtn = document.getElementById('log-weight-btn');
  if (logBtn) {
    logBtn.onclick = () => {
      const input = document.getElementById('weight-input');
      const kg = parseFloat(input.value);
      if (!kg || kg < 30 || kg > 300) { showToast('Enter a valid weight'); return; }
      state.weights.push({ date: getTodayKey(), kg });
      saveState();
      showToast(`Logged ${kg} kg`);
      render();
    };
  }

  document.querySelectorAll('.prep-item').forEach(item => {
    item.onclick = () => {
      const idx = parseInt(item.dataset.prepIdx);
      const tk = item.dataset.prepTk;
      if (!state.prepDone[tk]) state.prepDone[tk] = {};
      state.prepDone[tk][idx] = !state.prepDone[tk][idx];
      saveState();
      render();
    };
  });

  const btn = document.getElementById('reminder-toggle');
  if (btn) btn.onclick = toggleReminders;

  const reset = document.getElementById('reset-today');
  if (reset) {
    reset.onclick = () => {
      if (!confirm("Reset today's meal check-ins, water and supplements?")) return;
      const today = getTodayKey();
      Object.keys(state.meals).forEach(k => { if (k.includes(today)) delete state.meals[k]; });
      Object.keys(state.water).forEach(k => { if (k.includes(today)) delete state.water[k]; });
      Object.keys(state.supplements).forEach(k => { if (k.includes(today)) delete state.supplements[k]; });
      saveState();
      showToast('Reset done');
      render();
    };
  }

  const periodBtn = document.getElementById('open-period');
  if (periodBtn) periodBtn.onclick = openPeriodModal;
}

// ============================================
// REMINDERS
// ============================================
async function toggleReminders() {
  if (state.remindersEnabled) {
    state.remindersEnabled = false;
    clearAllReminders();
    saveState();
    render();
    return;
  }
  if (!('Notification' in window)) {
    document.getElementById('reminder-status').textContent = 'Notifications not supported';
    return;
  }
  let perm = Notification.permission;
  if (perm === 'default') perm = await Notification.requestPermission();
  if (perm === 'granted') {
    state.remindersEnabled = true;
    saveState();
    scheduleReminders();
    showToast('🔔 Reminders enabled');
    render();
  } else {
    document.getElementById('reminder-status').textContent = 'Permission denied';
  }
}

let reminderTimeouts = [];
function clearAllReminders() {
  reminderTimeouts.forEach(t => clearTimeout(t));
  reminderTimeouts = [];
}

function scheduleReminders() {
  clearAllReminders();
  const todayName = getTodayName();
  const today = WEEKLY_PLAN[todayName];
  const now = new Date();
  today.slots.forEach((_, idx) => {
    const slot = getEffectiveSlot(todayName, idx);
    const time = parseTimeToToday(slot.time);
    if (time > now) {
      const delay = time - now;
      const t = setTimeout(() => {
        new Notification(`🍽️ ${slot.title}`, {
          body: `${slot.time} — ${slot.food || ''}`.slice(0, 200)
        });
      }, delay);
      reminderTimeouts.push(t);
    }
  });
  const midnight = new Date();
  midnight.setHours(24, 0, 5, 0);
  const t = setTimeout(scheduleReminders, midnight - now);
  reminderTimeouts.push(t);
}

function parseTimeToToday(timeStr) {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return new Date(0);
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d;
}

// ============================================
// SHOPPING LIST
// ============================================
const FRACTIONS = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1/3, '⅔': 2/3, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };

function parseQty(str) {
  if (!str || typeof str !== 'string') return null;
  if (/to taste|as needed|a pinch|few|—|optional/i.test(str)) return null;
  let s = str;
  for (const [f, v] of Object.entries(FRACTIONS)) s = s.split(f).join(v.toString());
  const m = s.match(/(\d+\.?\d*)\s*([a-zA-Z]+)?/);
  if (!m) return null;
  let unit = (m[2] || 'count').toLowerCase().replace(/s$/, '');
  if (unit === 'gram') unit = 'g';
  if (unit === 'kilogram' || unit === 'kg') unit = 'kg';
  if (['small','medium','large','piece','bunch','pack','jar','loaf','inch','clove'].includes(unit)) unit = 'count';
  return { num: parseFloat(m[1]), unit };
}

function fmtQty(num, unit) {
  if (unit === 'g' && num >= 1000) return `${(num/1000).toFixed(2)} kg`;
  if (unit === 'ml' && num >= 1000) return `${(num/1000).toFixed(2)} L`;
  const rounded = Math.round(num * 100) / 100;
  return `${rounded} ${unit === 'count' ? (rounded === 1 ? 'piece' : 'pieces') : unit}`;
}

function buildShoppingList() {
  const occ = {};
  DAYS_ORDER.forEach(day => {
    WEEKLY_PLAN[day].slots.forEach((_, idx) => {
      const slot = getEffectiveSlot(day, idx);
      if (!slot.recipes) return;
      slot.recipes.forEach(rKey => {
        if (!occ[rKey]) occ[rKey] = 0;
        occ[rKey]++;
      });
    });
  });

  const items = {};
  function addItem(name, qty, recipeName) {
    if (!items[name]) items[name] = { totals: {}, sources: new Set(), unparsed: [] };
    const parsed = parseQty(qty);
    if (parsed) {
      items[name].totals[parsed.unit] = (items[name].totals[parsed.unit] || 0) + parsed.num;
    } else {
      items[name].unparsed.push(qty);
    }
    if (recipeName) items[name].sources.add(recipeName);
  }

  for (const [rKey, count] of Object.entries(occ)) {
    const recipe = RECIPES[rKey];
    if (!recipe) continue;
    recipe.ingredients.forEach(row => {
      for (let i = 0; i < count; i++) addItem(row[0], row[1], recipe.name);
    });
  }

  WEEKLY_ESSENTIALS.forEach(e => {
    if (!items[e.item]) items[e.item] = { totals: {}, sources: new Set(), unparsed: [], note: e.note };
    const parsed = parseQty(e.qty);
    if (parsed) items[e.item].totals[parsed.unit] = (items[e.item].totals[parsed.unit] || 0) + parsed.num;
    else items[e.item].unparsed.push(e.qty);
    if (e.note) items[e.item].note = e.note;
    items[e.item].sources.add('Daily essentials');
  });

  const grouped = {};
  CATEGORIES.forEach(c => grouped[c.id] = []);
  for (const [name, data] of Object.entries(items)) {
    const catId = categorize(name);
    const totalsStr = Object.entries(data.totals).map(([u,n]) => fmtQty(n,u)).join(' + ');
    const display = totalsStr || (data.unparsed.length ? data.unparsed.join(', ') : '—');
    grouped[catId].push({ name, qty: display, sources: [...data.sources], note: data.note });
  }
  Object.values(grouped).forEach(arr => arr.sort((a,b) => a.name.localeCompare(b.name)));
  return grouped;
}

function getWeekKey() {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function openShoppingList() {
  if (document.getElementById('shopping-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'shopping-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = renderShoppingModal();
  document.body.appendChild(modal);
  attachShoppingHandlers();
}

function closeShoppingList() {
  const m = document.getElementById('shopping-modal');
  if (m) m.remove();
}

function renderShoppingModal() {
  const list = buildShoppingList();
  const weekKey = getWeekKey();
  const bought = state.shopping || {};
  const totalItems = Object.values(list).reduce((s, arr) => s + arr.length, 0);
  const boughtCount = Object.keys(bought).filter(k => k.startsWith(`${weekKey}-`) && bought[k]).length;

  const sections = CATEGORIES.filter(c => list[c.id] && list[c.id].length > 0).map(c => `
    <div class="shop-section">
      <h4 class="shop-section-title">${c.label} <span class="shop-section-count">${list[c.id].length}</span></h4>
      <div class="shop-items">
        ${list[c.id].map(item => {
          const key = `${weekKey}-${item.name}`;
          const checked = !!bought[key];
          const sourcesText = item.sources.slice(0, 3).join(', ') + (item.sources.length > 3 ? `, +${item.sources.length - 3} more` : '');
          return `
            <div class="shop-item ${checked ? 'done' : ''}" data-shop-key="${key}">
              <div class="meal-checkbox ${checked ? 'checked' : ''}"></div>
              <div class="shop-item-info">
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-qty">${item.qty}</div>
                ${item.note ? `<div class="shop-item-note">💡 ${item.note}</div>` : ''}
                <div class="shop-item-sources">Used in: ${sourcesText}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  return `
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <h2>🛒 Weekly Shopping List</h2>
          <div class="modal-subtitle">${totalItems} items · ${boughtCount} bought · Week ${weekKey}</div>
        </div>
        <button class="modal-close" id="shop-close">✕</button>
      </div>
      <div class="shop-toolbar">
        <div class="shop-actions">
          <button class="btn-secondary" id="shop-copy">📋 Copy</button>
          <button class="btn-secondary" id="shop-print">🖨️ Print</button>
          <button class="btn-secondary danger-btn" id="shop-reset">↻ Reset</button>
        </div>
      </div>
      <div class="shop-content">${sections}</div>
    </div>
  `;
}

function attachShoppingHandlers() {
  document.getElementById('shop-close').onclick = closeShoppingList;
  document.getElementById('shopping-modal').addEventListener('click', (e) => {
    if (e.target.id === 'shopping-modal') closeShoppingList();
  });
  document.querySelectorAll('.shop-item').forEach(item => {
    item.onclick = () => {
      const key = item.dataset.shopKey;
      if (!state.shopping) state.shopping = {};
      state.shopping[key] = !state.shopping[key];
      saveState();
      item.classList.toggle('done');
      item.querySelector('.meal-checkbox').classList.toggle('checked');
      const subtitle = document.querySelector('.modal-subtitle');
      if (subtitle) {
        const weekKey = getWeekKey();
        const boughtCount = Object.keys(state.shopping).filter(k => k.startsWith(`${weekKey}-`) && state.shopping[k]).length;
        subtitle.innerHTML = subtitle.innerHTML.replace(/\d+ bought/, `${boughtCount} bought`);
      }
    };
  });
  document.getElementById('shop-copy').onclick = () => {
    const list = buildShoppingList();
    let text = `🛒 Weekly Shopping List — Mahima\n\n`;
    CATEGORIES.forEach(c => {
      if (!list[c.id] || list[c.id].length === 0) return;
      text += `${c.label}\n`;
      list[c.id].forEach(item => { text += `  ☐ ${item.name} — ${item.qty}\n`; });
      text += `\n`;
    });
    navigator.clipboard.writeText(text).then(() => showToast('📋 Copied'));
  };
  document.getElementById('shop-print').onclick = () => window.print();
  document.getElementById('shop-reset').onclick = () => {
    if (!confirm('Reset all "bought" checkmarks for this week?')) return;
    const weekKey = getWeekKey();
    Object.keys(state.shopping || {}).forEach(k => {
      if (k.startsWith(`${weekKey}-`)) delete state.shopping[k];
    });
    saveState();
    const modal = document.getElementById('shopping-modal');
    modal.innerHTML = renderShoppingModal();
    attachShoppingHandlers();
    showToast('Reset done');
  };
}

// ============================================
// PERIOD MODAL
// ============================================
function openPeriodModal() {
  if (document.getElementById('period-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'period-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = renderPeriodModal();
  document.body.appendChild(modal);
  attachPeriodHandlers();
}

function closePeriodModal() {
  const m = document.getElementById('period-modal');
  if (m) m.remove();
}

function refreshPeriodModal() {
  const m = document.getElementById('period-modal');
  if (!m) return;
  m.innerHTML = renderPeriodModal();
  attachPeriodHandlers();
}

function renderPeriodModal() {
  const info = getCyclePhase();
  const phase = PHASES[info.phase];
  const stats = getCycleStats();
  const todaySymptoms = state.period.symptoms[getTodayKey()] || {};
  const cycles = state.period.cycles || [];
  const settings = state.period.settings;
  const activeCycle = cycles.length > 0 && !cycles[cycles.length - 1].end;

  return `
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <h2>🌸 Period Tracker</h2>
          <div class="modal-subtitle">${cycles.length} ${cycles.length === 1 ? 'cycle' : 'cycles'} logged</div>
        </div>
        <button class="modal-close" id="period-close">✕</button>
      </div>

      <div class="period-content">
        ${info.phase !== 'unknown' ? `
          <div class="period-phase-banner" style="background:${phase.bg};border-left:4px solid ${phase.color}">
            <div class="phase-banner-emoji">${phase.emoji}</div>
            <div class="phase-banner-info">
              <div class="phase-banner-label" style="color:${phase.color}">${phase.label} Phase · Day ${info.day}</div>
              <div class="phase-banner-desc">${phase.description}</div>
              ${info.phase === 'late'
                ? `<div class="phase-banner-next">⏰ ${Math.abs(info.cycleLen - info.day)} days overdue</div>`
                : `<div class="phase-banner-next">Next period: ${formatDateShort(info.nextDate.toISOString().split('T')[0])} (${info.daysUntilNext === 0 ? 'today' : info.daysUntilNext === 1 ? 'tomorrow' : `in ${info.daysUntilNext} days`})</div>`
              }
            </div>
          </div>
        ` : ''}

        <div class="period-section">
          <h4>📝 Quick Log</h4>
          <div class="period-actions">
            <button class="btn period-action-btn" id="btn-period-start">🌑 Period Started Today</button>
            ${activeCycle ? `<button class="btn-secondary period-action-btn" id="btn-period-end">✓ Period Ended Today</button>` : ''}
          </div>
        </div>

        <div class="period-section">
          <h4>💭 How are you feeling today?</h4>
          <div class="symptom-grid">
            ${renderSymptomRow('flow', 'Flow', ['none', 'spotting', 'light', 'medium', 'heavy'], todaySymptoms.flow)}
            ${renderRatingRow('cramps', 'Cramps', todaySymptoms.cramps)}
            ${renderRatingRow('mood', 'Mood', todaySymptoms.mood)}
            ${renderRatingRow('energy', 'Energy', todaySymptoms.energy)}
            <div class="symptom-row">
              <div class="symptom-label">Notes</div>
              <textarea class="symptom-notes" id="symptom-notes" placeholder="Anything to remember..." rows="2">${todaySymptoms.notes || ''}</textarea>
            </div>
          </div>
        </div>

        ${info.phase !== 'unknown' ? `
          <div class="period-section">
            <h4>${phase.emoji} ${phase.label} Phase — Diet Tips</h4>
            <ul class="phase-tips">
              ${phase.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${cycles.length > 0 ? `
          <div class="period-section">
            <h4>📅 Last 60 Days</h4>
            ${renderMiniCalendar()}
          </div>
        ` : ''}

        ${cycles.length > 0 ? `
          <div class="period-section">
            <h4>📖 Cycle History</h4>
            <div class="cycle-history">
              ${cycles.slice(-6).reverse().map((c, idx) => {
                const realIdx = cycles.length - 1 - idx;
                const next = cycles[realIdx + 1];
                const cycleLen = next ? daysBetween(c.start, next.start) : null;
                const periodLen = c.end ? daysBetween(c.start, c.end) + 1 : null;
                return `
                  <div class="cycle-entry">
                    <div class="cycle-dates">
                      <strong>${formatDateShort(c.start)}</strong>
                      ${c.end ? ` → ${formatDateShort(c.end)}` : ' → ongoing'}
                    </div>
                    <div class="cycle-meta">
                      ${periodLen ? `${periodLen}d period` : ''}
                      ${cycleLen ? ` · ${cycleLen}d cycle` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <button class="danger-btn" id="delete-last-cycle" style="margin-top:8px;">Delete last entry</button>
          </div>
        ` : ''}

        ${stats.avgCycle ? `
          <div class="period-section">
            <h4>📊 Your Patterns</h4>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">${stats.avgCycle} <span class="stat-unit">days</span></div>
                <div class="stat-label">Avg cycle length</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${stats.avgPeriod || '—'} <span class="stat-unit">days</span></div>
                <div class="stat-label">Avg period length</div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="period-section">
          <h4>⚙️ Settings</h4>
          <div class="settings-grid">
            <div>
              <label>Expected cycle length</label>
              <input type="number" min="20" max="45" id="setting-cycle" value="${settings.avgCycleLength}" />
            </div>
            <div>
              <label>Expected period length</label>
              <input type="number" min="2" max="10" id="setting-period" value="${settings.avgPeriodLength}" />
            </div>
          </div>
          <button class="btn" id="save-settings" style="margin-top:10px">Save Settings</button>
        </div>
      </div>
    </div>
  `;
}

function renderSymptomRow(field, label, options, current) {
  return `
    <div class="symptom-row">
      <div class="symptom-label">${label}</div>
      <div class="symptom-options">
        ${options.map(opt => `
          <button class="symptom-opt ${current === opt ? 'active' : ''}" data-symptom-field="${field}" data-symptom-value="${opt}">
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderRatingRow(field, label, current) {
  return `
    <div class="symptom-row">
      <div class="symptom-label">${label}</div>
      <div class="symptom-options">
        ${[1,2,3,4,5].map(n => `
          <button class="symptom-opt rating ${current === n ? 'active' : ''}" data-symptom-field="${field}" data-symptom-value="${n}">
            ${n}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderMiniCalendar() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const days = [];
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    days.push({ date: d, key });
  }

  const periodDays = getPeriodDaySet();

  const info = getCyclePhase();
  const predictedDays = new Set();
  if (info.nextDate) {
    for (let i = 0; i < (info.periodLen || 5); i++) {
      const d = new Date(info.nextDate);
      d.setDate(info.nextDate.getDate() + i);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      predictedDays.add(k);
    }
  }

  const todayKey = getTodayKey();
  return `
    <p class="cal-hint">Tap any day to mark or unmark your period 👇</p>
    <div class="mini-calendar">
      ${days.map(d => {
        const isPeriod = periodDays.has(d.key);
        const isPredicted = predictedDays.has(d.key);
        const isToday = d.key === todayKey;
        const cls = isPeriod ? 'period' : isPredicted ? 'predicted' : '';
        return `
          <div class="cal-day ${cls} ${isToday ? 'today' : ''} clickable" data-cal-date="${d.key}" title="${d.key}${isPeriod ? ' · Period (tap to remove)' : ' · Tap to mark period'}">
            ${d.date.getDate()}
          </div>
        `;
      }).join('')}
    </div>
    <div class="cal-legend">
      <span><span class="legend-dot period"></span> Logged period</span>
      <span><span class="legend-dot predicted"></span> Predicted</span>
      <span><span class="legend-dot today-dot"></span> Today</span>
    </div>
  `;
}

function attachPeriodHandlers() {
  document.getElementById('period-close').onclick = closePeriodModal;
  document.getElementById('period-modal').addEventListener('click', (e) => {
    if (e.target.id === 'period-modal') closePeriodModal();
  });

  const startBtn = document.getElementById('btn-period-start');
  if (startBtn) startBtn.onclick = logPeriodStart;
  const endBtn = document.getElementById('btn-period-end');
  if (endBtn) endBtn.onclick = logPeriodEnd;

  document.querySelectorAll('.symptom-opt').forEach(btn => {
    btn.onclick = () => {
      const field = btn.dataset.symptomField;
      let value = btn.dataset.symptomValue;
      if (btn.classList.contains('rating')) value = parseInt(value);
      const today = getTodayKey();
      if (state.period.symptoms[today] && state.period.symptoms[today][field] === value) {
        delete state.period.symptoms[today][field];
        saveState();
      } else {
        logSymptomToday(field, value);
      }
      refreshPeriodModal();
    };
  });

  const notes = document.getElementById('symptom-notes');
  if (notes) {
    notes.onblur = () => logSymptomToday('notes', notes.value);
  }

  document.querySelectorAll('.cal-day[data-cal-date]').forEach(cell => {
    cell.onclick = () => togglePeriodDay(cell.dataset.calDate);
  });

  const delBtn = document.getElementById('delete-last-cycle');
  if (delBtn) delBtn.onclick = deleteLastCycle;

  const saveBtn = document.getElementById('save-settings');
  if (saveBtn) saveBtn.onclick = () => {
    const cycle = parseInt(document.getElementById('setting-cycle').value);
    const period = parseInt(document.getElementById('setting-period').value);
    if (cycle >= 20 && cycle <= 45) state.period.settings.avgCycleLength = cycle;
    if (period >= 2 && period <= 10) state.period.settings.avgPeriodLength = period;
    saveState();
    showToast('Settings saved');
    refreshPeriodModal();
    render();
  };
}

// ============================================
// INIT
// ============================================
window.addEventListener('DOMContentLoaded', async () => {
  loadState();
  if (!state.selectedDay) state.selectedDay = getTodayName();
  render();
  setSyncStatus('unknown');

  // Try to connect to backend; if available, sync down latest state
  const available = await checkBackend();
  if (available) {
    await pullFromBackend();
    render();
  } else {
    setSyncStatus('local');
  }

  if (state.remindersEnabled && 'Notification' in window && Notification.permission === 'granted') {
    scheduleReminders();
  }
});
