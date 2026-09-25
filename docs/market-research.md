# Market Research: Best Mobile Game Genres for a Solo Developer (Sept 2026)

Your best bet is a **hybrid-casual logic/sort puzzle**: deterministic, grid-based, with procedurally generated levels that a solver checks, sold through ads plus "fail offers." It is the only segment where 2025–26 data shows strong engagement, fast revenue growth, heavy publisher demand *and* a scope one engineer can handle. Your distributed-systems skills fit it well, because level generation and solving are an algorithms problem, not an art problem.

## TL;DR
- **Build first:** a 2D deterministic sort/logic puzzle with a new constraint twist (the Pixel Flow / Arrows / Color Block Jam lineage), using generated and solver-checked levels. AppMagic's H1 2026 Casual Games Report says sort puzzle IAP revenue grew 229% YoY (downloads +56%). The top hybrid-casual puzzles are the only new casual games breaking into the grossing charts.
- **Avoid:** match-3, merge-2, midcore survivors-likes and 4X on mobile F2P. These are content-heavy, live-ops-heavy markets where you have to win a UA spending war. In H1 2026 only 1 of 120 new match-3 games crossed $100K per month.
- **How to validate:** run one build down two paths. Send it to publisher CPI-test dashboards (Kwalee, CrazyLabs CLIK, Voodoo, Homa) and to Poki/CrazyGames. Kill it unless you see roughly D1 ≥35–40%, D7 ≥12–15% (Voodoo wants 20% D7 for puzzles), D0 playtime ≥15 min and CPI ≤$0.30–0.40. Expect to kill most prototypes: Voodoo launches about 0.4% of what it tests.

## 1. Engagement: what the benchmarks say

**All-genre baselines (GameAnalytics 2026 report, 2025 data, games ≥1,000 MAU):**

| Metric | Median | Top 1% |
|---|---|---|
| D1 retention | ~22% | 64–68% |
| D7 retention | just under 4% | — |
| D30 retention | ~0.7–0.8% | 13–15% |
| Daily playtime | ~12 min | >94 min |
| Session length | ~3.1–3.5 min | >22 min |
| Sessions/day | ~3.8 | 12+ |

The previous GameAnalytics report (2024 data) put the top-quartile D1 at 26–28% overall (31–33% on iOS) and top-quartile D7 at 7–8%. It also found 75% of games below 3% D28. Engagement is concentrated at the very top, so the median is not the target. Hitting publisher gates means being well inside the top quartile.

**Genre signals (directional; the 2026 GameAnalytics report dropped genre-level benchmarks):**
- **Arcade/hypercasual:** leads on D1 but decays fast.
- **Puzzle, board, card, casino:** best mid- and long-term retention.
- **Idle/AFK:** D7/D30 can match or beat RPGs.
- **Midcore:** most sessions per day, 6–7 (2024 data).
- **Top-25 casual by revenue:** D7 fell to 14.9% by December 2025. Top hybrid-casual titles have now overtaken them on D7 (Sensor Tower State of Gaming 2026).
- **Time spent:** simulation leads, puzzle is second, strategy third (Sensor Tower).

**Standout case:** at scale, Pixel Flow players spend close to **one hour per day across about 10 sessions** (Deconstructor of Fun, Feb 2026). Rollic says Color Block Jam has about 10% D90 retention.

**Takeaway:** deterministic hybrid-casual puzzles combine long-term retention with high session frequency. That is the engagement profile to target.

## 2. Monetisation and market momentum

- **Hybrid-casual** was the only mobile segment to grow IAP revenue in 2025: +20% to **$4.2B** (Sensor Tower). Lifestyle/puzzle hybrid-casual revenue splits roughly **59% IAP / 41% ads**.
- **Casual overall is flat:** about $11B in H1 2026. Puzzle took $4.9B of that (AppMagic).
- **Sort/Screw/Block** earned about **$600M IAP in H1 2026**. Sort: +229% revenue, +56% downloads, while new sort launches fell 23% to 840. Block: +46% revenue, but **2,000+ block puzzles launched in H1 2026 (+89%)**, so it is heavily saturated.
- **Top hybrid-casual puzzles by IAP to date:** Color Block Jam $148M, Screwdom $120M, Pixel Flow $105M (AppMagic, mid-2026).
- **Fail offers drive the money:** Pixel Flow's $5.99 fail offer is about **33% of IAP revenue and 34% of first purchases** (AppMagic). Limited lives plus a hard deterministic difficulty curve is the engine.
- **Pure ads can work at huge scale:** Block Blast has ~70M DAU / 300M MAU with almost no IAP (est. ~$17.5M/month Android ad revenue, third-party estimate). Arrows – Puzzle Escape, almost entirely ad-monetised, was the #1 downloaded mobile game in May 2026.
- **Merge-2** nearly doubled to $1.24B in H1 2026, but new hits come from incumbents (Century Games, Moon Active).
- **Match-3:** only 1 of 120 new titles crossed $100K/month in H1 2026.

