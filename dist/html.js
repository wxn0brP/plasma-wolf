const order = [7, 0, 1, 6, 8, 2, 5, 4, 3];
export class WolfMenuBody {
    parent;
    constructor(parent) {
        this.parent = parent;
        this.parent.innerHTML = "";
        this.body = this._genBody();
    }
    body;
    _genBody() {
        const out = [];
        for (let i = 0; i < order.length; i++) {
            const outIndex = order[i];
            const div = document.createElement("div");
            this.parent.appendChild(div);
            out[outIndex] = div;
        }
        return out;
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
