import { VEE } from "@wxn0brp/event-emitter";
import { Command, CommandMap, WolfMenuEvents } from "./types.js";
import { Delta } from "./utils.js";
export declare class WolfMenuCore {
    _commands: CommandMap;
    _x: number;
    _y: number;
    _startX: number;
    _startY: number;
    _active: boolean;
    _selectedCommands: Command[];
    _logFn: {
        (...data: any[]): void;
        (...data: any[]): void;
    };
    _cancelCommand: Command;
    distanceAccept: boolean;
    distanceCount: number;
    startCommand: string;
    threshold: number;
    emitter: VEE<WolfMenuEvents>;
    constructor(_commands: CommandMap);
    init(): void;
    handleMove(radius?: number): {
        delta: Delta;
        direction: number;
        distance: number;
    };
    openMenu(commandName?: string): void;
    selected(): void;
    getDirection(delta?: Delta): number;
    setStart(x?: number, y?: number): void;
    go(commandName: string): void;
}
