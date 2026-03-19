export const TILE_SIZE = 32;

const ROWS = 14;
const COLS = 60;

function emptyGrid() {
    return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function fill(t, row, c0, c1) {
    for (let c = c0; c <= c1; c++) t[row][c] = 1;
}

// ─── Level 1 — grassy meadow ────────────────────────────────────────────────

function buildLevel1() {
    const t = emptyGrid();
    const ground = (c0, c1) => { fill(t, 12, c0, c1); fill(t, 13, c0, c1); };

    ground(0,  14);  // pit 1: cols 15–17
    ground(18, 30);  // pit 2: cols 31–33
    ground(34, 46);  // pit 3: cols 47–49
    ground(50, 59);

    // Row 10 — low platforms
    fill(t, 10,  2,  6);  fill(t, 10, 10, 14);
    fill(t, 10, 18, 22);  fill(t, 10, 26, 30);
    fill(t, 10, 34, 38);  fill(t, 10, 42, 46);
    fill(t, 10, 50, 54);

    // Row 8 — mid platforms (each bridges a pit)
    fill(t, 8,  6, 10);  fill(t, 8, 14, 18);
    fill(t, 8, 22, 26);  fill(t, 8, 30, 34);
    fill(t, 8, 38, 42);  fill(t, 8, 46, 50);

    // Row 6 — higher
    fill(t, 6, 10, 15);  fill(t, 6, 26, 31);  fill(t, 6, 42, 47);

    // Row 4 — highest
    fill(t, 4, 18, 23);  fill(t, 4, 34, 39);  fill(t, 4, 50, 55);

    return t;
}

// ─── Level 2 — stone cavern (wider pits, tougher layout) ────────────────────

function buildLevel2() {
    const t = emptyGrid();
    const ground = (c0, c1) => { fill(t, 12, c0, c1); fill(t, 13, c0, c1); };

    ground(0,  11);  // pit 1: cols 12–16 (5 tiles — wider)
    ground(17, 28);  // pit 2: cols 29–34 (6 tiles — very wide)
    ground(35, 44);  // pit 3: cols 45–49 (5 tiles)
    ground(50, 59);

    // Row 10 — low platforms (mandatory bridges over wider pits)
    fill(t, 10,  4,  8);  fill(t, 10, 13, 17);
    fill(t, 10, 21, 25);  fill(t, 10, 30, 34);
    fill(t, 10, 38, 42);  fill(t, 10, 46, 50);
    fill(t, 10, 54, 58);

    // Row 8 — mid platforms
    fill(t, 8,  9, 13);  fill(t, 8, 18, 22);
    fill(t, 8, 26, 31);  fill(t, 8, 36, 40);
    fill(t, 8, 43, 47);  fill(t, 8, 51, 55);

    // Row 6 — higher
    fill(t, 6,  5, 10);  fill(t, 6, 22, 27);
    fill(t, 6, 40, 45);  fill(t, 6, 55, 59);

    // Row 4 — high
    fill(t, 4, 14, 19);  fill(t, 4, 30, 36);  fill(t, 4, 50, 55);

    // Row 2 — challenge platforms near ceiling
    fill(t, 2, 22, 28);  fill(t, 2, 40, 46);

    return t;
}

// ─── Level 3 — sunset desert (4 pits, fast enemies) ─────────────────────────

function buildLevel3() {
    const t = emptyGrid();
    const ground = (c0, c1) => { fill(t, 12, c0, c1); fill(t, 13, c0, c1); };

    ground(0,   9);  // pit: 10–13
    ground(14, 22);  // pit: 23–26
    ground(27, 36);  // pit: 37–40
    ground(41, 50);  // pit: 51–53
    ground(54, 59);

    // Row 10 — step stones
    fill(t, 10,  4,  8);  fill(t, 10, 11, 14);
    fill(t, 10, 18, 22);  fill(t, 10, 24, 27);
    fill(t, 10, 31, 35);  fill(t, 10, 38, 41);
    fill(t, 10, 45, 49);  fill(t, 10, 52, 56);

    // Row 8 — mid platforms
    fill(t, 8,  7, 11);  fill(t, 8, 15, 19);
    fill(t, 8, 22, 26);  fill(t, 8, 29, 33);
    fill(t, 8, 37, 41);  fill(t, 8, 43, 47);
    fill(t, 8, 51, 55);

    // Row 6
    fill(t, 6,  3,  7);  fill(t, 6, 12, 16);
    fill(t, 6, 24, 28);  fill(t, 6, 36, 40);
    fill(t, 6, 48, 52);

    // Row 4
    fill(t, 4,  8, 12);  fill(t, 4, 20, 24);
    fill(t, 4, 32, 36);  fill(t, 4, 44, 48);

    // Row 2 — ceiling challenge
    fill(t, 2, 14, 18);  fill(t, 2, 28, 32);  fill(t, 2, 40, 44);

    return t;
}

// ─── Level 4 — ice cavern (narrow platforms, 4 wide pits) ───────────────────

function buildLevel4() {
    const t = emptyGrid();
    const ground = (c0, c1) => { fill(t, 12, c0, c1); fill(t, 13, c0, c1); };

    ground(0,   8);  // pit: 9–13
    ground(14, 21);  // pit: 22–25
    ground(26, 34);  // pit: 35–38
    ground(39, 48);  // pit: 49–52
    ground(53, 59);

    // Row 10 — narrow bridges
    fill(t, 10,  5,  8);  fill(t, 10, 11, 14);
    fill(t, 10, 18, 21);  fill(t, 10, 23, 26);
    fill(t, 10, 30, 33);  fill(t, 10, 36, 39);
    fill(t, 10, 43, 46);  fill(t, 10, 50, 53);
    fill(t, 10, 56, 59);

    // Row 8
    fill(t, 8,  8, 11);  fill(t, 8, 15, 18);
    fill(t, 8, 22, 25);  fill(t, 8, 28, 31);
    fill(t, 8, 35, 38);  fill(t, 8, 42, 45);
    fill(t, 8, 48, 51);

    // Row 6
    fill(t, 6,  4,  7);  fill(t, 6, 13, 16);
    fill(t, 6, 24, 27);  fill(t, 6, 37, 40);
    fill(t, 6, 50, 53);

    // Row 4
    fill(t, 4,  9, 12);  fill(t, 4, 21, 24);
    fill(t, 4, 33, 36);  fill(t, 4, 46, 49);

    // Row 2 — ceiling challenge
    fill(t, 2, 16, 19);  fill(t, 2, 29, 32);  fill(t, 2, 43, 46);

    return t;
}

// ─── Level 5 — night city (dense enemies, split patrols) ─────────────────────

function buildLevel5() {
    const t = emptyGrid();
    const ground = (c0, c1) => { fill(t, 12, c0, c1); fill(t, 13, c0, c1); };

    ground(0,  10);  // pit: 11–14
    ground(15, 24);  // pit: 25–28
    ground(29, 38);  // pit: 39–42
    ground(43, 52);  // pit: 53–55
    ground(56, 59);

    // Row 10
    fill(t, 10,  5,  9);  fill(t, 10, 12, 15);
    fill(t, 10, 20, 23);  fill(t, 10, 26, 29);
    fill(t, 10, 33, 36);  fill(t, 10, 40, 43);
    fill(t, 10, 48, 51);  fill(t, 10, 54, 57);

    // Row 8
    fill(t, 8,  8, 12);  fill(t, 8, 17, 20);
    fill(t, 8, 24, 27);  fill(t, 8, 31, 34);
    fill(t, 8, 37, 40);  fill(t, 8, 44, 47);
    fill(t, 8, 51, 54);

    // Row 6
    fill(t, 6,  4,  8);  fill(t, 6, 15, 18);
    fill(t, 6, 27, 30);  fill(t, 6, 39, 42);
    fill(t, 6, 51, 55);

    // Row 4
    fill(t, 4, 10, 14);  fill(t, 4, 22, 25);
    fill(t, 4, 34, 37);  fill(t, 4, 47, 50);

    // Row 2
    fill(t, 2, 19, 23);  fill(t, 2, 31, 35);  fill(t, 2, 44, 48);

    return t;
}

// ─── Level 6 — volcanic (6-tile pits, 10 enemies, brutal) ────────────────────

function buildLevel6() {
    const t = emptyGrid();
    const ground = (c0, c1) => { fill(t, 12, c0, c1); fill(t, 13, c0, c1); };

    ground(0,   7);  // pit: 8–13  (6 tiles)
    ground(14, 20);  // pit: 21–26 (6 tiles)
    ground(27, 33);  // pit: 34–39 (6 tiles)
    ground(40, 46);  // pit: 47–52 (6 tiles)
    ground(53, 59);

    // Row 10 — small stepping stones
    fill(t, 10,  4,  7);  fill(t, 10, 10, 13);
    fill(t, 10, 17, 20);  fill(t, 10, 22, 25);
    fill(t, 10, 29, 32);  fill(t, 10, 35, 38);
    fill(t, 10, 42, 45);  fill(t, 10, 48, 51);
    fill(t, 10, 55, 58);

    // Row 8
    fill(t, 8,  7, 10);  fill(t, 8, 14, 17);
    fill(t, 8, 21, 24);  fill(t, 8, 28, 31);
    fill(t, 8, 36, 39);  fill(t, 8, 43, 46);
    fill(t, 8, 51, 54);

    // Row 6
    fill(t, 6,  4,  7);  fill(t, 6, 17, 20);
    fill(t, 6, 32, 35);  fill(t, 6, 46, 49);

    // Row 4
    fill(t, 4,  9, 12);  fill(t, 4, 23, 26);
    fill(t, 4, 37, 40);  fill(t, 4, 52, 55);

    // Row 2
    fill(t, 2, 14, 17);  fill(t, 2, 29, 32);  fill(t, 2, 44, 47);

    return t;
}

// ─── Exported configs (index matches stage number) ──────────────────────────

export const LEVEL_CONFIGS = [
    {
        tiles:     buildLevel1(),
        tileColor: '#4a7c59',
        topColor:  '#6eb57a',
        bgTop:     '#1a1a4e',
        bgMid:     '#2d5a8e',
        bgBot:     '#3d7a6e',
        parallaxLayers: [
            { factor: 0.12, baseY: 290, amp: 55, freq: 0.005, color: '#0a1a10' },
            { factor: 0.28, baseY: 325, amp: 38, freq: 0.009, color: '#102a18' },
        ],
    },
    {
        tiles:     buildLevel2(),
        tileColor: '#5c4070',
        topColor:  '#8a65aa',
        bgTop:     '#0d0a1a',
        bgMid:     '#1a1040',
        bgBot:     '#2a1a50',
        parallaxLayers: [
            { factor: 0.12, baseY: 295, amp: 65, freq: 0.006, color: '#08040f' },
            { factor: 0.28, baseY: 330, amp: 48, freq: 0.010, color: '#100818' },
        ],
    },
    {
        tiles:     buildLevel3(),
        tileColor: '#8a5030',
        topColor:  '#c07040',
        bgTop:     '#1a0800',
        bgMid:     '#7a2010',
        bgBot:     '#c05020',
        parallaxLayers: [
            { factor: 0.12, baseY: 285, amp: 60, freq: 0.007, color: '#200800' },
            { factor: 0.28, baseY: 320, amp: 44, freq: 0.011, color: '#301004' },
        ],
    },
    {
        tiles:     buildLevel4(),
        tileColor: '#5090b0',
        topColor:  '#90d0f0',
        bgTop:     '#040810',
        bgMid:     '#081828',
        bgBot:     '#0c2840',
        parallaxLayers: [
            { factor: 0.12, baseY: 292, amp: 58, freq: 0.005, color: '#040e18' },
            { factor: 0.28, baseY: 326, amp: 42, freq: 0.009, color: '#081820' },
        ],
    },
    {
        tiles:     buildLevel5(),
        tileColor: '#2a2a3a',
        topColor:  '#5050a0',
        bgTop:     '#000008',
        bgMid:     '#060618',
        bgBot:     '#0e0e30',
        parallaxLayers: [
            { factor: 0.12, baseY: 280, amp: 70, freq: 0.006, color: '#06060e' },
            { factor: 0.28, baseY: 318, amp: 50, freq: 0.010, color: '#0a0a1a' },
        ],
    },
    {
        tiles:     buildLevel6(),
        tileColor: '#2a1008',
        topColor:  '#cc3300',
        bgTop:     '#100200',
        bgMid:     '#3a0800',
        bgBot:     '#7a1400',
        parallaxLayers: [
            { factor: 0.12, baseY: 288, amp: 65, freq: 0.006, color: '#180400' },
            { factor: 0.28, baseY: 322, amp: 48, freq: 0.010, color: '#220800' },
        ],
    },
];

// ─── Level class ─────────────────────────────────────────────────────────────

export class Level {
    constructor(config) {
        this._tiles    = config.tiles;
        this.tileColor = config.tileColor;
        this.topColor  = config.topColor;
        this.tileSize  = TILE_SIZE;
        this.rows      = ROWS;
        this.cols      = COLS;
        this.width     = COLS * TILE_SIZE;
        this.height    = ROWS * TILE_SIZE;
    }

    isSolid(col, row) {
        if (row >= this.rows) return false;          // open bottom — player falls through pits
        if (col < 0 || col >= this.cols || row < 0) return true;  // solid sides & ceiling
        return this._tiles[row][col] === 1;
    }

    draw(ctx, camera) {
        const ts = this.tileSize;
        const c0 = Math.max(0, Math.floor(camera.x / ts));
        const c1 = Math.min(this.cols - 1, Math.ceil((camera.x + camera.width)  / ts));
        const r0 = Math.max(0, Math.floor(camera.y / ts));
        const r1 = Math.min(this.rows - 1, Math.ceil((camera.y + camera.height) / ts));

        for (let r = r0; r <= r1; r++) {
            for (let c = c0; c <= c1; c++) {
                if (!this.isSolid(c, r)) continue;
                const x = c * ts;
                const y = r * ts;
                ctx.fillStyle = this.tileColor;
                ctx.fillRect(x, y, ts, ts);
                if (!this.isSolid(c, r - 1)) {
                    ctx.fillStyle = this.topColor;
                    ctx.fillRect(x, y, ts, 5);
                }
            }
        }
    }
}
