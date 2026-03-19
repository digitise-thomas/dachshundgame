import { TILE_SIZE } from './level.js';

export class Hydrant {
    constructor(col, row) {
        this.width     = 18;
        this.height    = 28;
        this.x         = col * TILE_SIZE + (TILE_SIZE - this.width) / 2;
        this.y         = row * TILE_SIZE - this.height;
        this.collected = false;
    }

    collect() {
        this.collected = true;
    }

    overlaps(player) {
        return !this.collected                        &&
               this.x < player.x + player.width      &&
               this.x + this.width  > player.x       &&
               this.y < player.y + player.height      &&
               this.y + this.height > player.y;
    }

    draw(ctx, time) {
        if (this.collected) return;

        const { x, y } = this;
        const cx = x + this.width / 2;

        // Pulsing glow
        const pulse = 0.18 + Math.sin(time * 2.8) * 0.09;
        ctx.fillStyle = `rgba(255, 80, 0, ${pulse})`;
        ctx.fillRect(x - 7, y - 6, this.width + 14, this.height + 6);

        // Base flange
        ctx.fillStyle = '#bb1e00';
        ctx.fillRect(x - 3, y + 22, this.width + 6, 6);

        // Main body
        ctx.fillStyle = '#dd3300';
        ctx.fillRect(x + 2, y + 8, this.width - 4, 15);

        // Body highlight (left edge shine)
        ctx.fillStyle = '#ff5533';
        ctx.fillRect(x + 3, y + 9, 3, 12);

        // Shoulder cap
        ctx.fillStyle = '#cc2200';
        ctx.fillRect(x + 1, y + 4, this.width - 2, 6);

        // Top cap dome
        ctx.fillStyle = '#bb1e00';
        ctx.fillRect(x + 3, y + 1, this.width - 6, 5);

        // Cap nut (top bolt)
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(cx - 3, y - 3, 6, 5);
        ctx.fillStyle = '#ccaa00';
        ctx.fillRect(cx - 2, y - 2, 4, 3);

        // Left nozzle
        ctx.fillStyle = '#aa1c00';
        ctx.fillRect(x - 5, y + 11, 7, 5);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x - 6, y + 12, 3, 3);

        // Right nozzle
        ctx.fillStyle = '#aa1c00';
        ctx.fillRect(x + this.width - 2, y + 11, 7, 5);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x + this.width + 3, y + 12, 3, 3);

        // Body bolts
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x + 3,              y + 9, 2, 2);
        ctx.fillRect(x + this.width - 5, y + 9, 2, 2);

        // +1 life label above
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(cx - 13, y - 16, 26, 12);
        ctx.fillStyle = '#ff6666';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('\u2665 +1', cx, y - 7);
        ctx.textAlign = 'left';
    }
}
