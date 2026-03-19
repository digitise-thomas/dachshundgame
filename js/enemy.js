import { TILE_SIZE } from './level.js';

export class Enemy {
    constructor(col, row, leftCol, rightCol, speed = 70) {
        this.width  = 30;
        this.height = 24;
        this.x = col * TILE_SIZE;
        this.y = row * TILE_SIZE - this.height;
        this.vx = speed;

        this.leftBound  = leftCol  * TILE_SIZE;
        this.rightBound = rightCol * TILE_SIZE + TILE_SIZE - this.width;

        this.stunned    = 0;
        this._walkTime  = 0;
        this._spinAngle = 0;
    }

    stun(duration) {
        this.stunned    = duration;
        this._spinAngle = 0;
    }

    update(dt) {
        if (this.stunned > 0) {
            this.stunned    -= dt;
            this._spinAngle += dt * 14;
            return;
        }

        this.x += this.vx * dt;
        this._walkTime += dt;

        if (this.vx < 0 && this.x <= this.leftBound) {
            this.x  = this.leftBound;
            this.vx = Math.abs(this.vx);
        }
        if (this.vx > 0 && this.x >= this.rightBound) {
            this.x  = this.rightBound;
            this.vx = -Math.abs(this.vx);
        }
    }

    overlaps(player) {
        if (this.stunned > 0) return false;
        return this.x < player.x + player.width  &&
               this.x + this.width  > player.x   &&
               this.y < player.y + player.height  &&
               this.y + this.height > player.y;
    }

    draw(ctx, time) {
        const facingRight = this.vx >= 0;
        const cx = Math.round(this.x + this.width / 2);
        const cy = Math.round(this.y + this.height / 2);

        ctx.save();
        ctx.translate(cx, cy);
        if (this.stunned > 0) {
            ctx.rotate(this._spinAngle);
        } else if (!facingRight) {
            ctx.scale(-1, 1);
        }
        ctx.translate(-this.width / 2, -this.height / 2);
        this._drawBody(ctx, this._walkTime, this.stunned > 0);
        ctx.restore();

        // Stun stars orbiting above
        if (this.stunned > 0) {
            ctx.fillStyle = '#ffd700';
            for (let i = 0; i < 3; i++) {
                const angle = time * 5 + (i / 3) * Math.PI * 2;
                const sx = Math.round(this.x + this.width / 2 + Math.cos(angle) * 13);
                const sy = Math.round(this.y - 10 + Math.sin(angle) * 5);
                ctx.fillRect(sx - 2, sy - 2, 4, 4);
            }
        }
    }

    _drawBody(ctx, walkTime = 0, stunned = false) {
        if (stunned) ctx.globalAlpha = 0.45;

        const legSwing = Math.sin(walkTime * 13) * 3;

        // Body (stocky, dark)
        ctx.fillStyle = '#1e1208';
        ctx.fillRect(0, 8, 26, 14);

        // Belly
        ctx.fillStyle = '#2e1e10';
        ctx.fillRect(3, 14, 18, 8);

        // Head
        ctx.fillStyle = '#2a1810';
        ctx.fillRect(14, 0, 16, 16);

        // Snout
        ctx.fillStyle = '#1e1208';
        ctx.fillRect(26, 5, 8, 8);

        // Nose
        ctx.fillStyle = '#080300';
        ctx.fillRect(31, 6, 4, 4);

        // Eye (angry red)
        ctx.fillStyle = '#cc1800';
        ctx.fillRect(18, 2, 7, 5);
        ctx.fillStyle = '#080200';
        ctx.fillRect(19, 3, 5, 4);

        // Angry brow
        ctx.fillStyle = '#080300';
        ctx.fillRect(17, 0, 9, 2);
        ctx.fillRect(21, -1, 5, 2);

        // Ear (pointy, upright)
        ctx.fillStyle = '#100800';
        ctx.fillRect(16, -5, 7, 8);
        ctx.fillRect(19, -8, 4, 5);

        // Teeth
        ctx.fillStyle = '#e8e8e0';
        ctx.fillRect(27, 10, 3, 4);
        ctx.fillRect(31, 10, 3, 4);

        // Red collar
        ctx.fillStyle = '#990000';
        ctx.fillRect(14, 10, 14, 4);

        // Collar spikes
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(17, 8,  3, 3);
        ctx.fillRect(23, 8,  3, 3);

        // Legs
        const ly1 = Math.round(legSwing);
        const ly2 = Math.round(-legSwing);
        ctx.fillStyle = '#1e1208';
        ctx.fillRect(2,  19 + ly1, 5, 8);
        ctx.fillRect(9,  19 + ly2, 5, 8);
        ctx.fillRect(16, 19 + ly1, 5, 8);

        // Tail
        ctx.fillStyle = '#1e1208';
        ctx.fillRect(-4, 8, 5, 4);
        ctx.fillRect(-3, 4, 4, 5);

        if (stunned) ctx.globalAlpha = 1;
    }
}
