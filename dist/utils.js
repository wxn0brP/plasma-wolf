export function getDirection({ x, y, sx, sy }, steps, threshold = 55) {
    const dx = x - sx;
    const dy = y - sy;
    if (dx === 0 && dy === 0)
        return steps; // no movement
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx < threshold && absDy < threshold)
        return steps; // no movement
    const angle = getAngle({ x, y, sx, sy });
    const correction = 360 / steps / 2;
    const adjustedAngle = angle + 90 + correction;
    return getSector(adjustedAngle, steps);
}
function getAngle({ x, y, sx, sy }) {
    const deltaX = x - sx;
    const deltaY = y - sy;
    let angle = Math.atan2(deltaY, deltaX);
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
export function getDistance({ x, y, sx, sy }) {
    const dx = x - sx;
    const dy = y - sy;
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
