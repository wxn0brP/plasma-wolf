export declare class Delta {
    dx: number;
    dy: number;
    constructor(dx: number, dy: number);
}
export declare function getDirection(delta: Delta, steps: number, threshold: number): number;
export declare function getDistance({ dx, dy }: Delta): number;
export declare function calculatePositions(radius: number, steps: number): number[];
export declare function getDelta(startX: number, startY: number, endX: number, endY: number): Delta;
export declare function calculateRadius(steps: number): number;
