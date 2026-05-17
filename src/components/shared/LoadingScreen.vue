<template>
  <Transition name="veil" @after-leave="$emit('done')">
    <div v-if="visible" class="veil">
      <!-- Animated gradient orbs -->
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />

      <!-- Subtle dot grid -->
      <div class="grid-dots" />

      <!-- Main panel -->
      <div class="panel">

        <!-- Brand header -->
        <div class="brand">
          <div class="logo-box">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" stroke-width="1.8"/>
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="2" y1="13" x2="22" y2="13" stroke="white" stroke-width="1.8"/>
            </svg>
          </div>
          <h2 class="brand-name">Hiring<span class="accent-text">Zone</span></h2>
          <span class="ver-badge">v1.0</span>
        </div>

        <!-- Headline -->
        <h1 class="headline">
          Where <span class="g-blue">Talent</span> Meets
          <span class="g-green">Opportunity</span>
        </h1>

        <!-- Description -->
        <p class="subhead">
          A multi-platform job portal connecting seekers, employers &amp; admins.<br/>
          Built with Vue&nbsp;3 · Spring Boot · PostgreSQL · Redis.
        </p>

        <!-- Three platform cards -->
        <div class="platforms">
          <div class="plat p-blue">
            <span class="p-icon">👤</span>
            <span class="p-title">Job Seekers</span>
            <span class="p-desc">Browse &amp; apply</span>
          </div>
          <div class="plat p-green">
            <span class="p-icon">🏢</span>
            <span class="p-title">Employers</span>
            <span class="p-desc">Post &amp; manage</span>
          </div>
          <div class="plat p-purple">
            <span class="p-icon">⚙️</span>
            <span class="p-title">Admin</span>
            <span class="p-desc">Oversee all</span>
          </div>
        </div>

        <!-- Rotating features -->
        <div class="feature-strip">
          <Transition name="ft" mode="out-in">
            <p :key="fi" class="feature-text">{{ features[fi] }}</p>
          </Transition>
        </div>

        <!-- Progress / loader section -->
        <div class="loader-box">
          <div class="status-row">
            <span class="bounce-dots">
              <span /><span /><span />
            </span>
            <Transition name="st" mode="out-in">
              <span :key="si" class="status-text">{{ statuses[si] }}</span>
            </Transition>
          </div>

          <div class="prog-track">
            <div class="prog-fill" :style="{ width: progress + '%' }">
              <div class="prog-tip" />
            </div>
          </div>

          <div class="info-row">
            <span class="hint-text">☕ Free tier · Server warming up (30–70s)</span>
            <span class="elapsed-text">{{ elapsed }}s</span>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits(['done'])

const visible = ref(true)
const progress = ref(0)
const elapsed  = ref(0)
const fi = ref(0)
const si = ref(0)

const features = [
  '🔍 Smart job search with filters & categories',
  '📊 Real-time application tracking dashboard',
  '🏢 Streamlined job posting for employers',
  '🔐 Secure JWT-based authentication system',
  '📱 Fully responsive mobile-first design',
  '⚡ Redis-powered lightning-fast search',
  '📋 Complete applicant management tools',
  '🌐 Role-based access across three platforms',
]

const statuses = [
  'Waking up the server... ☕',
  'Connecting to database... 🗄️',
  'Initializing services... ⚙️',
  'Loading job listings... 💼',
  'Preparing your experience... ✨',
  'Almost there... 🚀',
]

let elapsedTimer, featureTimer, pingInterval
let finished = false

function easeProgress(t) {
  return Math.min(94, 94 * (1 - Math.exp(-0.042 * t)))
}

function updateStatus(t) {
  if (t < 8)       si.value = 0
  else if (t < 20) si.value = 1
  else if (t < 34) si.value = 2
  else if (t < 52) si.value = 3
  else if (t < 70) si.value = 4
  else             si.value = 5
}

