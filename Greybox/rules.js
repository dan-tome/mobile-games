// Prototype01 greybox rules. Implements docs/game-design.md "Rules" exactly.
// Throwaway: the real engine is LevelEngine (Phase 1).

export const PRIMARIES = ['R', 'Y', 'B'];
export const SECONDARIES = ['P', 'O', 'G'];
export const PARENTS = { P: ['R', 'B'], O: ['R', 'Y'], G: ['B', 'Y'] };
const DIRS = { '^': [0, -1], v: [0, 1], '<': [-1, 0], '>': [1, 0] };

const isPrimary = (c) => c === 'R' || c === 'Y' || c === 'B';

export function mix(a, b) {
  for (const s of SECONDARIES) {
    const [x, y] = PARENTS[s];
    if ((a === x && b === y) || (a === y && b === x)) return s;
  }
  return null;
}

// Level def: { name, hard, capacity, active, orders: "P2 R3 ...", board: ["R^ .. ##", ...] }
// Board tokens: ".." empty, "##" wall, colour + arrow (e.g. "B<").
export function parseLevel(def) {
  const rows = def.board.map((r) => r.trim().split(/\s+/));
  const h = rows.length;
  const w = rows[0].length;
  const units = [];
  const walls = new Set();
  rows.forEach((row, y) => {
    if (row.length !== w) throw new Error(`${def.name}: row ${y} has ${row.length} cells, expected ${w}`);
    row.forEach((tok, x) => {
      if (tok === '..') return;
      if (tok === '##') return void walls.add(y * w + x);
      const [c, d] = tok;
      if (!isPrimary(c) || !DIRS[d]) throw new Error(`${def.name}: bad token "${tok}" at ${x},${y}`);
      units.push({ x, y, c, d });
    });
  });

  const cell = new Map(units.map((u, i) => [u.y * w + u.x, i]));
  for (const u of units) {
    const [dx, dy] = DIRS[u.d];
    u.blockers = [];
    for (let x = u.x + dx, y = u.y + dy; x >= 0 && y >= 0 && x < w && y < h; x += dx, y += dy) {
      if (walls.has(y * w + x)) throw new Error(`${def.name}: unit at ${u.x},${u.y} points into a wall`);
      if (cell.has(y * w + x)) u.blockers.push(cell.get(y * w + x));
    }
  }

  const orders = def.orders.trim().split(/\s+/).map((t) => ({ c: t[0], n: Number(t.slice(1)) }));
  const level = { ...def, w, h, units, walls, orders };
  checkAcyclic(level);
  if (isDead(level, initialState(level))) throw new Error(`${def.name}: board supply does not match order demand`);
  return level;
}

function checkAcyclic(level) {
  const alive = level.units.map(() => true);
  let left = alive.length;
  for (let progress = true; progress; ) {
    progress = false;
    level.units.forEach((u, i) => {
      if (alive[i] && u.blockers.every((b) => !alive[b])) {
        alive[i] = false;
        left--;
        progress = true;
      }
    });
  }
  if (left) throw new Error(`${level.name}: blocking cycle, ${left} units can never leave`);
}

// State: alive[] per unit, tray[] (null | colour; length = capacity), active[] ({i, filled} | null), next order index.
export function initialState(level) {
  const s = {
    alive: level.units.map(() => true),
    tray: Array(level.capacity).fill(null),
    active: Array(level.active).fill(null),
    next: 0,
    moves: 0,
  };
  for (let k = 0; k < s.active.length && s.next < level.orders.length; k++) s.active[k] = { i: s.next++, filled: 0 };
  return s;
}

export function clone(s) {
  return {
    alive: s.alive.slice(),
    tray: s.tray.slice(),
    active: s.active.map((o) => (o ? { ...o } : null)),
    next: s.next,
    moves: s.moves,
  };
}

export const isFree = (level, s, u) => s.alive[u] && level.units[u].blockers.every((b) => !s.alive[b]);

function wantPos(level, s, colour) {
  return s.active.findIndex((o) => o && level.orders[o.i].c === colour && o.filled < level.orders[o.i].n);
}

