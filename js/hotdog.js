import { TILE_SIZE } from './level.js';

export class HotDog {
    constructor(col, row) {
        this.width     = 26;
        this.height    = 13;
        this.x         = col * TILE_SIZE + (TILE_SIZE - this.width) / 2;
        this.y         = row * TILE_SIZE - this.height;
        this._baseX    = this.x;
        this.collected = false;
        this._fleeVx   = 0;
    }

    collect() {
        this.collected = true;
    }

    update(dt, playerCx) {
        if (this.collected) return;
        const dist = playerCx - (this.x + this.width / 2);
        if (Math.abs(dist) < 90) {
            // Run away!
            this._fleeVx = dist < 0 ? 58 : -58;
        } else {
            // Slow down quickly when player is far
            this._fleeVx *= Math.pow(0.01, dt);
        }
        this.x += this._fleeVx * dt;
        // Don't flee too far from original spot
        this.x = Math.max(this._baseX - 38, Math.min(this._baseX + 38, this.x));
    }

    overlaps(player) {
        return !this.collected                       &&
               this.x < player.x + player.width     &&
               this.x + this.width  > player.x      &&
               this.y < player.y + player.height     &&
               this.y + this.height > player.y;
    }

    draw(ctx, time) {
        if (this.collected) return;

        // Wiggle when fleeing
        const fleeing = Math.abs(this._fleeVx) > 5;
        const wobble  = fleeing ? Math.sin(time * 18) * 2 : 0;

        const bob = Math.sin(time * 2.8) * 2;
        const x   = Math.round(this.x);
        const y   = Math.round(this.y + bob);
        const w   = this.width;
        const h   = this.height;

        ctx.save();
        if (fleeing) {
            ctx.translate(x + w / 2, y + h / 2);
            ctx.rotate(wobble * 0.08);
            ctx.translate(-(x + w / 2), -(y + h / 2));
        }

        // Shine glow
        ctx.fillStyle = 'rgba(255, 200, 0, 0.18)';
        ctx.fillRect(x - 4, y - 4, w + 8, h + 8);

        // Bun top
        ctx.fillStyle = '#D4961A';
        ctx.fillRect(x, y, w, h / 2 + 2);

        // Bun bottom
        ctx.fillStyle = '#C08A14';
        ctx.fillRect(x, y + Math.ceil(h / 2), w, Math.floor(h / 2));

        // Sausage
        ctx.fillStyle = '#8B2000';
        ctx.fillRect(x + 2, y + 3, w - 4, h - 6);

        // Sausage highlight
        ctx.fillStyle = '#B83400';
        ctx.fillRect(x + 3, y + 3, w - 6, 3);

        // Mustard
        ctx.fillStyle = '#F5D000';
        ctx.fillRect(x + 4, y + 5, w - 8, 2);

        // Little legs when fleeing (very silly)
        if (fleeing) {
            const ll = Math.sin(time * 20) * 2;
            ctx.fillStyle = '#8B2000';
            ctx.fillRect(x + 3,      y + h,     3, 4 + Math.round(ll));
            ctx.fillRect(x + 9,      y + h,     3, 4 - Math.round(ll));
            ctx.fillRect(x + w - 6,  y + h,     3, 4 + Math.round(ll));
            ctx.fillRect(x + w - 12, y + h,     3, 4 - Math.round(ll));
        }

        ctx.restore();
    }
}