onMounted(() => {
  elapsedTimer = setInterval(() => {
    if (finished) return
    elapsed.value++
    progress.value = easeProgress(elapsed.value)
    updateStatus(elapsed.value)
  }, 1000)

  featureTimer = setInterval(() => {
    fi.value = (fi.value + 1) % features.length
  }, 3500)

  ping()
  pingInterval = setInterval(ping, 4000)
})

onUnmounted(() => {
  clearInterval(elapsedTimer)
  clearInterval(featureTimer)
  clearInterval(pingInterval)
})

async function ping() {
  if (finished) return
  try {
    const base = import.meta.env.VITE_API_URL || 'https://hiring-zone-backend.onrender.com/api'
    const res = await fetch(`${base}/stats/public`, { signal: AbortSignal.timeout(8000) })
    if (res.ok) finish()
  } catch {
    // server not ready yet — keep waiting
  }
}

function finish() {
  if (finished) return
  finished = true
  clearInterval(elapsedTimer)
  clearInterval(featureTimer)
  clearInterval(pingInterval)
  progress.value = 100
  setTimeout(() => { visible.value = false }, 700)
}
</script>

<style scoped>
/* ── Root overlay ─────────────────────────────────── */
.veil {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── Background orbs ──────────────────────────────── */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.orb-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle at center, rgba(59,130,246,.28) 0%, transparent 70%);
  top: -260px; left: -200px;
  animation: drift1 22s ease-in-out infinite;
}
.orb-2 {
  width: 560px; height: 560px;
  background: radial-gradient(circle at center, rgba(34,197,94,.22) 0%, transparent 70%);
  bottom: -160px; right: -160px;
  animation: drift2 28s ease-in-out infinite;
}
.orb-3 {
  width: 460px; height: 460px;
  background: radial-gradient(circle at center, rgba(217,70,239,.2) 0%, transparent 70%);
  bottom: 12%; left: 22%;
  animation: drift3 20s ease-in-out infinite;
}
@keyframes drift1 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%     { transform: translate(80px,100px) scale(1.15); }
  70%     { transform: translate(-50px,60px) scale(.9); }
}
@keyframes drift2 {
  0%,100% { transform: translate(0,0) scale(1); }
  35%     { transform: translate(-90px,-70px) scale(1.1); }
  65%     { transform: translate(50px,-40px) scale(.95); }
}
@keyframes drift3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(120px,-90px) scale(1.2); }
}

/* ── Dot grid ─────────────────────────────────────── */
.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.055) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

/* ── Main panel ───────────────────────────────────── */
.panel {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 540px;
  padding: 0 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* ── Brand ────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  animation: slideDown .65s cubic-bezier(.16,1,.3,1) both;
}
.logo-box {
  width: 50px; height: 50px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6 50%, #d946ef);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 26px rgba(59,130,246,.45), 0 0 60px rgba(217,70,239,.15);
}
.brand-name {
  font-size: 1.9rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -.04em;
  margin: 0;
}
.accent-text {
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #e879f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ver-badge {
  font-size: .68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #94a3b8;
  background: rgba(148,163,184,.1);
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 999px;
  padding: 2px 8px;
  align-self: flex-end;
  margin-bottom: 4px;
}

