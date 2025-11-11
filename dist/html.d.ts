import { Command } from "./types.js";
export declare class WolfMenuBody {
    private parent;
    radius: number;
    constructor(parent: HTMLElement, radius?: number);
    body: HTMLDivElement[];
    genBody(steps: number): void;
    clearSelected(): void;
    select(i: number): void;
    setNames(commands: Command[], cancelCommand: Command): void;
}
