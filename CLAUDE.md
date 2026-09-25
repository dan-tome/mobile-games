# games-platform

Solo mobile games side business. Goal: a reusable platform for quickly shipping hybrid-casual puzzle games, validated through publisher CPI tests (Voodoo, CrazyLabs, Kwalee, Homa) and web portals (CrazyGames, Poki).

Full market research, with benchmarks, publisher KPIs and genre rationale: `docs/market-research.md`. Read it before any product or design decision.

## Strategy (decided)
- First game type: a deterministic, grid-based sort/logic puzzle (Pixel Flow / Arrows / Color Block Jam style) with one novel rule.
- Levels are procedurally generated and verified by a solver. Hand-crafting content is not an option.
- Monetisation: hybrid. Rewarded ads, interstitials, a fail offer (continue), remove-ads, and lives.
- Publisher gates to aim for: D1 >= 40%, D7 >= 15%, D0 playtime >= 15 min, CPI <= $0.30-0.40.

## Stack
- Unity 6 LTS, 2D URP, C#
- .NET 8 for the standalone level engine
- NUnit for tests
- Git + Git LFS; CI via GitHub Actions + GameCI (later)
- SDKs (added in later phases, behind interfaces): AppLovin MAX, Unity IAP, GameAnalytics, Firebase Remote Config, publisher SDKs (TinySauce / CLIK / etc.)

## Repo layout
```
/LevelEngine            .NET solution, pure C#, NO Unity references
  /LevelEngine.Core     rules model, generator, solver, difficulty grader
  /LevelEngine.Tests    NUnit
  /LevelEngine.Cli      batch-generate graded levels -> JSON
/Packages/com.daniel.core   Unity UPM package shared by every game
/Games/<Name>           one Unity project per game, imports core by path/git URL
```

## Architecture rules
- LevelEngine must compile and test with `dotnet test` without Unity. Unity consumes it as a DLL or as source.
- Levels are data (JSON). The game never hardcodes a level.
- Every third-party SDK sits behind an interface in core: IAdsService, IPurchaseService, IAnalyticsService, ISaveService, IRemoteConfig. Each publisher SDK is one adapter class. Swapping publishers must be config only.
- Game flow is an explicit state machine: Boot -> Menu -> Level -> Win/Fail -> Offer.
- Use VContainer for dependency injection. Avoid singletons and static state.
- Anything tunable (ad frequency, lives, difficulty curve, offer price) comes from remote config with local defaults.
- Analytics events: level_start, level_complete, level_fail (with level_id, attempt, duration). Publishers judge on these.
- The GDPR consent flow and the iOS tracking (ATT) prompt are handled once in core.
- Build targets: Android (.aab), iOS, WebGL.

## Phases
Follow `docs/roadmap.md`. It has gates, and a phase doesn't start until the previous gate passes.
0. Foundations: `docs/game-design.md` must be filled in before engine code.  <- CURRENT
1. LevelEngine: solver, generator, grader, CLI, tests.
2. Ugly playable prototype, with the publisher test SDK and analytics events.
3. Ad creatives and CPI tests.
4. Monetisation (only for a game that passed Phase 3).
5. Extract the platform into com.daniel.core (rule of two: only what a second game needs).

Don't build platform abstractions ahead of a validated game. Push back if asked to.

## Working style
- Plan before any structural change; wait for approval.
- Be direct and concise. No over-explaining.
- Write tests for engine logic. Keep functions small and deterministic (seeded RNG).
- I open Unity myself to play and build. Tell me exactly what to do in the editor when it's needed.