**UA economics after ATT:**
- Liftoff (Feb 2024–Feb 2025): casual CPI **$1.41 iOS / $0.14 Android**; D30 ROAS 47% iOS / 15% Android.
- Android casual rewarded eCPM slid from $3.60 (H1 2023) to $3.02 (H1 2025).
- Pure hypercasual ad economics barely clear. Hybrid IAP layers (fail offers, remove-ads, passes) make paid UA work. Voodoo targets **≥150% ROAS**.

## 3. Solo feasibility by genre

| Genre | Engagement | Solo feasibility | Market/upside | Verdict |
|---|---|---|---|---|
| **Sort / logic puzzle (hybrid-casual)** | High | **High**: 2D/simple 3D, procedural + solver levels, light live-ops | Fastest-growing IAP subgenre; publishers signing | **#1** |
| **Minimalist logic (Arrows-style)** | High frequency, ad-heavy | **Very high**: one rule, clean UI, generated levels | #1 downloads May 2026; low ARPU; ideal for portals | **#2** |
| **Idle / incremental** | Strong D7/D30; long playtime | **High for an engineer**: progression maths, little art | SayGames core; premium Steam fallback | **#3** |
| **Block puzzle** | Huge DAU at the top | High | Extreme saturation | **#4, only with a real twist** |
| **Word / number puzzles** | Habitual, long tail | High | Stable niche; little growth data | Side bet |
| **Screw / wool puzzles** | Good | Medium: 3D physics/levels | Crowded | Maybe later |
| **Tile-match / Match 3D** | Good | Medium: many 3D assets | Fading | Skip |
| **Hybrid-casual arcade/runner** | High D1, weak long-term | High | Puzzles took over top revenue | Secondary |
| **Survivors-like (mobile F2P)** | High | **Low**: content, VFX, balance | Dominated by Habby-scale teams | Poor fit |
| **Merge-2** | Very high | **Low**: huge art + live-ops | Incumbents dominate | Poor fit |
| **Match-3** | Very high | **Low** | 1 of 120 new titles >$100K/mo | Avoid |

**Why sort/logic suits you:** deterministic puzzles need a level pipeline (generate, solve, grade difficulty, sequence). An engineer can automate that pipeline, while hand-crafted content is exactly what a solo developer can't scale.

## 4. Publisher demand and validation routes

**Publisher thresholds (mostly 2021–2023 figures; current terms negotiated privately):**
- **Voodoo:** hybrid-casual bar ≥45% D1, ≥15% D7 (**20% for puzzle**), ≥10% D30. Tests ~1,000 prototypes/year, launches ~0.4%. Targets ≥150% ROAS.
- **CrazyLabs (CLIK):** 2022 KPIs: idle CPI ≤$0.40, 40% D1, 60+ min playtime; other hypercasual CPI ≤$0.25, 35% D1. ~1 in 150–200 prototypes published. The 55% rev share was a contest prize, not standard.
- **Supersonic:** CPI <$0.30, D1 ~46%, D7 >12%, D0 playtime >900s. Now owned by Tripledot (Aug 2026).
- **Homa:** 50% rev share offered as a 2022 game-jam prize; standard terms not public.
- **TapNation:** paid-per-prototype (~$2–3.5K), monthly fees or burn-rate funding.
- **SayGames:** $30M committed to hybrid-casual studios (Nov 2024); wants deeper, more complete prototypes (Dec 2025).
- **Rollic:** scaling hybrid-casual logic games; 4 of top-10 hybrid-casual spots (Q3 2025).
- **Kwalee:** UK-based (Leamington Spa). CPI test needs 1–3 levels; ideal prototype ~15 min of gameplay, ~20 levels.

