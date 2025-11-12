import { getDelta, getDirection, getDistance } from "./utils.js";
import { WolfMenuBody } from "./html.js";
import { VEE } from "@wxn0brp/event-emitter";
export class WolfMenu {
    _commands;
    _element;
    constructor(_commands, _element) {
        this._commands = _commands;
        this._element = _element;
        const items = document.createElement("div");
        items.classList.add("wolf-menu-items");
        this._element.appendChild(items);
        this.body = new WolfMenuBody(items);
        this._element.style.display = "none";
    }
    _x = 0;
    _y = 0;
    _startX = 0;
    _startY = 0;
    _active = false;
    _selectedCommands;
    _logFn = console.log;
    _cancelCommand = { name: "Cancel", action: () => { } };
    body;
    emitter = new VEE();
    distanceAccept = true;
    distanceCount = 60;
    startCommand = "start";
    init() {
        this._initMove();
        this._initClick();
        this.emitter.emit("initialized");
    }
    _initMove() {
        document.addEventListener("mousemove", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (!this._active)
                return;
            this.body.clearSelected();
            const delta = getDelta(this._startX, this._startY, this._x, this._y);
            const direction = getDirection(delta, this._selectedCommands.length);
            this.body.select(direction);
            const distance = getDistance(delta);
            this.emitter.emit("distance", distance, direction);
            if (!this.distanceAccept)
                return;
            if (distance > this.body._actualRadius + this.distanceCount)
                this._selected();
        });
    }
    _initClick() {
        document.addEventListener("click", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (this._active)
                this._selected();
            else
                this._openMenu();
        });
    }
    _openMenu(commandName = this.startCommand) {
        this._selectedCommands = this._commands[commandName];
        if (!this._selectedCommands)
            return this._logFn(`Command "${commandName}" not found!`);
        this._element.style.display = "";
        this._element.style.top = this._y + "px";
        this._element.style.left = this._x + "px";
        this.body.genBody(this._selectedCommands, this._cancelCommand);
        this._active = true;
        this._setStart();
        this.body.select(this.getDirection());
        this.emitter.emit("menuOpened", commandName);
    }
    _selected() {
        this._element.style.display = "none";
        this._active = false;
        const direction = this.getDirection();
        const command = direction > this._selectedCommands.length ? this._cancelCommand : this._selectedCommands[direction];
        this.emitter.emit("menuClosed");
        if (!command)
            return;
        this.emitter.emit("commandSelected", command);
        if ("go" in command) {
            this._openMenu(command.go);
            return;
        }
        if ("action" in command) {
            command.action();
            this.emitter.emit("commandExecuted", command);
        }
        else
            this._logFn("Unknown command type", command);
    }
    getDirection(delta) {
        if (!delta)
            delta = getDelta(this._startX, this._startY, this._x, this._y);
        return getDirection(delta, this._selectedCommands.length);
    }
    _setStart(x = this._x, y = this._y) {
        this._startX = x;
        this._startY = y;
    }
    setRadius(radius) {
        this.body.radius = radius;
    }
}