/* ── Headline ─────────────────────────────────────── */
.headline {
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.12;
  letter-spacing: -.04em;
  margin: 0;
  animation: slideUp .7s cubic-bezier(.16,1,.3,1) .1s both;
}
.g-blue {
  background: linear-gradient(120deg, #60a5fa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.g-green {
  background: linear-gradient(120deg, #4ade80, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Sub ──────────────────────────────────────────── */
.subhead {
  font-size: .875rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
  animation: slideUp .7s cubic-bezier(.16,1,.3,1) .2s both;
}

/* ── Platform cards ───────────────────────────────── */
.platforms {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .7rem;
  width: 100%;
  animation: slideUp .7s cubic-bezier(.16,1,.3,1) .3s both;
}
.plat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
  padding: 1rem .4rem .85rem;
  border-radius: 16px;
  border: 1px solid;
  cursor: default;
  transition: transform .25s ease, box-shadow .25s ease;
}
.plat:hover { transform: translateY(-3px); }
.p-blue {
  border-color: rgba(59,130,246,.3);
  background: rgba(59,130,246,.07);
}
.p-blue:hover  { box-shadow: 0 6px 24px rgba(59,130,246,.22); }
.p-green {
  border-color: rgba(34,197,94,.3);
  background: rgba(34,197,94,.07);
}
.p-green:hover { box-shadow: 0 6px 24px rgba(34,197,94,.22); }
.p-purple {
  border-color: rgba(217,70,239,.3);
  background: rgba(217,70,239,.07);
}
.p-purple:hover { box-shadow: 0 6px 24px rgba(217,70,239,.22); }
.p-icon  { font-size: 1.5rem; }
.p-title { font-size: .8rem; font-weight: 700; color: #e2e8f0; }
.p-desc  { font-size: .68rem; color: #475569; }

/* ── Feature strip ────────────────────────────────── */
.feature-strip {
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  animation: slideUp .7s cubic-bezier(.16,1,.3,1) .4s both;
}
.feature-text {
  font-size: .82rem;
  color: #94a3b8;
  margin: 0;
}

/* ── Loader box ───────────────────────────────────── */
.loader-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: .55rem;
  animation: slideUp .7s cubic-bezier(.16,1,.3,1) .5s both;
}
.status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
}

/* Bouncing coloured dots */
.bounce-dots { display: flex; gap: 4px; }
.bounce-dots span {
  width: 7px; height: 7px;
  border-radius: 50%;
  animation: bdot 1.3s ease-in-out infinite;
}
.bounce-dots span:nth-child(1) { background: #3b82f6; animation-delay: 0s; }
.bounce-dots span:nth-child(2) { background: #22c55e; animation-delay: .18s; }
.bounce-dots span:nth-child(3) { background: #d946ef; animation-delay: .36s; }
@keyframes bdot {
  0%,80%,100% { transform: translateY(0); opacity: .8; }
  40%          { transform: translateY(-6px); opacity: 1; }
}
.status-text { font-size: .82rem; color: #94a3b8; }

/* Progress bar */
.prog-track {
  width: 100%;
  height: 5px;
  background: rgba(255,255,255,.07);
  border-radius: 999px;
}
.prog-fill {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #d946ef);
  border-radius: 999px;
  transition: width .9s ease;
  overflow: visible;
}
.prog-fill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  background-size: 200% 100%;
  animation: shimmer 2.5s linear infinite;
  border-radius: 999px;
  overflow: hidden;
}
.prog-tip {
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translate(50%, -50%);
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #c4b5fd;
  box-shadow: 0 0 8px 3px rgba(139,92,246,.65), 0 0 18px 6px rgba(139,92,246,.2);
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* Info row */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hint-text    { font-size: .72rem; color: #334155; }
.elapsed-text { font-size: .72rem; color: #334155; font-variant-numeric: tabular-nums; }

/* ── Vue transitions ──────────────────────────────── */
.veil-enter-active  { transition: opacity .5s ease; }
.veil-leave-active  { transition: opacity 1s ease; }
.veil-enter-from,
.veil-leave-to      { opacity: 0; }

.ft-enter-active, .ft-leave-active { transition: all .45s ease; }
.ft-enter-from { opacity: 0; transform: translateY(10px); }
.ft-leave-to   { opacity: 0; transform: translateY(-10px); }

.st-enter-active, .st-leave-active { transition: all .3s ease; }
.st-enter-from { opacity: 0; transform: translateX(10px); }
.st-leave-to   { opacity: 0; transform: translateX(-10px); }

/* ── Keyframes ────────────────────────────────────── */
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Mobile ───────────────────────────────────────── */
@media (max-width: 400px) {
  .headline { font-size: 1.6rem; }
  .p-icon   { font-size: 1.2rem; }
  .p-title  { font-size: .72rem; }
  .p-desc   { display: none; }
  .subhead  { font-size: .8rem; }
}
</style>
