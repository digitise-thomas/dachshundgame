export class Bone {
    constructor(x, y) {
        this.x         = x;
        this.y         = y;
        this.width     = 40;
        this.height    = 20;
        this.collected = false;
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

        // Gentle vertical bob
        const x = this.x;
        const y = this.y + Math.round(Math.sin(time * 2.5) * 3);

        ctx.fillStyle = '#E8E8C8';

        // Left knob (cross shape → rounded feel)
        ctx.fillRect(x,      y + 4,  13, 12);
        ctx.fillRect(x + 3,  y,       7, 20);

        // Center bar
        ctx.fillRect(x + 11, y + 7,  18,  6);

        // Right knob
        ctx.fillRect(x + 27, y + 4,  13, 12);
        ctx.fillRect(x + 30, y,       7, 20);

        // Highlights
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4,  y + 1, 3, 5);
        ctx.fillRect(x + 31, y + 1, 3, 5);
    }
}
