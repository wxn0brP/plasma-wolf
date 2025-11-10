import { Command } from "./types.js";
export declare class WolfMenuBody {
    private parent;
    constructor(parent: HTMLElement);
    body: HTMLDivElement[];
    _genBody(): HTMLDivElement[];
    clearSelected(): void;
    select(i: number): void;
    setNames(commands: Command[], cancelCommand: Command): void;
}
