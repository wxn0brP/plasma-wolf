import { Command, CommandMap, WolfMenuEvents } from "./types";
import { getDirection, getDistance } from "./direction";
import { WolfMenuBody } from "./html";
import { VEE } from "@wxn0brp/event-emitter";

export class WolfMenu {
    constructor(
        public _commands: CommandMap,
        public _element: HTMLDivElement
    ) {
        this._body = new WolfMenuBody(this._element);
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

    startCommand = "start";
    init(distanceEnable = true) {
        document.addEventListener("mousemove", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (!this._active) return;

            this._body.clearSelected();
            const direction = this.getDirection();
            this._body.select(direction);

            if (!distanceEnable) return;
            const distance = getDistance(this._x, this._y, this._lastX, this._lastY);
            this.emitter.emit("distance", distance, direction);
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
        this._element.style.display = "";
        this._element.style.top = this._y + "px";
        this._element.style.left = this._x + "px";
        this._body.clearSelected();
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
        const command = direction === 8 ? this._cancelCommand : this._selectedCommands[direction];

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
        return getDirection(this._x, this._y, this._lastX, this._lastY);
    }

    _setStart(x = this._x, y = this._y) {
        this._lastX = x;
        this._lastY = y;
    }
}
