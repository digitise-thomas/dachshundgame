# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TheoGame is a classic 2D HTML5 platformer. You play as a dachshund collecting hot dogs scattered across each level to earn enough points to unlock the doghouse (goal). Enemy dogs patrol platforms and bite back. Pits cost a life. 3 lives per run, 2 levels.

## Running the game

ES modules require a local HTTP server (`file://` won't work):

```bash
npx serve .
# or
python3 -m http.server
```

Then open `http://localhost:3000` (or whatever port the server reports).

## Architecture

All game logic lives in `js/`. Each file exports a single class:

| File | Role |
|------|------|
| `game.js` | Entry point. `STAGES` array defines per-level entity positions. `_loadStage(index)` rebuilds everything. `state` cycles `'playing'` → `'levelComplete'` → `'won'` → restart. |
| `player.js` | Player entity. AABB physics with tile collision, coyote time, jump buffering, variable jump height. `respawn()` resets to `spawnX/Y` and grants 1.5 s invincibility. |
| `level.js` | Exports `TILE_SIZE`, `LEVEL_CONFIGS` (array of tile data + display colours), and `Level`. Two levels built by `buildLevel1/2()`. Culled rendering. |
| `hotdog.js` | Falling hot-dog enemy. Spawns above screen, bounces on tiles, respawns after 5 bounces. Overlapping it triggers `player.respawn()`. |
| `dogfriend.js` | Checkpoint NPC. Touching one sets `player.spawnX/Y` to its position and triggers tail-wag animation. |
| `bone.js` | Win collectible at end of level. Bobs up and down. Collecting it sets `game.state = 'won'`. |
| `camera.js` | Follows the player, clamped to world bounds. Apply with `ctx.translate(-camera.x, -camera.y)`. |
| `input.js` | Keyboard state. `isHeld()` for continuous input, `isPressed()` for single-frame press. Call `input.flush()` at the end of every frame. |

### Game loop pattern

```
requestAnimationFrame → _loop(dt) → update(dt) → draw()
                                  ↘ input.flush()
```

`draw()` renders in two passes:
1. Background (screen space, before camera transform)
2. `ctx.save()` → `ctx.translate(-cam.x, -cam.y)` → world objects → `ctx.restore()`
3. HUD overlay (screen space, after restore)

### Physics

Player movement uses acceleration/friction rather than direct velocity assignment. Key constants are at the top of `player.js`. `_resolveX` and `_resolveY` are called separately (X first) to prevent corner-catching.

### Level layout

Tiles are defined programmatically in `buildTiles()` inside `level.js` using a `fill(row, colStart, colEnd)` helper. Platform rows from bottom to top: 10 (low), 8 (mid), 6 (high), 4 (highest). Ground is rows 12–13.