**What this means:** publishers are moving from shallow CPI tests to deeper hybrid-casual prototypes with a meta layer, and puzzle/logic is what they're signing. Negotiate revenue splits; don't expect published ones.

**Web portals:**
- **Poki:** 50/50 on web-exclusive deals, 100% on self-brought traffic; ~100M monthly players; top studios up to €1M/year.
- **CrazyGames:** 2026 jam terms: 60% of ad revenue, 70% of IAP; no exclusivity; 50M+ monthly players.
- A typical well-performing casual portal game earns roughly $200–2,000/month (secondary estimate).
- Portals are a cheap engagement test and a small income floor, not a path to scale on their own.

## 5. Solo and tiny-team evidence (2023–2026)

- **Pixel Flow (Loom Games):** launched Aug 2025 after ~3 months of dev; ~10 people at launch. ~$105M IAP in ~10 months. Scopely took a majority stake at a >$1B valuation. Founders had 5–6 years of prior experience.
- **Arrows – Puzzle Escape (Lessmore):** one-rule logic puzzle; 100M+ Play installs; #1 downloads May 2026; Miniclip's top US ad earner July 2026 ($6.6M). ~35 staff, no dedicated art team. Proves an art-light mechanic can top global charts.
- **Balatro (solo):** premium; >$9M mobile revenue by Jan 2025. Solo wins on mobile come as premium ports, not F2P.
- **Megabonk (solo, Unity):** survivors-like, 1M+ copies in two weeks, PC only.
- **Magic Research (solo, idle, premium):** ~$400K in 12 months with no paid promotion (self-reported, older).
- **Holger Sindbaek (solo, solitaire, web):** ~$25K/month from two browser card-game sites. Existing categories with built-in audiences work.

## Recommendations

**Ranked shortlist**
1. **Deterministic sort/logic puzzle, hybrid-casual.** Targets: CPI ≤$0.30–0.40 (US, Meta), D1 ≥40%, D7 ≥15–20%, D0 playtime ≥15 min. Scale: fail offers, remove-ads, piggy bank/pass, then publisher UA.
2. **Minimalist one-rule logic puzzle (Arrows-style), ads-first.** Fastest build; ideal for portals and mobile.
3. **Idle/incremental.** Suits an engineer; mobile, web and premium Steam fallback. CrazyLabs idle bar: D1 40%, 60+ min playtime.
4. **Block puzzle with a genuine twist**, only if the mechanic truly stands apart.
5. **Word/number puzzle** as a low-risk portfolio filler.

**First project (6–8 weeks, side-time):**
- **Core:** a 2D deterministic "extract/sort under constraint" puzzle: units leave the grid in dependency order into colour-matched slots with a strict capacity limit, plus one novel rule so it isn't a clone.
- **Weeks 1–2:** core loop + procedural generator and solver. Grade difficulty by solution depth and slot pressure; build a curve with deliberate near-fail spikes.
- **Week 3:** 20 levels, juice/haptics, 3–5 video ad creatives.
- **Week 4:** submit to Kwalee, CrazyLabs CLIK, Voodoo and Homa dashboards, and a web build to CrazyGames/Poki.
- **Weeks 5–8:** iterate only if D1 ≥35% and playtime ≥15 min. Then add lives and fail offers, remove-ads, light meta (collection/streaks).
- **Kill rule:** two failed iterations → next concept. Reuse the generator/solver and SDK stack as the portfolio platform.

**Path to continue:** build a reusable engine (generator, solver, difficulty tuning, ads/IAP/analytics SDKs), then a portfolio of variants on it. Negotiate or sell variants that clear publisher gates; keep and add live-ops to ones with strong organic or web traction.

## Caveats
- 2025–26 genre-level retention benchmarks aren't openly published; genre engagement claims are directional.
- AppMagic/Sensor Tower revenue figures are estimates. AppMagic excludes ad revenue. Block Blast and Arrows ad figures are third-party estimates.
- Publisher KPIs and revenue shares mostly date from 2021–2023 or contests.
- Portal earnings ranges come from secondary guides.
- Survivorship bias: cited hits are outliers.

Sources: GameAnalytics, Sensor Tower, AppMagic, Liftoff, Deconstructor of Fun, Mobilegamer.biz, PocketGamer.biz, Game World Observer, and publisher sites (Voodoo, CrazyLabs, Supersonic, Homa, TapNation, SayGames, Kwalee, Poki, CrazyGames). Compiled September 2026.
