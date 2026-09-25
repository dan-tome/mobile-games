# Game Design One-Pager: Prototype01

Fill this in before any engine code. If a section can't be answered precisely, the design isn't ready.

## Pitch
One sentence a stranger understands from a 3-second ad:

**Red + blue = purple: tap arrows to free the colours, mix them in the tray, and fill every order before the tray overflows.**

## Reference games and what we take/avoid
| Game | Take | Avoid |
|---|---|---|
| Pixel Flow | One small holding area as the only source of pressure. "Hard level" labels. "+slots" fail offer. | Pixel-art image pipeline. Conveyor timing. |
| Arrows – Puzzle Escape | Tap-to-exit directional rule. Readable with no tutorial. Cheap art. Generated levels. | Ads-only monetisation (low ARPU). Losing a heart on a blocked tap (ours are free). |
| Color Block Jam | Colour-to-destination matching. Juicy clears. | Drag input. Timer pressure. 3D block assets. |

To refine after the Phase 0 play sessions.

## The novel twist
**Colour mixing in the tray.** The board holds only primaries (red, yellow, blue), while orders can ask for secondaries (purple, orange, green). When a primary lands on a different primary in the tray, the two mix. None of the references change a unit's identity after it leaves the board.

New decisions it creates:
- **Pairing:** which primaries meet, and when. Releasing red while a lone yellow waits in a full tray forces orange.
- **Sequencing against orders:** keep a primary waiting for its partner, or send it straight to a primary order.
- **Trap mixes:** a wrong mix wastes two units and eventually fails the level. That is the near-fail moment for the ad.

## Rules (precise enough to code a solver)
- **Board:** a rectangular grid, 4x4 to 8x10. Each cell is `empty`, `unit` or `wall`.
- **Units:** a colour in {R, Y, B} and an arrow in {up, down, left, right}. Each takes 1 cell. No unit may point straight at a wall with nothing between them. The initial blocking graph must be acyclic, so some unit is always free.
- **Tray:** `C` slots (3–7). A slot is empty or holds one item. An item is a primary or a secondary. Mixing: R+B=P, R+Y=O, B+Y=G. Secondaries never mix again.
- **Orders:** a fixed queue of `(colour, count)`, with count 2–4 and colour any of the 6. The first `A` orders (1–3) are active, and the next one is shown as a preview.
- **Player action:** tap only.
- **Legal move:** tap a unit whose path to the board edge in its arrow direction is fully empty (no units or walls). The unit leaves the board and is placed. Tapping a blocked unit is a no-op (it shakes) and doesn't count as a move.
- **Placement** of an exiting primary `p` uses the first rule that applies:
  1. An active order wants `p` → deliver it there.
  2. The tray has a primary `q ≠ p`, and `mix(p,q)` is wanted by an active order → merge them (leftmost such slot) and deliver the secondary.
  3. The tray has an empty slot → put `p` in the leftmost empty slot.
  4. The tray has a primary `q ≠ p` → **forced mix** in the leftmost such slot. The secondary stays in the tray.
  5. Otherwise → **overflow fail**.
- **Settle** (after every placement, repeat until nothing changes):
  - A filled order leaves, and the next queued order takes its position.
  - For each active order, from left to right: first pull matching items from the tray; then, if its colour is a secondary, merge the leftmost pair of tray primaries that mixes to it and deliver the result.
- **Constraint (the pressure):** tray capacity `C`, combined with dependency order on the board.
- **Win condition:** the order queue is empty. Level data guarantees supply equals demand exactly, so the board and tray are empty too.
- **Fail condition:** either
  - overflow (placement rule 5), or
  - **dead inventory** after settle: for some primary `p`, the `p` still available (on the board and unmixed in the tray) no longer equals the `p` still needed (open orders for `p`, plus secondaries containing `p` not yet made). A wasted mix trips this immediately rather than letting the player flail.
- **Fully deterministic?** Yes. There's no runtime randomness, the order queue is part of the level data, and every tie-break is leftmost-first.

**Solver state:** remaining units (a bitmask), the tray as a sorted multiset (slot position is cosmetic), the order-queue index and fill counts. The branching factor is the number of free units.

