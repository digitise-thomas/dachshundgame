import { Input        } from './input.js';
import { Camera       } from './camera.js';
import { Level, LEVEL_CONFIGS } from './level.js';
import { Player       } from './player.js';
import { HotDog       } from './hotdog.js';
import { Enemy        } from './enemy.js';
import { Doghouse     } from './doghouse.js';
import { Hydrant      } from './hydrant.js';

const CANVAS_W = 800;
const CANVAS_H = 448;       // 14 tiles × 32 px
const GROUND_Y = 12 * 32;   // 384 — top of ground tiles

const DEATH_MSGS   = [
    'Napped too hard',
    'Got distracted by a squirrel',
    'Too many steps today',
    'Dreamed of hot dogs',
    'The mailman won this round',
    'Overslept, underperformed',
    'Tripped on own ears',
    'Chased tail instead of goal',
];

// ─── Stage definitions ───────────────────────────────────────────────────────

const STAGES = [
    {
        configIndex:     0,
        hotdogTiles: [
            [8,  12], [12, 10], [16,  8], [20, 10], [28, 12],
            [32,  8], [37, 10], [48,  8], [52, 10],
        ],
        requiredHotdogs: 6,
        hydrantTile: [23, 8],   // row-8 platform cols 22–26
        // enemies: [col, row, leftCol, rightCol, speed]
        enemies: [
            { col:  5, row: 12, leftCol:  2, rightCol: 12, speed: 60 },
            { col: 19, row: 10, leftCol: 18, rightCol: 21, speed: 80 },
            { col: 24, row: 12, leftCol: 20, rightCol: 28, speed: 70 },
            { col: 36, row: 10, leftCol: 34, rightCol: 37, speed: 90 },
            { col: 42, row: 12, leftCol: 36, rightCol: 44, speed: 75 },
        ],
        dogHouseCols: 56,
    },
    {
        configIndex:     1,
        hotdogTiles: [
            [6,  10], [11, 12], [15, 10], [20,  8], [23, 10],
            [32, 10], [38, 12], [40, 10], [48, 10], [56, 10],
        ],
        requiredHotdogs: 7,
        hydrantTile: [24, 6],   // row-6 platform cols 22–27
        enemies: [
            { col:  5, row: 12, leftCol:  1, rightCol: 10, speed:  70 },
            { col: 15, row: 10, leftCol: 13, rightCol: 16, speed: 100 },
            { col: 23, row: 10, leftCol: 21, rightCol: 24, speed:  90 },
            { col: 22, row: 12, leftCol: 18, rightCol: 27, speed:  80 },
            { col: 40, row: 10, leftCol: 38, rightCol: 41, speed:  95 },
            { col: 52, row: 12, leftCol: 50, rightCol: 58, speed:  85 },
        ],
        dogHouseCols: 57,
    },
    {
        configIndex:     2,
        hotdogTiles: [
            [5,  12], [18, 12], [30, 12], [44, 12], [56, 12],
            [6,  10], [25, 10], [47, 10],
            [9,   8], [17,  8], [32,  8],
            [26,  6], [38,  6],
        ],
        requiredHotdogs: 9,
        hydrantTile: [24, 8],   // row-8 platform cols 22–26
        enemies: [
            { col:  4, row: 12, leftCol:  0, rightCol:  9, speed:  85 },
            { col: 12, row: 10, leftCol: 11, rightCol: 14, speed: 110 },
            { col: 20, row: 12, leftCol: 14, rightCol: 22, speed:  95 },
            { col: 25, row: 10, leftCol: 24, rightCol: 27, speed: 125 },
            { col: 30, row: 12, leftCol: 27, rightCol: 36, speed:  90 },
            { col: 39, row: 10, leftCol: 38, rightCol: 41, speed: 105 },
            { col: 46, row: 12, leftCol: 41, rightCol: 50, speed: 100 },
            { col: 55, row: 12, leftCol: 54, rightCol: 59, speed: 115 },
        ],
        dogHouseCols: 57,
    },
    // ── Level 4 — Ice ────────────────────────────────────────────────────────
    {
        configIndex:     3,
        hotdogTiles: [
            [6,  12], [17, 12], [30, 12], [43, 12], [56, 12],
            [6,  10], [24, 10], [51, 10],
            [9,   8], [29,  8], [43,  8],
            [25,  6], [38,  6],
        ],
        requiredHotdogs: 9,
        hydrantTile: [29, 8],   // row-8 platform cols 28–31
        enemies: [
            { col:  4, row: 12, leftCol:  0, rightCol:  8, speed: 95  },
            { col: 12, row: 10, leftCol: 11, rightCol: 14, speed: 130 },
            { col: 19, row: 12, leftCol: 14, rightCol: 21, speed: 105 },
            { col: 24, row: 10, leftCol: 23, rightCol: 26, speed: 140 },
            { col: 30, row: 12, leftCol: 26, rightCol: 34, speed: 100 },
            { col: 37, row:  8, leftCol: 35, rightCol: 38, speed: 125 },
            { col: 44, row: 12, leftCol: 39, rightCol: 48, speed: 110 },
            { col: 51, row: 10, leftCol: 50, rightCol: 53, speed: 145 },
            { col: 56, row: 12, leftCol: 53, rightCol: 59, speed: 120 },
        ],
        dogHouseCols: 57,
    },
    // ── Level 5 — Night City ─────────────────────────────────────────────────
    {
        configIndex:     4,
        hotdogTiles: [
            [5,  12], [20, 12], [34, 12], [47, 12], [57, 12],
            [7,  10], [22, 10], [41, 10],
            [18,  8], [33,  8], [45,  8],
            [6,   6], [28,  6], [40,  6],
        ],
        requiredHotdogs: 10,
        hydrantTile: [18, 8],   // row-8 platform cols 17–20
        enemies: [
            { col:  5, row: 12, leftCol:  0, rightCol: 10, speed: 100 },
            { col: 13, row: 10, leftCol: 12, rightCol: 15, speed: 145 },
            { col: 18, row: 12, leftCol: 15, rightCol: 21, speed: 115 },
            { col: 22, row: 12, leftCol: 21, rightCol: 24, speed: 120 }, // split patrol
            { col: 27, row: 10, leftCol: 26, rightCol: 29, speed: 140 },
            { col: 34, row: 12, leftCol: 29, rightCol: 38, speed: 105 },
            { col: 41, row: 10, leftCol: 40, rightCol: 43, speed: 150 },
            { col: 47, row: 12, leftCol: 43, rightCol: 52, speed: 110 },
            { col: 57, row: 12, leftCol: 56, rightCol: 59, speed: 135 },
        ],
        dogHouseCols: 57,
    },
    // ── Level 6 — Volcanic ───────────────────────────────────────────────────
    {
        configIndex:     5,
        hotdogTiles: [
            [3,  12], [17, 12], [30, 12], [43, 12], [56, 12],
            [5,  10], [23, 10], [43, 10],
            [8,   8], [29,  8], [52,  8],
            [5,   6], [33,  6], [47,  6],
        ],
        requiredHotdogs: 11,
        hydrantTile: [30, 10],  // row-10 platform cols 29–32
        enemies: [
            { col:  3, row: 12, leftCol:  0, rightCol:  7, speed: 110 },
            { col: 11, row: 10, leftCol: 10, rightCol: 13, speed: 155 },
            { col: 15, row: 12, leftCol: 14, rightCol: 18, speed: 125 }, // split patrol
            { col: 19, row: 12, leftCol: 18, rightCol: 20, speed: 130 }, // split patrol
            { col: 23, row: 10, leftCol: 22, rightCol: 25, speed: 160 },
            { col: 30, row: 12, leftCol: 27, rightCol: 33, speed: 120 },
            { col: 36, row: 10, leftCol: 35, rightCol: 38, speed: 150 },
            { col: 43, row: 12, leftCol: 40, rightCol: 46, speed: 130 },
            { col: 49, row: 10, leftCol: 48, rightCol: 51, speed: 160 },
            { col: 56, row: 12, leftCol: 53, rightCol: 59, speed: 145 },
        ],
        dogHouseCols: 57,
    },
];

