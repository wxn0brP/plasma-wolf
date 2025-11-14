export class Delta {
    dx;
    dy;
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}
export function getDirection(delta, steps, threshold = 55) {
    const { dx, dy } = delta;
    if (dx === 0 && dy === 0)
        return steps; // no movement
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx < threshold && absDy < threshold)
        return steps; // no movement
    const angle = getAngle(delta);
    const correction = 360 / steps / 2;
    const adjustedAngle = angle + 90 + correction;
    return getSector(adjustedAngle, steps);
}
function getAngle(delta) {
    let angle = Math.atan2(delta.dy, delta.dx);
    angle = angle * (180 / Math.PI);
    if (angle < 0)
        angle += 360;
    return angle;
}
function getSector(angle, steps) {
    const sectorSize = 360 / steps;
    let sector = Math.floor(angle / sectorSize);
    sector = sector % steps;
    return sector;
}
export function getDistance({ dx, dy }) {
    return Math.sqrt(dx * dx + dy * dy);
}
export function calculatePositions(radius, steps) {
    const positions = [];
    const angleStep = (2 * Math.PI) / steps;
    for (let i = 0; i < steps; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        positions.push(Math.round(x), Math.round(y));
    }
    return positions;
}
export function getDelta(startX, startY, endX, endY) {
    return new Delta(endX - startX, endY - startY);
}
export function calculateRadius(steps) {
    const base = 102;
    const perStep = 6;
    let radius = base + perStep * steps;
    if (steps > 8)
        radius += (steps - 8) * 4;
    return radius;
}
