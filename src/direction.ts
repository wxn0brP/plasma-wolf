export function getDirection(x: number, y: number, startX: number, startY: number): number {
    const dx = x - startX;
    const dy = y - startY;

    if (dx === 0 && dy === 0) return 8; // no movement

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    const threshold = 0.6; // threshold for diagonal movement

    if (absDx < 40 && absDy < 40) return 8; // no movement

    if (absDx > absDy * (1 + threshold)) {
        // mostly vertical movement
        return dx > 0 ? 2 : 6; // right or left
    } else if (absDy > absDx * (1 + threshold)) {
        // mostly horizontal movement
        return dy > 0 ? 4 : 0; // down or up
    } else {
        // roughly equal horizontal and vertical movement -> diagonal
        if (dx > 0 && dy < 0) return 1; // right-up
        if (dx > 0 && dy > 0) return 3; // right-down
        if (dx < 0 && dy > 0) return 5; // left-down
        if (dx < 0 && dy < 0) return 7; // left-up
    }

    return 8; // fallback
}