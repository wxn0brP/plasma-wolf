import { getDirection } from "./direction.js";
import { WolfMenuBody } from "./html.js";
export class WolfMenu {
    _commands;
    _element;
    constructor(_commands, _element) {
        this._commands = _commands;
        this._element = _element;
        this._body = new WolfMenuBody(this._element);
        this._element.style.display = "none";
    }
    _body;
    _x = 0;
    _y = 0;
    _lastX = 0;
    _lastY = 0;
    _active = false;
    _cancelCommand = {
        name: "Cancel",
        action: () => this._element.style.display = "none"
    };
    _selectedCommands;
    _logFn = console.log;
    startCommand = "start";
    init() {
        document.addEventListener("mousemove", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (!this._active)
                return;
            this._body.clearSelected();
            this._body.select(this.getDirection());
        });
        document.addEventListener("click", () => {
            if (this._active)
                this.__open();
            else
                this._open();
        });
    }
    _open(commandName = this.startCommand) {
        this._selectedCommands = this._commands[commandName];
        this._element.style.display = "";
        this._element.style.top = this._y + "px";
        this._element.style.left = this._x + "px";
        this._body.clearSelected();
        this._body.setNames(this._selectedCommands, this._cancelCommand);
        this._active = true;
        this._setStart();
        this._body.select(this.getDirection());
    }
    __open() {
        this._element.style.display = "none";
        this._active = false;
        const direction = this.getDirection();
        const command = direction === 8 ? this._cancelCommand : this._selectedCommands[direction];
        if (!command)
            return;
        if ("go" in command) {
            this._open(command.go);
            return;
        }
        if ("action" in command)
            command.action();
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
