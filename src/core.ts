import { VEE } from "@wxn0brp/event-emitter";
import { Command, CommandMap, WolfMenuEvents } from "./types";
import { Delta, getDelta, getDirection, getDistance } from "./utils";

export class WolfMenuCore {
	_x = 0;
	_y = 0;
	_startX = 0;
	_startY = 0;
	_active = false;
	_selectedCommands: Command[] = [];
	_logFn = console.log;
	_cancelCommand: Command = { name: "Cancel", action: () => { } };

	distanceAccept = true;
	distanceCount = 60;
	startCommand = "start";
	threshold = 55;

	emitter = new VEE<WolfMenuEvents>();

	constructor(public _commands: CommandMap) { }

	init() {
		this.emitter.emit("initialized");
	}

	handleMove(radius = this.threshold * 2) {
		const delta = getDelta(this._startX, this._startY, this._x, this._y);
		const direction = getDirection(delta, this._selectedCommands.length, this.threshold);
		const distance = getDistance(delta);

		this.emitter.emit("distance", distance, direction);

		// If the distance is greater than the radius, run the command
		if (this.distanceAccept && distance > radius + this.distanceCount)
			this.selected();

		return {
			delta,
			direction,
			distance
		}
	}

	openMenu(commandName: string = this.startCommand) {
		this._selectedCommands = this._commands[commandName];
		if (!this._selectedCommands)
			return this._logFn(`Command "${commandName}" not found!`);

		this._active = true;
		this.setStart();

		this.emitter.emit("menuOpened", commandName);
	}

	selected() {
		this._active = false;
		const direction = this.getDirection();
		const command =
			direction >= this._selectedCommands.length ?
				this._cancelCommand :
				this._selectedCommands[direction];

		this.emitter.emit("commandSelected", command);

		if ("go" in command)
			return this.openMenu(command.go);

		if ("action" in command) {
			command.action();
			this.emitter.emit("commandExecuted", command);
		}
		else
			this._logFn("Unknown command type", command);

		this.emitter.emit("menuClosed");
	}

	getDirection(delta?: Delta): number {
		if (!delta)
			delta = getDelta(this._startX, this._startY, this._x, this._y);
		return getDirection(delta, this._selectedCommands.length, this.threshold);
	}

	setStart(x = this._x, y = this._y) {
		this._startX = x;
		this._startY = y;
	}

	go(commandName: string) {
		this.openMenu(commandName);
	}
}
