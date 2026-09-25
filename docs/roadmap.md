# Roadmap

The principle: **validate a game before building a platform.** The research says most prototypes die, so the first goal is the cheapest possible answer to "is this mechanic fun and does it retain?" The platform is extracted from what survives. Rule of two: nothing moves into `com.daniel.core` until a second game needs it.

## Phase 0 — Foundations (week 1, almost no code)
- [ ] Play the reference games for 1–2 hours each: Pixel Flow, Arrows – Puzzle Escape, Color Block Jam, Screwdom, and one ball/water sort game. For each, note the core rule, where you fail, where offers appear, and what the first 10 levels teach.
- [ ] Fill in `docs/game-design.md`. **Gate:** the rules are precise enough that a solver can be specified.
- [ ] Build a 1–2 day throwaway greybox of the mechanic (hand-made levels, no engine). **Gate:** it's fun for 5 minutes on your phone. If not, change the rule, not the code.
- [ ] Pick an art direction: flat geometric, or a single asset pack with a £50–100 budget.
- [ ] Set up tooling: Unity Hub + Unity 6 LTS (Android/iOS/WebGL), .NET 8, the repo with LFS, a Mac for iOS, an Android test phone.
- [ ] Set up accounts: Google Play Console, Apple Developer, publisher dashboards (Kwalee, CrazyLabs CLIK, Voodoo, Homa), CrazyGames developer portal.
- [ ] Admin: a business email, a privacy policy page (stores and ad SDKs require one), and a note to register with HMRC for Self Assessment before revenue arrives.

## Phase 1 — Level engine (weeks 2–3)
- [ ] Rules model, solver, generator, difficulty grader and CLI in `/LevelEngine`, pure C#, with tests.
- **Gate:** the engine generates 200+ levels that are proven solvable, deterministic from a seed, and ordered on a sensible difficulty curve with deliberate near-fail spikes. Generating a level takes under a second.

## Phase 2 — Playable prototype (weeks 3–5)
- [ ] Minimal Unity game reading engine-generated JSON levels. Keep it ugly but responsive, with juice (DOTween, haptics).
- [ ] 20–30 levels plus the first-time tutorial.
- [ ] The publisher test SDK (e.g. TinySauce or CLIK) goes in **now**, because CPI tests require it. Add it behind a thin `IAnalyticsService` only; don't build the full service layer yet.
- [ ] Analytics events: `level_start`, `level_complete`, `level_fail` (level_id, attempt, duration).
- [ ] WebGL build for CrazyGames.
- **Gate:** 5+ people outside your head have played it; median session > 5 min; nothing confuses them in the first 3 levels.

## Phase 3 — Creatives and test (weeks 5–6)
- [ ] Record 3–5 ad videos of 15–30 seconds from gameplay. Hook in the first 3 seconds and show a satisfying near-fail. **The creatives decide your CPI as much as the game does.**
- [ ] Submit to 2–3 publisher dashboards plus CrazyGames.
- **Gate (decide on data):**

| Metric | Kill | Iterate | Push to publisher |
|---|---|---|---|
| CPI (US) | > $0.60 | $0.40–0.60 | ≤ $0.40 |
| D1 | < 30% | 30–40% | ≥ 40% |
| D0 playtime | < 10 min | 10–15 min | ≥ 15 min |

Maximum two iterations, then kill and move to concept #2 with the same engine.

## Phase 4 — Monetisation (only for a game that passed Phase 3)
- [ ] Lives, fail offer (continue), rewarded ads, interstitial cadence, remove-ads.
- [ ] Remote config for every tunable, and A/B tests.
- [ ] AppLovin MAX, Unity IAP, the GDPR consent flow and the iOS tracking prompt.
- [ ] Light meta layer (streaks/collection) to lift D7.

## Phase 5 — Platform extraction
- [ ] Move what game #1 proved reusable (services, state machine, save, level loader) into `Packages/com.daniel.core`.
- [ ] Build game #2 on it and measure how long it takes to reach a testable build. **Target: under 2 weeks.**

## Top risks
1. **The mechanic isn't fun or new enough.** Mitigation: the Phase 0 greybox gate, and killing fast.
2. **Over-engineering (the most likely one for you).** Mitigation: rule of two, no platform before a validated game.
3. **Weak ad creatives inflate CPI.** Mitigation: treat creatives as a deliverable, not an afterthought.
4. **Side-project time.** Mitigation: fixed weekly hours and a phase deadline. Slipping 2x means cutting scope, not extending.
5. **Unity learning curve** if you're new to it. Mitigation: Phase 0 greybox doubles as a Unity crash course.

## Open decisions
- [ ] Weekly hours available:
- [ ] Unity/C# experience level:
- [ ] Mac available for iOS builds? (If not, launch Android + web first.)
- [ ] Budget ceiling for Phase 0–3 (accounts, assets, optional self-run CPI tests):
- [ ] The core rule and the novel twist (see game-design.md)