// Placement rules 1-5 for an exiting primary p.
function place(level, s, p) {
  let k = wantPos(level, s, p);
  if (k >= 0) {
    s.active[k].filled++;
    return { kind: 'order', pos: k, colour: p };
  }
  for (let j = 0; j < s.tray.length; j++) {
    const q = s.tray[j];
    if (!q || !isPrimary(q) || q === p) continue;
    const m = mix(p, q);
    k = wantPos(level, s, m);
    if (k >= 0) {
      s.tray[j] = null;
      s.active[k].filled++;
      return { kind: 'mix', slot: j, pos: k, colour: m, partner: q };
    }
  }
  const j = s.tray.indexOf(null);
  if (j >= 0) {
    s.tray[j] = p;
    return { kind: 'slot', slot: j, colour: p };
  }
  const f = s.tray.findIndex((q) => q && isPrimary(q) && q !== p);
  if (f >= 0) {
    const q0 = s.tray[f];
    s.tray[f] = mix(p, q0);
    return { kind: 'forced', slot: f, colour: s.tray[f], partner: q0 };
  }
  return { kind: 'overflow' };
}

function settle(level, s, trace) {
  const events = [];
  for (let changed = true; changed; ) {
    changed = false;
    s.active.forEach((o, k) => {
      if (o && o.filled >= level.orders[o.i].n) {
        s.active[k] = s.next < level.orders.length ? { i: s.next++, filled: 0 } : null;
        events.push({ kind: 'orderDone', pos: k, state: trace && clone(s) });
        changed = true;
      }
    });
    s.active.forEach((o, k) => {
      if (!o) return;
      const { c, n } = level.orders[o.i];
      for (let j = 0; j < s.tray.length && o.filled < n; j++) {
        if (s.tray[j] === c) {
          s.tray[j] = null;
          o.filled++;
          events.push({ kind: 'pull', slot: j, pos: k, colour: c, state: trace && clone(s) });
          changed = true;
        }
      }
      if (isPrimary(c)) return;
      const [a, b] = PARENTS[c];
      while (o.filled < n) {
        const j1 = s.tray.findIndex((q) => q === a || q === b);
        if (j1 < 0) break;
        const other = s.tray[j1] === a ? b : a;
        const first = s.tray[j1];
        const j2 = s.tray.indexOf(other);
        if (j2 < 0) break;
        s.tray[j1] = s.tray[j2] = null;
        o.filled++;
        events.push({ kind: 'pairMix', slots: [j1, j2], parents: [first, other], pos: k, colour: c, state: trace && clone(s) });
        changed = true;
      }
    });
  }
  return events;
}

export const isWin = (level, s) => s.next >= level.orders.length && s.active.every((o) => !o);

// Dead inventory: remaining supply of some primary can no longer equal what remaining orders need.
export function isDead(level, s) {
  const demand = { R: 0, Y: 0, B: 0, P: 0, O: 0, G: 0 };
  for (const o of s.active) if (o) demand[level.orders[o.i].c] += level.orders[o.i].n - o.filled;
  for (let i = s.next; i < level.orders.length; i++) demand[level.orders[i].c] += level.orders[i].n;
  const have = { R: 0, Y: 0, B: 0, P: 0, O: 0, G: 0 };
  level.units.forEach((u, i) => s.alive[i] && have[u.c]++);
  for (const q of s.tray) if (q) have[q]++;
  const need = { R: demand.R, Y: demand.Y, B: demand.B };
  for (const sec of SECONDARIES) {
    const toMake = demand[sec] - have[sec];
    if (toMake < 0) return true;
    for (const p of PARENTS[sec]) need[p] += toMake;
  }
  return PRIMARIES.some((p) => have[p] !== need[p]);
}

// result: 'blocked' | 'ok' | 'overflow' | 'dead' | 'win'
// trace: also return a state snapshot after placement and after every settle event (for animation).
export function tap(level, s, u, trace = false) {
  if (!isFree(level, s, u)) return { state: s, result: 'blocked' };
  const n = clone(s);
  n.alive[u] = false;
  n.moves++;
  const placement = place(level, n, level.units[u].c);
  if (placement.kind === 'overflow') return { state: n, result: 'overflow', placement, events: [] };
  const afterPlace = trace && clone(n);
  const events = settle(level, n, trace);
  const result = isWin(level, n) ? 'win' : isDead(level, n) ? 'dead' : 'ok';
  return { state: n, result, placement, afterPlace, events };
}

export const freeSlots = (s) => s.tray.filter((q) => !q).length;
export const unitsLeft = (s) => s.alive.filter(Boolean).length;
