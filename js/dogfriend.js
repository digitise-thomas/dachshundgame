export class DogFriend {
    constructor(x, y) {
        this.x       = x;
        this.y       = y;
        this.width   = 34;
        this.height  = 28;
        this.reached = false;
    }

    /** Sets this friend as a checkpoint if the player overlaps it. */
    checkAndSetCheckpoint(player) {
        if (this.reached) return;
        if (this.x < player.x + player.width  &&
            this.x + this.width  > player.x   &&
            this.y < player.y + player.height  &&
            this.y + this.height > player.y) {
            this.reached    = true;
            player.spawnX   = this.x;
            player.spawnY   = this.y;
        }
    }

    draw(ctx, time) {
        const x = this.x;
        const y = this.y;
        const color = this.reached ? '#FFD700' : '#C89820';
        const dark  = this.reached ? '#C8A000' : '#906800';

        // Body (facing left to greet the arriving player)
        ctx.fillStyle = color;
        ctx.fillRect(x + 2,  y + 10, 20, 14);

        // Head (at left side — dog faces left)
        ctx.fillRect(x,  y + 2, 16, 14);

        // Snout
        ctx.fillStyle = dark;
        ctx.fillRect(x - 6, y + 8, 8, 7);

        // Nose
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(x - 6, y + 9, 3, 4);

        // Ear (floppy)
        ctx.fillStyle = dark;
        ctx.fillRect(x + 6, y, 8, 13);

        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 2, y + 4, 5, 5);
        ctx.fillStyle = '#1a0800';
        ctx.fillRect(x + 3, y + 5, 3, 3);

        // Legs
        ctx.fillStyle = color;
        ctx.fillRect(x + 3,  y + 22, 5, 6);
        ctx.fillRect(x + 12, y + 22, 5, 6);

        // Tail — wags when reached
        const wag = this.reached ? Math.sin(time * 10) * 5 : 0;
        ctx.fillStyle = color;
        ctx.fillRect(x + 20, y + 8 + Math.round(wag), 10, 4);

        // Star marker above (until reached)
        if (!this.reached) {
            ctx.fillStyle = 'rgba(255,255,100,0.8)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('★', x + 14, y - 4);
            ctx.textAlign = 'left';
        }
    }
}
