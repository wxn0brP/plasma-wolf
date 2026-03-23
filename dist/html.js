import { calculatePositions, calculateRadius } from "./utils.js";
export class WolfMenuBody {
    parent;
    radius;
    constructor(parent, radius = 0) {
        this.parent = parent;
        this.radius = radius;
        this.parent.innerHTML = "";
        this._actualRadius = radius;
    }
    body = [];
    selectedClass = "selected";
    _actualRadius;
    genBody(commands, cancelCommand) {
        this.parent.innerHTML = "";
        this.body = [];
        const positions = calculatePositions(this._getRadius(commands.length), commands.length);
        for (let i = 0; i < commands.length; i++) {
            const div = document.createElement("div");
            div.classList.add("wolf-menu-item");
            div.style.left = `${positions[i * 2]}px`;
            div.style.top = `${positions[i * 2 + 1]}px`;
            div.innerHTML = commands[i].name;
            this.parent.appendChild(div);
            this.body.push(div);
        }
        const div = document.createElement("div");
        div.classList.add("wolf-menu-item");
        div.classList.add("wolf-menu-item-cancel");
        div.style.left = "0";
        div.style.top = "0";
        div.innerHTML = cancelCommand.name;
        this.parent.appendChild(div);
        this.body.push(div);
    }
    _getRadius(steps) {
        if (this.radius === 0)
            this._actualRadius = calculateRadius(steps);
        else
            this._actualRadius = this.radius;
        return this._actualRadius;
    }
    clearSelected() {
        this.body.forEach(div => div.classList.remove(this.selectedClass));
    }
    select(i) {
        if (!this.body[i])
            return;
        this.body.forEach(div => div.classList.remove(this.selectedClass));
        this.body[i].classList.add(this.selectedClass);
    }
}
