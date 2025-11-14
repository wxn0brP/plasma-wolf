import { Command } from "./types.js";
export declare class WolfMenuBody {
    private parent;
    radius: number;
    constructor(parent: HTMLElement, radius?: number);
    body: HTMLDivElement[];
    selectedClass: string;
    _actualRadius: number;
    genBody(commands: Command[], cancelCommand: Command): void;
    _getRadius(steps: number): number;
    clearSelected(): void;
    select(i: number): void;
}
