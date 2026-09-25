// Checks every greybox level: solvable, best-play slack, sampled trap ratio.
// Usage: node Greybox/solve.mjs
import { LEVELS } from './levels.js';
import { parseLevel, initialState, isFree, tap, freeSlots } from './rules.js';

const key = (s) =>
  s.alive.map(Number).join('') +
  '|' + s.tray.map((q) => q || '.').join('') +
  '|' + s.active.map((o) => (o ? `${o.i}:${o.filled}` : '-')).join(',') +
  '|' + s.next;

// Seeded RNG so sampled numbers are stable between runs.
function rng(seed) {
  return () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
}

export function analyse(level) {
  const t0 = performance.now();
  let nodes = 0;
  // dead[k] = keys proven to have no solution keeping >= k free slots.
  const dead = [];

  function solvable(s, k) {
    const key0 = key(s);
    const memo = (dead[k] ??= new Set());
    if (memo.has(key0)) return false;
    nodes++;
    for (let u = 0; u < level.units.length; u++) {
      if (!isFree(level, s, u)) continue;
      const r = tap(level, s, u);
      if (r.result === 'win') return true;
      if (r.result === 'ok' && freeSlots(r.state) >= k && solvable(r.state, k)) return true;
    }
    memo.add(key0);
    return false;
  }

  const s0 = initialState(level);
  let slack = -1;
  for (let k = level.capacity; k >= 0; k--) {
    if (solvable(s0, k)) {
      slack = k;
      break;
    }
  }

  // Trap ratio: along random playouts, the share of legal moves from a winnable state that make it unwinnable.
  const rand = rng(42);
  let legal = 0;
  let traps = 0;
  let firstLegal = 0;
  let firstTraps = 0;
  for (let run = 0; run < 60 && slack >= 0; run++) {
    let s = s0;
    for (let depth = 0; ; depth++) {
      const good = [];
      let moves = 0;
      for (let u = 0; u < level.units.length; u++) {
        if (!isFree(level, s, u)) continue;
        moves++;
        const r = tap(level, s, u);
        if (r.result === 'win' || (r.result === 'ok' && solvable(r.state, 0))) good.push(r);
      }
      legal += moves;
      traps += moves - good.length;
      if (depth === 0 && run === 0) {
        firstLegal = moves;
        firstTraps = moves - good.length;
      }
      const r = good[Math.floor(rand() * good.length)];
      if (!r || r.result === 'win') break;
      s = r.state;
    }
  }
  return {
    units: level.units.length,
    solvable: slack >= 0,
    slack,
    trapPct: legal ? Math.round((100 * traps) / legal) : 0,
    firstTraps: `${firstTraps}/${firstLegal}`,
    nodes,
    ms: Math.round(performance.now() - t0),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) main();

function main() {
let failed = false;
const rows = LEVELS.map((def) => {
  try {
    const level = parseLevel(def);
    const a = analyse(level);
    if (!a.solvable) failed = true;
    return { level: def.name + (def.hard ? ' (Hard)' : ''), C: def.capacity, A: def.active, ...a };
  } catch (e) {
    failed = true;
    return { level: def.name, error: e.message };
  }
});
console.table(rows);
process.exit(failed ? 1 : 0);
}
