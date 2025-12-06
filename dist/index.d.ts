import { Command, CommandMap, WolfMenuEvents } from "./types.js";
import { Delta } from "./utils.js";
import { WolfMenuBody } from "./html.js";
import { VEE } from "@wxn0brp/event-emitter";
export declare class WolfMenu {
    _commands: CommandMap;
    _element: HTMLDivElement;
    constructor(_commands: CommandMap, _element: HTMLDivElement);
    _x: number;
    _y: number;
    _startX: number;
    _startY: number;
    _active: boolean;
    _selectedCommands: Command[];
    _logFn: {
        (...data: any[]): void;
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    _cancelCommand: Command;
    body: WolfMenuBody;
    emitter: VEE<WolfMenuEvents>;
    distanceAccept: boolean;
    distanceCount: number;
    startCommand: string;
    init(): void;
    _initMove(): void;
    _initClick(): void;
    _openMenu(commandName?: string): void;
    _selected(): void;
    getDirection(delta?: Delta): number;
    _setStart(x?: number, y?: number): void;
    setRadius(radius: number): void;
    go(commandName: string): void;
}