// ─── Game ────────────────────────────────────────────────────────────────────

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx    = this.canvas.getContext('2d');
        this.canvas.width  = CANVAS_W;
        this.canvas.height = CANVAS_H;

        this.input      = new Input();
        this.time       = 0;
        this._lastTime  = null;
        this._audioCtx  = null;

        this._highScore  = parseInt(localStorage.getItem('theoGame_hs') || '0');
        this._blinkTimer = 3;
        this._blinkOpen  = true;

        this.state = 'start';
        requestAnimationFrame(t => this._loop(t));
    }

    _loadStage(index) {
        this.stageIndex = index;
        const stage  = STAGES[index];
        const config = LEVEL_CONFIGS[stage.configIndex];

        this.level  = new Level(config);
        this.camera = new Camera(CANVAS_W, CANVAS_H);
        this.player = new Player(80, GROUND_Y - 28);

        this.hotdogs = stage.hotdogTiles.map(([col, row]) => new HotDog(col, row));

        this.enemies = stage.enemies.map(e =>
            new Enemy(e.col, e.row, e.leftCol, e.rightCol, e.speed)
        );

        this.doghouse = new Doghouse(
            stage.dogHouseCols * 32,
            GROUND_Y - 50,
            stage.requiredHotdogs
        );

        const [hc, hr] = stage.hydrantTile;
        this.hydrant = new Hydrant(hc, hr);

        this.state     = 'playing'; // 'playing' | 'levelComplete' | 'gameOver' | 'won'
        this._bgGrad   = this._makeBgGradient(config);
        this._config   = config;
        this._shake    = 0;
        this.particles = [];

        this._foodComaTimer = 0;
        this._foodComaUsed  = false;
        this._deathMsg      = DEATH_MSGS[0];

    }

    _makeBgGradient(config) {
        const g = this.ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        g.addColorStop(0,   config.bgTop);
        g.addColorStop(0.6, config.bgMid);
        g.addColorStop(1.0, config.bgBot);
        return g;
    }

    _loop(timestamp) {
        if (this._lastTime === null) this._lastTime = timestamp;
        const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05);
        this._lastTime = timestamp;
        this.time += dt;

        this.update(dt);
        this.draw();
        this.input.flush();

        requestAnimationFrame(t => this._loop(t));
    }

    _hotdogsCollected() {
        return this.hotdogs.filter(h => h.collected).length;
    }

    update(dt) {
        if (this.state === 'start') {
            // Blink animation
            this._blinkTimer -= dt;
            if (this._blinkTimer <= 0) {
                this._blinkOpen  = !this._blinkOpen;
                this._blinkTimer = this._blinkOpen ? 2 + Math.random() * 3 : 0.12;
            }
            if (this.input.isPressed('Space') || this.input.isPressed('Enter')) {
                this._loadStage(0);
            }
            return;
        }

        if (this.state === 'levelComplete') {
            if (this.input.isPressed('Space') || this.input.isPressed('Enter')) {
                this._loadStage(this.stageIndex + 1);
            }
            return;
        }

        if (this.state === 'gameOver' || this.state === 'won') {
            this._shake = Math.max(0, this._shake - dt);
            if (this.input.isPressed('Space') || this.input.isPressed('Enter')) {
                this.time = 0;
                this._loadStage(0);
            }
            return;
        }

        // ── Playing ──────────────────────────────────────────────
        this._shake = Math.max(0, this._shake - dt);
        if (this._foodComaTimer > 0) this._foodComaTimer = Math.max(0, this._foodComaTimer - dt);

        if (this.input.isPressed('KeyQ')) {
            this.player.woof();
            this._playSound('woof');
        }

        // Slow dt during food coma (player waddles in a satisfied stupor)
        const gameDt = this._foodComaTimer > 0 ? dt * 0.28 : dt;

        // Track lives before player update so pit falls trigger shake
        const livesBefore = this.player.lives;
        this.player.update(gameDt, this.input, this.level);
        if (this.player.lives < livesBefore) {
            this._shake = 0.4;
            this._deathMsg = DEATH_MSGS[Math.floor(Math.random() * DEATH_MSGS.length)];
        }

        if (this.player.lives <= 0) {
            this.state = 'gameOver';
            return;
        }

        this.camera.follow(this.player, this.level.width, this.level.height);

        // Update hotdogs (flee behaviour)
        const playerCx = this.player.x + this.player.width / 2;
        for (const hd of this.hotdogs) hd.update(dt, playerCx);

        // Collect hot dogs
        const collectedBefore = this._hotdogsCollected();
        const required        = STAGES[this.stageIndex].requiredHotdogs;
        for (const hd of this.hotdogs) {
            if (!hd.collected && hd.overlaps(this.player)) {
                hd.collect();
                this.player.chomp();
                this._spawnParticles(hd.x + hd.width / 2, hd.y + hd.height / 2, 'collect');
                this._shake = 0.12;
            }
        }

        // Food coma — triggers once when last required hotdog is eaten
        const collectedNow = this._hotdogsCollected();
        if (!this._foodComaUsed && collectedBefore < required && collectedNow >= required) {
            this._foodComaTimer = 2.2;
            this._foodComaUsed  = true;
        }

        // Enemy patrol + stomp / damage
        for (const en of this.enemies) {
            en.update(gameDt);
            if (en.overlaps(this.player)) {
                const playerBottom = this.player.y + this.player.height;
                const enemyMid     = en.y + en.height * 0.5;

                if (this.player.vy > 30 && playerBottom < enemyMid) {
                    // Stomp!
                    en.stun(2.5);
                    this.player.vy = -400;
                    this._spawnParticles(en.x + en.width / 2, en.y, 'stomp');
                } else if (this.player.invincible <= 0) {
                    this.player.loseLife();
                    this._shake = 0.4;
                    this._deathMsg = DEATH_MSGS[Math.floor(Math.random() * DEATH_MSGS.length)];
                    if (this.player.lives <= 0) {
                        this.state = 'gameOver';
                        return;
                    }
                }
            }
        }

        // Hydrant — extra life
        if (this.hydrant.overlaps(this.player)) {
            this.hydrant.collect();
            this.player.gainLife();
            this._spawnParticles(
                this.hydrant.x + this.hydrant.width / 2,
                this.hydrant.y,
                'collect'
            );
        }

        // Doghouse unlock & enter
        const collected = this._hotdogsCollected();
        this.doghouse.update(collected, dt);

        if (this.doghouse.overlaps(this.player)) {
            const isLast = this.stageIndex >= STAGES.length - 1;
            this.state = isLast ? 'won' : 'levelComplete';
            // Update high score
            const levelDone = this.stageIndex + 1;
            if (levelDone > this._highScore) {
                this._highScore = levelDone;
                localStorage.setItem('theoGame_hs', this._highScore);
            }
        }


        // Particle update
        for (const p of this.particles) {
            p.x    += p.vx * dt;
            p.y    += p.vy * dt;
            p.vy   += 300 * dt;  // gravity
            p.life -= dt;
        }
        this.particles = this.particles.filter(p => p.life > 0);
    }

    _spawnParticles(x, y, type = 'collect') {
        const palettes = {
            collect: ['#ffd700', '#ff9900', '#ff4040', '#ffcc00', '#ff6600'],
            stomp:   ['#ff4444', '#cc2020', '#ff6060', '#882200', '#ffaa00'],
        };
        const colors = palettes[type] || palettes.collect;
        for (let i = 0; i < 10; i++) {
            const angle   = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
            const speed   = 80 + Math.random() * 100;
            const maxLife = 0.4 + Math.random() * 0.3;
            this.particles.push({
                x, y,
                vx:      Math.cos(angle) * speed,
                vy:      Math.sin(angle) * speed - 80,
                life:    maxLife,
                maxLife,
                color:   colors[Math.floor(Math.random() * colors.length)],
                size:    Math.floor(2 + Math.random() * 4),
            });
        }
    }

    draw() {
        const { ctx } = this;

        if (this.state === 'start') {
            this._drawStartScreen();
            return;
        }

        ctx.fillStyle = this._bgGrad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Parallax background (screen space, scrolls with camera)
        this._drawParallax();

        // Screen shake transform
        ctx.save();
        if (this._shake > 0) {
            const mag = this._shake * 7;
            ctx.translate(
                (Math.random() * 2 - 1) * mag,
                (Math.random() * 2 - 1) * mag * 0.5
            );
        }

        ctx.save();
        ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

        this.level.draw(ctx, this.camera);
        this.doghouse.draw(ctx, this.time);
        this.hydrant.draw(ctx, this.time);
        for (const hd of this.hotdogs) hd.draw(ctx, this.time);
        for (const en of this.enemies) en.draw(ctx, this.time);
        this.player.draw(ctx);

        // Particles (world space)
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle   = p.color;
            ctx.fillRect(Math.round(p.x - p.size / 2), Math.round(p.y - p.size / 2), p.size, p.size);
        }
        ctx.globalAlpha = 1;

        ctx.restore();

        // HUD / overlays (screen space, inside shake transform)
        switch (this.state) {
            case 'playing':       this._drawHud();           break;
            case 'levelComplete': this._drawLevelComplete(); break;
            case 'gameOver':      this._drawGameOver();      break;
            case 'won':           this._drawWon();           break;
        }

        ctx.restore(); // shake
    }

    _drawParallax() {
        const { ctx, camera } = this;
        const layers = this._config.parallaxLayers;
        if (!layers) return;

        for (const layer of layers) {
            const scrollX = camera.x * layer.factor;
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(-2, CANVAS_H);
            for (let px = -2; px <= CANVAS_W + 2; px += 3) {
                const py = layer.baseY + Math.sin((px + scrollX) * layer.freq) * layer.amp;
                ctx.lineTo(px, py);
            }
            ctx.lineTo(CANVAS_W + 2, CANVAS_H);
            ctx.closePath();
            ctx.fill();
        }
    }

    _drawHud() {
        const { ctx } = this;
        const collected = this._hotdogsCollected();
        const required  = STAGES[this.stageIndex].requiredHotdogs;

        // Lives as tiny dachshunds
        const lifeCount = Math.max(3, this.player.lives);
        for (let i = 0; i < lifeCount; i++) {
            this._drawTinyDachshund(ctx, 10 + i * 20, 8, i < this.player.lives);
        }

        // Fullness % counter
        const pct   = Math.min(100, Math.round(collected / required * 100));
        const label = collected >= required ? 'Full! \uD83C\uDF2D' : `${pct}% full \uD83C\uDF2D`;
        ctx.fillStyle = collected >= required ? '#ffd700' : '#ffffff';
        ctx.font = '13px monospace';
        ctx.fillText(label, 10 + lifeCount * 20 + 6, 22);

        // Level label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '11px monospace';
        ctx.fillText(`Level ${this.stageIndex + 1}`, CANVAS_W - 68, 18);
        if (this._highScore > 0) {
            ctx.fillText(`Best: Lv.${this._highScore}`, CANVAS_W - 72, 32);
        }
        ctx.fillText('WASD / Arrows   Space/W/\u2191 jump   Q Woof', 10, CANVAS_H - 8);

        // Food coma overlay
        if (this._foodComaTimer > 0) {
            const a = Math.min(1, this._foodComaTimer);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle = '#ffee44';
            ctx.font = 'bold 26px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Food Coma...  \uD83D\uDE34', CANVAS_W / 2, CANVAS_H / 2 - 60);
            ctx.textAlign = 'left';
            ctx.restore();
        }
    }

    _drawOverlay(lines) {
        const { ctx } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.textAlign = 'center';
        for (const { text, size, color, y } of lines) {
            ctx.fillStyle = color;
            ctx.font = `bold ${size}px monospace`;
            ctx.fillText(text, CANVAS_W / 2, y);
        }
        ctx.textAlign = 'left';
    }

    _drawLevelComplete() {
        const nextLevel = this.stageIndex + 2;
        this._drawOverlay([
            { text: 'Level Complete!',                   size: 38, color: '#ffd700', y: CANVAS_H / 2 - 28 },
            { text: `Press Space for Level ${nextLevel}`, size: 18, color: '#ffffff', y: CANVAS_H / 2 + 16 },
        ]);
    }

    _drawStartScreen() {
        const { ctx } = this;

        // Sky gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        grad.addColorStop(0,   '#87ceeb');
        grad.addColorStop(0.7, '#d4f0fc');
        grad.addColorStop(1.0, '#8BC34A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Ground strip
        ctx.fillStyle = '#5a9e2f';
        ctx.fillRect(0, CANVAS_H - 60, CANVAS_W, 60);
        ctx.fillStyle = '#7bc142';
        ctx.fillRect(0, CANVAS_H - 60, CANVAS_W, 8);

        // Draw large dachshund eating a hotdog, centred
        ctx.textAlign = 'center';
        const cx = CANVAS_W / 2;
        const cy = CANVAS_H / 2;
        const sc = 3.5;   // scale relative to player sprite (48×28 at 1×)

        ctx.save();
        ctx.translate(cx - 84 * sc / 2, cy - 28 * sc / 2);
        ctx.scale(sc, sc);
        this._drawStartDachshund(ctx, this._blinkOpen);
        ctx.restore();

        // "Press Space to start" — pulsing
        const pulse = 0.7 + 0.3 * Math.sin(this.time * 4);
        ctx.globalAlpha = pulse;
        ctx.fillStyle   = '#ffffff';
        ctx.font        = 'bold 20px monospace';
        ctx.fillText('Press Space to start', CANVAS_W / 2, CANVAS_H - 28);
        ctx.globalAlpha = 1;
        ctx.textAlign   = 'left';
    }

    /** Large dachshund sprite with mouth open eating a hotdog. Origin at top-left of hitbox. */
    _drawStartDachshund(ctx, eyeOpen = true) {
        // Body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 10, 46, 16);
        ctx.fillStyle = '#6B3010';
        ctx.fillRect(0, 10, 46, 5);
        ctx.fillStyle = '#C8784A';
        ctx.fillRect(4, 18, 38, 8);

        // Head
        ctx.fillStyle = '#9A4820';
        ctx.fillRect(32, 2, 18, 18);

        // Snout (open — jaw dropped)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(46, 9, 14, 6);   // upper jaw
        ctx.fillRect(46, 17, 14, 5);  // lower jaw (gap in between = open mouth)
        // Pink mouth interior
        ctx.fillStyle = '#e05050';
        ctx.fillRect(47, 15, 13, 3);
        // Tongue
        ctx.fillStyle = '#e87070';
        ctx.fillRect(50, 17, 7, 4);

        // Nose
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(57, 10, 5, 5);

        // Ear
        ctx.fillStyle = '#5C2200';
        ctx.fillRect(32, 0, 10, 16);

        // Eye (blinks)
        if (eyeOpen) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(42, 3, 7, 6);
            ctx.fillStyle = '#1a0800';
            ctx.fillRect(44, 4, 4, 4);
            ctx.fillStyle = '#fff';
            ctx.fillRect(44, 4, 2, 2);
        } else {
            ctx.fillStyle = '#5C2200';
            ctx.fillRect(41, 6, 8, 2);
        }

        // Legs (mid-stride)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(33, 22 - 2, 5, 10);
        ctx.fillRect(40, 22 + 2, 5, 10);
        ctx.fillRect(4,  22 + 2, 5, 10);
        ctx.fillRect(11, 22 - 2, 5, 10);
        ctx.fillStyle = '#5C2200';
        ctx.fillRect(33, 26 - 2, 5, 4);
        ctx.fillRect(40, 26 + 2, 5, 4);
        ctx.fillRect(4,  26 + 2, 5, 4);
        ctx.fillRect(11, 26 - 2, 5, 4);

        // Tail (wagging up)
        ctx.fillStyle = '#6B3010';
        ctx.fillRect(-6, 11, 7, 4);
        ctx.fillRect(-6,  5, 5, 7);

        // Hotdog in front of mouth (at snout tip)
        // Bun
        ctx.fillStyle = '#d4a055';
        ctx.fillRect(60, 8, 22, 14);
        ctx.fillStyle = '#e8b870';
        ctx.fillRect(60, 8, 22, 4);
        // Sausage
        ctx.fillStyle = '#b03020';
        ctx.fillRect(60, 12, 22, 6);
        ctx.fillStyle = '#c84030';
        ctx.fillRect(60, 12, 22, 2);
        // Mustard squiggle
        ctx.fillStyle = '#f5c518';
        ctx.fillRect(62, 14, 3, 2);
        ctx.fillRect(67, 13, 3, 2);
        ctx.fillRect(72, 14, 3, 2);
        ctx.fillRect(77, 13, 3, 2);
    }

    _playSound(type) {
        if (!this._audioCtx) {
            this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ac  = this._audioCtx;
        const now = ac.currentTime;

        if (type === 'woof') {
            // Noise burst — the "w" attack consonant
            const bufLen = Math.floor(ac.sampleRate * 0.08);
            const buf    = ac.createBuffer(1, bufLen, ac.sampleRate);
            const data   = buf.getChannelData(0);
            for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
            const noise  = ac.createBufferSource();
            noise.buffer = buf;
            const bpf    = ac.createBiquadFilter();
            bpf.type = 'bandpass'; bpf.frequency.value = 650; bpf.Q.value = 1.2;
            const ng = ac.createGain();
            ng.gain.setValueAtTime(0.55, now);
            ng.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            noise.connect(bpf); bpf.connect(ng); ng.connect(ac.destination);
            noise.start(now); noise.stop(now + 0.08);

            // Tonal "oof" — triangle wave drops from ~540 Hz to ~210 Hz
            const osc1  = ac.createOscillator();
            const gain1 = ac.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(540, now);
            osc1.frequency.linearRampToValueAtTime(570, now + 0.025);
            osc1.frequency.exponentialRampToValueAtTime(210, now + 0.23);
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.65, now + 0.022);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc1.connect(gain1); gain1.connect(ac.destination);
            osc1.start(now); osc1.stop(now + 0.26);

            // Sub harmonic — adds chest/growl body
            const osc2  = ac.createOscillator();
            const gain2 = ac.createGain();
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(270, now);
            osc2.frequency.exponentialRampToValueAtTime(105, now + 0.23);
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.22, now + 0.022);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc2.connect(gain2); gain2.connect(ac.destination);
            osc2.start(now); osc2.stop(now + 0.23);
        }
    }

    /** Tiny dachshund silhouette for the lives HUD. */
    _drawTinyDachshund(ctx, x, y, alive) {
        ctx.fillStyle = alive ? '#8B4513' : '#3a3a3a';
        ctx.fillRect(x,      y + 3, 14, 5);   // body
        ctx.fillRect(x + 10, y,     5,  6);   // head
        ctx.fillRect(x + 14, y + 2, 3,  3);   // snout
        ctx.fillRect(x + 2,  y + 7, 2,  4);   // front leg
        ctx.fillRect(x + 8,  y + 7, 2,  4);   // back leg
        ctx.fillStyle = alive ? '#5C2200' : '#2a2a2a';
        ctx.fillRect(x - 1,  y + 3, 2,  2);   // tail stub
        ctx.fillRect(x + 9,  y - 1, 3,  4);   // ear
    }

    /** Dead dachshund — drawn upside-down via ctx.rotate(Math.PI) in caller. */
    _drawDeadDachshund(ctx) {
        // Standard body (will appear upside-down = on its back)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 10, 46, 16);
        ctx.fillStyle = '#6B3010';
        ctx.fillRect(0, 10, 46, 5);
        ctx.fillStyle = '#C8784A';
        ctx.fillRect(4, 18, 38, 8);

        ctx.fillStyle = '#9A4820';
        ctx.fillRect(32, 2, 18, 18);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(46, 9, 14, 9);
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(57, 10, 5, 5);
        ctx.fillStyle = '#5C2200';
        ctx.fillRect(32, 0, 10, 16);

        // X eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(42, 3, 7, 7);
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(43, 4, 2, 2); ctx.fillRect(47, 4, 2, 2);
        ctx.fillRect(44, 5, 3, 2);
        ctx.fillRect(43, 7, 2, 2); ctx.fillRect(47, 7, 2, 2);

        // Tongue flopped out
        ctx.fillStyle = '#e87070';
        ctx.fillRect(53, 17, 8, 7);
        ctx.fillRect(51, 21, 11, 4);

        // Legs pointing up (when rotated π they stick into the air)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(4,  22, 5, 14);
        ctx.fillRect(12, 22, 5, 16);
        ctx.fillRect(26, 22, 5, 14);
        ctx.fillRect(34, 22, 5, 16);
        ctx.fillStyle = '#5C2200';
        ctx.fillRect(4,  34, 5, 4);
        ctx.fillRect(12, 36, 5, 4);
        ctx.fillRect(26, 34, 5, 4);
        ctx.fillRect(34, 36, 5, 4);

        ctx.fillStyle = '#6B3010';
        ctx.fillRect(-6, 11, 7, 4);
        ctx.fillRect(-4,  7, 5, 5);
    }

    _drawGameOver() {
        const { ctx } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Dead dachshund — upside down with X eyes and tongue out
        const sc = 2.8;
        const cx = CANVAS_W / 2;
        ctx.save();
        ctx.translate(cx, CANVAS_H / 2 - 100);
        ctx.rotate(Math.PI);
        ctx.scale(sc, sc);
        ctx.translate(-24, -14);
        this._drawDeadDachshund(ctx);
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#e84040';
        ctx.font = 'bold 42px monospace';
        ctx.fillText('Game Over', cx, CANVAS_H / 2 - 10);

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '15px monospace';
        ctx.fillText(this._deathMsg, cx, CANVAS_H / 2 + 20);

        ctx.fillStyle = '#666666';
        ctx.font = '13px monospace';
        ctx.fillText('Press Space to try again', cx, CANVAS_H / 2 + 50);

        if (this._highScore > 0) {
            ctx.fillStyle = '#ffd700';
            ctx.font = '12px monospace';
            ctx.fillText(`Best: Level ${this._highScore}`, cx, CANVAS_H / 2 + 74);
        }
        ctx.textAlign = 'left';
    }

    _drawWon() {
        this._drawOverlay([
            { text: 'You made it home!',          size: 36, color: '#ffd700', y: CANVAS_H / 2 - 36 },
            { text: 'Safe and full of hot dogs',  size: 18, color: '#ffffff', y: CANVAS_H / 2 + 8  },
            { text: 'Press Space to play again',  size: 14, color: '#888888', y: CANVAS_H / 2 + 44 },
        ]);
        if (this._highScore >= STAGES.length) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = '12px monospace';
            this.ctx.fillText('All levels conquered!', CANVAS_W / 2, CANVAS_H / 2 + 70);
            this.ctx.textAlign = 'left';
        }
    }
}

window.addEventListener('load', () => new Game());
