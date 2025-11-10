import { Command, CommandMap } from "./types";
import { getDirection } from "./direction";

export class WolfMenu {
    constructor(
        public _commands: CommandMap,
        public _element: HTMLDivElement,
    ) { }

    _x = 0;
    _y = 0;
    _lastX = 0;
    _lastY = 0;
    _directionElements: HTMLDivElement[] = [];
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
            this._clearSelected();
            const direction = this.getDirection();
            this._directionElements[direction].clA("selected");
        });

        this._directionElements = Array.from(this._element.querySelectorAll("div"));
        this._directionElements.sort((a, b) => +a.dataset.id - +b.dataset.id);
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
        this._clearSelected();
        this._setNames(commands);
        this._active = true;
        this._setStart();
        this._directionElements[this.getDirection()].clA("selected");

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

    _clearSelected() {
        this._directionElements.forEach(div => div.clR("selected"));
    }

    _setNames(commands: Command[]) {
        const arr: Command[] = [
            ...commands,
            this._cancelCommand
        ]
        arr.forEach((command, index) => {
            this._directionElements[index].innerHTML = command.name;
        });
    }

    getDirection() {
        return getDirection(this._x, this._y, this._lastX, this._lastY);
    }

    _setStart(x = this._x, y = this._y) {
        this._lastX = x;
        this._lastY = y;
    }
}
