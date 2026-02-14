import { WolfMenuCore } from "./core.js";
import { WolfMenuBody } from "./html.js";
import { CommandMap } from "./types.js";
export declare class WolfMenu extends WolfMenuCore {
    body: WolfMenuBody;
    _element: HTMLDivElement;
    blockOpen: boolean;
    constructor(_commands: CommandMap, element: HTMLDivElement);
    init(): void;
    _initMove(): void;
    _initClick(): void;
    openMenu(commandName?: string): void;
    handleMove(): {
        delta: import("./utils.js").Delta;
        direction: number;
        distance: number;
    };
    setRadius(radius: number): void;
}
