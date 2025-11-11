import { Command, CommandMap, WolfMenuEvents } from "./types";
import { getDirection, getDistance } from "./utils";
import { WolfMenuBody } from "./html";
import { VEE } from "@wxn0brp/event-emitter";

export class WolfMenu {
    constructor(
        public _commands: CommandMap,
        public _element: HTMLDivElement
    ) {
        const items = document.createElement("div");
        items.classList.add("wolf-menu-items");
        this._element.appendChild(items);
        this._body = new WolfMenuBody(items);
        this._element.style.display = "none";
    }

    _body: WolfMenuBody;
    _x = 0;
    _y = 0;
    _lastX = 0;
    _lastY = 0;
    _active = false;
    _cancelCommand: Command = {
        name: "Cancel",
        action: () => this._element.style.display = "none"
    }
    _selectedCommands: Command[];
    _logFn = console.log;
    emitter = new VEE<WolfMenuEvents>();
    distanceAccept = true;

    startCommand = "start";
    init() {
        document.addEventListener("mousemove", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (!this._active) return;

            this._body.clearSelected();
            const direction = this.getDirection();
            this._body.select(direction);

            const distance = getDistance({
                x: this._x,
                y: this._y,
                sx: this._lastX,
                sy: this._lastY
            });

            this.emitter.emit("distance", distance, direction);

            if (!this.distanceAccept) return;
            if (distance > this._element.clientWidth)
                this.__open();
        });

        document.addEventListener("click", () => {
            if (this._active) this.__open();
            else this._open();
        });

        this.emitter.emit("initialized");
    }

    _open(commandName: string = this.startCommand) {
        this._selectedCommands = this._commands[commandName];
        if (!this._selectedCommands) return this._logFn(`Command "${commandName}" not found!`);
        this._element.style.display = "";
        this._element.style.top = this._y + "px";
        this._element.style.left = this._x + "px";
        this._body.genBody(this._selectedCommands.length);
        this._body.setNames(this._selectedCommands, this._cancelCommand);
        this._active = true;
        this._setStart();
        this._body.select(this.getDirection());

        this.emitter.emit("menuOpened", commandName);
    }

    __open() {
        this._element.style.display = "none";
        this._active = false;
        const direction = this.getDirection();
        const command = direction > this._selectedCommands.length ? this._cancelCommand : this._selectedCommands[direction];

        this.emitter.emit("menuClosed");
        if (!command) return;

        this.emitter.emit("commandSelected", command);

        if ("go" in command) {
            this._open(command.go);
            return
        }
        if ("action" in command) {
            command.action();
            this.emitter.emit("commandExecuted", command);
        }
        else
            this._logFn("Unknown command type", command);
    }

    getDirection() {
        return getDirection({
            x: this._x,
            y: this._y,
            sx: this._lastX,
            sy: this._lastY
        }, this._selectedCommands.length);
    }

    _setStart(x = this._x, y = this._y) {
        this._lastX = x;
        this._lastY = y;
    }

    setRadius(radius: number) {
        this._body.radius = radius;
    }
}
