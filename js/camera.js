export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width  = width;
        this.height = height;
    }

    /**
     * Snap camera to keep the target centred, clamped to world bounds.
     * @param {object} target  - has .x, .y, .width, .height
     * @param {number} worldW  - total world width in px
     * @param {number} worldH  - total world height in px
     */
    follow(target, worldW, worldH) {
        this.x = target.x + target.width  / 2 - this.width  / 2;
        this.y = target.y + target.height / 2 - this.height / 2;
        this.x = Math.max(0, Math.min(this.x, worldW - this.width));
        this.y = Math.max(0, Math.min(this.y, worldH - this.height));
    }
}
