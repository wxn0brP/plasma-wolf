import { calculatePositions } from "./utils.js";
export class WolfMenuBody {
    parent;
    radius;
    constructor(parent, radius = 150) {
        this.parent = parent;
        this.radius = radius;
        this.parent.innerHTML = "";
    }
    body = [];
    genBody(steps) {
        this.parent.innerHTML = "";
        this.body = [];
        const positions = calculatePositions(this.radius, steps);
        for (let i = 0; i < steps; i++) {
            const div = document.createElement("div");
            div.classList.add("wolf-menu-item");
            div.style.left = `${positions[i * 2]}px`;
            div.style.top = `${positions[i * 2 + 1]}px`;
            this.parent.appendChild(div);
            this.body.push(div);
        }
        const div = document.createElement("div");
        div.classList.add("wolf-menu-item");
        div.classList.add("wolf-menu-item-cancel");
        div.style.left = "0";
        div.style.top = "0";
        this.parent.appendChild(div);
        this.body.push(div);
    }
    clearSelected() {
        this.body.forEach(div => div.classList.remove("selected"));
    }
    select(i) {
        this.body[i].classList.add("selected");
    }
    setNames(commands, cancelCommand) {
        const arr = [
            ...commands,
            cancelCommand
        ];
        arr.forEach((command, index) => {
            this.body[index].innerHTML = command.name;
        });
    }
}
