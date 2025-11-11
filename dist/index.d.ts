import { Command, CommandMap, WolfMenuEvents } from "./types.js";
import { WolfMenuBody } from "./html.js";
import { VEE } from "@wxn0brp/event-emitter";
export declare class WolfMenu {
    _commands: CommandMap;
    _element: HTMLDivElement;
    constructor(_commands: CommandMap, _element: HTMLDivElement);
    _body: WolfMenuBody;
    _x: number;
    _y: number;
    _lastX: number;
    _lastY: number;
    _active: boolean;
    _cancelCommand: Command;
    _selectedCommands: Command[];
    _logFn: {
        (...data: any[]): void;
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    emitter: VEE<WolfMenuEvents>;
    distanceAccept: boolean;
    startCommand: string;
    init(): void;
    _open(commandName?: string): void;
    __open(): void;
    getDirection(): number;
    _setStart(x?: number, y?: number): void;
    setRadius(radius: number): void;
}