## Difficulty levers
- **Unit count and grid size** (12 at the start, 60+ late).
- **Tray capacity `C`:** 7 → 3.
- **Active orders `A`:** 3 → 1. Fewer visible orders means less flexibility.
- **Mix ratio:** the share of orders that are secondaries (0% → 70%).
- **Dependency depth:** the longest blocker chain on the board.
- **Free units per step:** the average branching. More looks easier but hides more traps.
- **Trap ratio:** the share of legal moves that lead to unwinnable states. This is the main one the grader measures.
- **Minimum slack:** the fewest free tray slots along the best solution. Slack 0 means a near-fail spike.
- **Walls** (from level 12).
- **Colour-order mismatch:** how far apart on the board the two halves of a needed secondary sit.

## Level curve (first 30 levels)
- **How features are taught:** a level that introduces a feature opens with a short looping demo built from real tiles and one sentence of text. It shows once and can be replayed.
- **Levels 1–3, tutorial:**
  - L1 teaches tap to exit and that a blocked unit shakes (red only, 1 order).
  - L2 teaches the tray: blocks the active order doesn't want wait there (red + blue, primary orders only).
  - L3 teaches mixing: red + blue = purple, one purple order. This is the only recipe the game explains.
- **Levels 4–10:**
  - Yellow arrives at L4 with orange and green orders but no explanation. Working out red + yellow = orange and blue + yellow = green is part of the challenge. There is no recipe key on screen. A caption names the mix after it happens.
  - L5 is the first level with all three secondaries.
  - `C` drops 7 → 5.
  - The first possible forced mix comes at L7.
  - L10 is the first labelled **Hard** level (slack 0, trap ratio ≈ 30%).
- **Near-fail spike levels:** 10, 20 and 30 are labelled Hard. 15 and 25 are medium spikes. Every spike is followed by 1–2 easy relief levels.
- **Levels 11–30 pattern:** a sawtooth (3–4 rising levels, spike, relief). New elements:
  - walls at L12,
  - `A`=1 at L17,
  - `C`=4 at L22.
  - Each new element first appears in a relief level.

## Fail moment and offer
Both fails have the same cause, a full tray, so the player sees one fail screen. Dead inventory only ever follows a forced mix (placement rule 4), which only happens when the tray is full.

**What the player sees:**
- **Overflow:** the unit bounces off the full tray, the tray flashes red, and the screen shows **"Tray full! So close: N blocks left"**.
- **Forced mix:** the same screen, plus the unwanted mix shown pulsing as `a + b = c`.

**The continue offer:** **+2 tray slots** for this attempt. The failing tap is rewound and replayed, so with the free slots it can neither overflow nor force a mix.

In Phase 2 the offer is free, just to measure how often it's taken. It is priced in Phase 4 (rewarded ad, or coins, with the price from remote config).

## Session shape
- **Level length:** 40–70 s for normal levels, 2–3 min for Hard levels.
- **Levels per session:** 6–10.
- This puts D0 ≥ 15 min at about 15 levels over 2–3 sessions.

## Art direction
- **Style:** flat geometric. Units are rounded squares carrying an arrow glyph.
- **Palette:** saturated primaries on a dark navy background. Tiles carry colour only, with no shapes (decided after the first playtest). Purple is a dark purple (#6a1b9a) because the original light purple was almost identical to blue for deuteranopes (CIELAB ΔE 4, now 30). Text naming purple uses a light tint (#c9a0ff) for contrast.
- **Colour-blind support:** otherwise deferred. Yellow/orange is now the closest pair for red-green colour-blind players (ΔE 13 for deuteranopia). Revisit before Phase 3, for example as an optional setting.
- **Asset source:** built in-engine (sprites), plus one free font and at most one UI pack (≤ £50).

## Ad creative concepts (3)
1. **"Can you make purple?"** A close-up of red flying into a slot holding blue, a purple splash, and an order filling. Ends on a tray with one slot left.
2. **Fail bait.** The player releases yellow next to a lone red, a forced orange clogs the tray, and it overflows. Text: "Only 2% avoid this mistake."
3. **Cascade clear.** In the last 5 taps, an order arrives and the tray settles in a chain of merges and deliveries until the board is empty.

## Success metrics
See roadmap Phase 3 gate.

## Open questions for the greybox
- Is auto-placement (rules 1–4) readable, or do players need to pick a tray slot? Picking a slot would add a second input, so try to avoid it.
- Does "dead inventory" failing early feel fair, or should the player be allowed to play on to overflow?
- Should the ~12 units on L1 be even fewer?
