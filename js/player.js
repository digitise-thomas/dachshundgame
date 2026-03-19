import { TILE_SIZE } from './level.js';

// Physics constants
const GRAVITY       = 1400;
const EXTRA_GRAVITY = 2800;  // heavier gravity when ascending without holding jump
const JUMP_FORCE    =  -560;
const MAX_FALL      =   900;

const MOVE_SPEED   =   240;
const GROUND_ACCEL =  2000;
const AIR_ACCEL    =  1200;
const GROUND_FRIC  =  2400;
const AIR_FRIC     =   800;

const COYOTE_T   = 0.10;
const JUMP_BUF_T = 0.15;

const JUMP_KEYS  = ['Space', 'ArrowUp', 'KeyW'];
const LEFT_KEYS  = ['ArrowLeft', 'KeyA'];
const RIGHT_KEYS = ['ArrowRight', 'KeyD'];

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width  = 48;
        this.height = 28;

        this.vx = 0;
        this.vy = 0;

        this.onGround    = false;
        this.facingRight = true;
        this.invincible  = 0;

        this.coyoteTimer = 0;
        this.jumpBuffer  = 0;

        this.lives  = 3;
        this.spawnX = x;
        this.spawnY = y;

        this._walkTime   = 0;
        this._woofTimer  = 0;
        this._chompTimer = 0;
        this.justJumped  = false;
    }

    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
        this.x  = this.spawnX;
        this.y  = this.spawnY;
        this.vx = 0;
        this.vy = 0;
        this.invincible  = 1.5;
    }

    gainLife() {
        this.lives = Math.min(this.lives + 1, 5);
    }

    woof() {
        this._woofTimer = 2.0;
    }

    chomp() {
        this._chompTimer = 1.0;
    }

    update(dt, input, level) {
        this.justJumped = false;

        if (this.invincible  > 0) this.invincible  -= dt;
        if (this._woofTimer  > 0) this._woofTimer  -= dt;
        if (this._chompTimer > 0) this._chompTimer -= dt;

        const jumpHeld    = JUMP_KEYS .some(k => input.isHeld(k));
        const jumpPressed = JUMP_KEYS .some(k => input.isPressed(k));
        const moveLeft    = LEFT_KEYS .some(k => input.isHeld(k));
        const moveRight   = RIGHT_KEYS.some(k => input.isHeld(k));

        if (this.onGround) {
            this.coyoteTimer = COYOTE_T;
        } else {
            this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
        }

        if (jumpPressed) {
            this.jumpBuffer = JUMP_BUF_T;
        } else {
            this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
        }

        if (this.jumpBuffer > 0 && this.coyoteTimer > 0) {
            this.vy          = JUMP_FORCE;
            this.jumpBuffer  = 0;
            this.coyoteTimer = 0;
            this.justJumped  = true;
        }

        const grav = (this.vy < 0 && !jumpHeld) ? EXTRA_GRAVITY : GRAVITY;
        this.vy = Math.min(this.vy + grav * dt, MAX_FALL);

        const dir = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
        if (dir !== 0) this.facingRight = dir > 0;

        const accel = this.onGround ? GROUND_ACCEL : AIR_ACCEL;
        const fric  = this.onGround ? GROUND_FRIC  : AIR_FRIC;

        if (dir !== 0) {
            this.vx += dir * accel * dt;
            this.vx  = Math.sign(this.vx) * Math.min(Math.abs(this.vx), MOVE_SPEED);
        } else {
            const decel = fric * dt;
            if (Math.abs(this.vx) <= decel) {
                this.vx = 0;
            } else {
                this.vx -= Math.sign(this.vx) * decel;
            }
        }

        // Walk animation timer
        if (this.onGround && Math.abs(this.vx) > 10) {
            this._walkTime += dt;
        } else {
            this._walkTime = 0;
        }

        this.onGround = false;

        this.x += this.vx * dt;
        this._resolveX(level);

        this.y += this.vy * dt;
        this._resolveY(level);

        if (this.y > level.height + 200) this.loseLife();
    }

    _resolveX(level) {
        const ts     = TILE_SIZE;
        const left   = Math.floor(this.x / ts);
        const right  = Math.floor((this.x + this.width  - 1) / ts);
        const top    = Math.floor(this.y / ts);
        const bottom = Math.floor((this.y + this.height - 1) / ts);

        for (let row = top; row <= bottom; row++) {
            if (this.vx > 0 && level.isSolid(right, row)) {
                this.x  = right * ts - this.width;
                this.vx = 0;
                break;
            }
            if (this.vx < 0 && level.isSolid(left, row)) {
                this.x  = (left + 1) * ts;
                this.vx = 0;
                break;
            }
        }
    }

    _resolveY(level) {
        const ts     = TILE_SIZE;
        const left   = Math.floor(this.x / ts);
        const right  = Math.floor((this.x + this.width  - 1) / ts);
        const top    = Math.floor(this.y / ts);
        const bottom = Math.floor((this.y + this.height - 1) / ts);

        for (let col = left; col <= right; col++) {
            if (this.vy > 0 && level.isSolid(col, bottom)) {
                this.y        = bottom * ts - this.height;
                this.vy       = 0;
                this.onGround = true;
                break;
            }
            if (this.vy < 0 && level.isSolid(col, top)) {
                this.y  = (top + 1) * ts;
                this.vy = 0;
                break;
            }
        }
    }

    draw(ctx) {
        const showBody = !(this.invincible > 0 && Math.floor(this.invincible * 10) % 2 === 0);

        if (showBody) {
            ctx.save();
            ctx.translate(Math.round(this.x), Math.round(this.y));
            if (!this.facingRight) {
                ctx.translate(this.width, 0);
                ctx.scale(-1, 1);
            }
            this._drawBody(ctx, this._walkTime);
            ctx.restore();
        }

        if (this._woofTimer  > 0) this._drawWoofBubble(ctx);
        if (this._chompTimer > 0) this._drawChompBubble(ctx);
    }

    _drawWoofBubble(ctx) {
        const alpha = Math.min(1, this._woofTimer / 0.5);
        ctx.globalAlpha = alpha;

        const cx  = Math.round(this.x + this.width / 2);
        const bh  = 20;
        const bw  = 54;
        const bx  = cx - bw / 2;
        const by  = Math.round(this.y) - bh - 14;
        const tip = by + bh;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx, by, bw, bh);

        ctx.beginPath();
        ctx.moveTo(cx - 4, tip);
        ctx.lineTo(cx + 4, tip);
        ctx.lineTo(cx,     tip + 7);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#333333';
        ctx.lineWidth   = 1.5;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.beginPath();
        ctx.moveTo(cx - 4, tip);
        ctx.lineTo(cx,     tip + 7);
        ctx.lineTo(cx + 4, tip);
        ctx.stroke();

        ctx.fillStyle   = '#222222';
        ctx.font        = 'bold 12px monospace';
        ctx.textAlign   = 'center';
        ctx.fillText('Woof!', cx, by + 14);
        ctx.textAlign   = 'left';
        ctx.globalAlpha = 1;
    }

    _drawChompBubble(ctx) {
        const alpha = Math.min(1, this._chompTimer / 0.4);
        ctx.globalAlpha = alpha;

        // Appear near the mouth (front of the dog)
        const mouthX = this.facingRight
            ? Math.round(this.x + this.width + 8)
            : Math.round(this.x - 8);
        const by = Math.round(this.y);
        const bw = 70;
        const bh = 20;
        const bx = this.facingRight ? mouthX : mouthX - bw;
        const tipX = this.facingRight ? bx : bx + bw;

        ctx.fillStyle = '#fff9e0';
        ctx.fillRect(bx, by, bw, bh);

        // Tail pointing toward mouth
        ctx.beginPath();
        ctx.moveTo(tipX, by + 6);
        ctx.lineTo(tipX, by + 14);
        ctx.lineTo(tipX + (this.facingRight ? -8 : 8), by + 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#cc4400';
        ctx.lineWidth   = 1.5;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.fillStyle   = '#cc4400';
        ctx.font        = 'bold 13px monospace';
        ctx.textAlign   = 'center';
        ctx.fillText('CHOMP!', bx + bw / 2, by + 14);
        ctx.textAlign   = 'left';
        ctx.globalAlpha = 1;
    }

    /** Draws the dachshund facing right with origin at hitbox top-left. */
    _drawBody(ctx, walkTime = 0) {
        const legSwing = Math.sin(walkTime * 14) * 3;

        // Body (long sausage)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 10, 46, 16);

        // Darker top ridge
        ctx.fillStyle = '#6B3010';
        ctx.fillRect(0, 10, 46, 5);

        // Lighter belly
        ctx.fillStyle = '#C8784A';
        ctx.fillRect(4, 18, 38, 8);

        // Head (right side)
        ctx.fillStyle = '#9A4820';
        ctx.fillRect(32, 2, 18, 18);

        // Snout
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(46, 9, 14, 9);

        // Nose
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(57, 10, 5, 5);

        // Ear
        ctx.fillStyle = '#5C2200';
        ctx.fillRect(32, 0, 10, 16);

        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(42, 4, 6, 5);
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(44, 5, 4, 4);
        // Glint
        ctx.fillStyle = '#fff';
        ctx.fillRect(44, 5, 1, 1);

        // Four short legs (animated)
        const ly1 = Math.round(legSwing);
        const ly2 = Math.round(-legSwing);

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(33, 22 + ly1, 5, 10);
        ctx.fillRect(40, 22 + ly2, 5, 10);
        ctx.fillRect(4,  22 + ly2, 5, 10);
        ctx.fillRect(11, 22 + ly1, 5, 10);

        // Paws (darker tips)
        ctx.fillStyle = '#5C2200';
        ctx.fillRect(33, 28 + ly1, 5, 4);
        ctx.fillRect(40, 28 + ly2, 5, 4);
        ctx.fillRect(4,  28 + ly2, 5, 4);
        ctx.fillRect(11, 28 + ly1, 5, 4);

        // Tail (curled up at back/left)
        ctx.fillStyle = '#6B3010';
        ctx.fillRect(-6, 11, 7, 4);
        ctx.fillRect(-4,  7, 5, 5);
    }
}
