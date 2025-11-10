import { Command, CommandMap } from "./types";
import { getDirection } from "./direction";
import { WolfMenuBody } from "./html";

export class WolfMenu {
    constructor(
        public _commands: CommandMap,
        public _element: HTMLDivElement,
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

    startCommand = "start";
    init() {
        document.addEventListener("mousemove", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (!this._active) return;
            this._body.clearSelected();
            this._body.select(this.getDirection());
        });
        this._start();
    }

    _start(commandName = this.startCommand) {
        document.addEventListener("click", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            this._open(commandName);
        }, { once: true });
    }

    _open(commandName: string = this.startCommand) {
        const commands = this._commands[commandName];
        this._element.style.display = "";
        this._element.style.top = this._y + "px";
        this._element.style.left = this._x + "px";
        this._body.clearSelected();
        this._body.setNames(commands, this._cancelCommand);
        this._active = true;
        this._setStart();
        this._body.select(this.getDirection());

        document.addEventListener("click", () => {
            this._element.style.display = "none";
            this._active = false;
            const direction = this.getDirection();
            if (direction === 8) return this._start();

            const command = commands[direction];
            if ("go" in command) {
                this._open(command.go);
                return
            }
            if ("action" in command)
                command.action();
            else
                console.error("Unknown command type", command);
            this._start();
        }, { once: true });
    }

    getDirection() {
        return getDirection(this._x, this._y, this._lastX, this._lastY);
    }

    _setStart(x = this._x, y = this._y) {
        this._lastX = x;
        this._lastY = y;
    }
}
