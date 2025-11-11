import { MousePos } from "./types.js";
export declare function getDirection({ x, y, sx, sy }: MousePos, steps: number, threshold?: number): number;
export declare function getDistance({ x, y, sx, sy }: MousePos): number;
export declare function calculatePositions(radius: number, steps: number): number[];
