export class Input {
    constructor() {
        this.held    = new Set();
        this.pressed = new Set();

        window.addEventListener('keydown', e => {
            if (!this.held.has(e.code)) this.pressed.add(e.code);
            this.held.add(e.code);
            // Prevent page scroll from game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', e => {
            this.held.delete(e.code);
        });
    }

    isHeld(code)    { return this.held.has(code); }
    isPressed(code) { return this.pressed.has(code); }

    /** Call once at the end of each frame to clear just-pressed state. */
    flush() { this.pressed.clear(); }
}
