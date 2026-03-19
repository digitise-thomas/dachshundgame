export class Doghouse {
    constructor(x, y, requiredHotdogs) {
        this.x               = x;
        this.y               = y;
        this.width           = 52;
        this.height          = 50;
        this.requiredHotdogs = requiredHotdogs;
        this.unlocked        = false;
        this._collected      = 0;
        this._wiggleTimer    = 0;
    }

    update(hotdogsCollected, dt) {
        const wasLocked   = !this.unlocked;
        this._collected   = hotdogsCollected;
        this.unlocked     = hotdogsCollected >= this.requiredHotdogs;

        if (wasLocked && this.unlocked) {
            this._wiggleTimer = 1.8;
        }
        if (this._wiggleTimer > 0) this._wiggleTimer = Math.max(0, this._wiggleTimer - dt);
    }

    overlaps(player) {
        return this.unlocked                             &&
               this.x < player.x + player.width         &&
               this.x + this.width  > player.x          &&
               this.y < player.y + player.height         &&
               this.y + this.height > player.y;
    }

    draw(ctx, time) {
        const wiggleX = this._wiggleTimer > 0
            ? Math.sin(time * 24) * 5 * Math.min(1, this._wiggleTimer / 0.3)
            : 0;

        const x  = this.x + wiggleX;
        const y  = this.y;
        const w  = this.width;
        const h  = this.height;
        const cx = x + w / 2;

        // Pulsing glow when unlocked
        if (this.unlocked) {
            const pulse = 0.3 + Math.sin(time * 3) * 0.2;
            ctx.fillStyle = `rgba(255, 210, 50, ${pulse})`;
            ctx.fillRect(x - 8, y - 8, w + 16, h + 8);
        }

        // Roof (triangle)
        ctx.fillStyle = this.unlocked ? '#c03030' : '#555';
        ctx.beginPath();
        ctx.moveTo(x - 5, y + 14);
        ctx.lineTo(cx,    y - 2);
        ctx.lineTo(x + w + 5, y + 14);
        ctx.closePath();
        ctx.fill();

        // Roof ridge highlight
        ctx.fillStyle = this.unlocked ? '#d84040' : '#666';
        ctx.beginPath();
        ctx.moveTo(cx - 2, y - 2);
        ctx.lineTo(cx,     y - 6);
        ctx.lineTo(cx + 2, y - 2);
        ctx.lineTo(cx,     y + 4);
        ctx.closePath();
        ctx.fill();

        // House body
        ctx.fillStyle = this.unlocked ? '#c8924a' : '#888';
        ctx.fillRect(x, y + 12, w, h - 12);

        // Wood plank lines
        ctx.fillStyle = this.unlocked ? '#a87030' : '#777';
        for (let py = y + 18; py < y + h - 2; py += 8) {
            ctx.fillRect(x + 1, py, w - 2, 2);
        }

        // Door
        const dw = 18;
        const dh = 22;
        const dx = cx - dw / 2;
        const dy = y + h - dh;

        ctx.fillStyle = this.unlocked ? '#7a4820' : '#4a4a4a';
        ctx.fillRect(dx, dy, dw, dh);

        if (this.unlocked) {
            // Dark interior
            ctx.fillStyle = '#100800';
            ctx.fillRect(dx + 2, dy + 2, dw - 4, dh - 2);
            // Warm golden light inside
            ctx.fillStyle = 'rgba(255, 160, 20, 0.45)';
            ctx.fillRect(dx + 2, dy + 2, dw - 4, dh - 2);
        } else {
            // Planked locked door
            ctx.fillStyle = '#3a3a3a';
            ctx.fillRect(dx + 2, dy + 3,  dw - 4, 2);
            ctx.fillRect(dx + 2, dy + 10, dw - 4, 2);
            ctx.fillRect(dx + 2, dy + 17, dw - 4, 2);

            // Padlock body
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(cx - 5, dy + 6, 10, 7);

            // Padlock shackle
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, dy + 6, 3.5, Math.PI, 0);
            ctx.stroke();

            // Progress counter above
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.fillRect(x, y - 22, w, 16);
            ctx.fillStyle = '#ffd700';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`\uD83C\uDF2D ${this._collected} / ${this.requiredHotdogs}`, cx, y - 9);
            ctx.textAlign = 'left';
        }
    }
}
