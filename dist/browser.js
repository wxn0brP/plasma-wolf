import { WolfMenuCore } from "./core.js";
import { WolfMenuBody } from "./html.js";
export class WolfMenu extends WolfMenuCore {
    body;
    _element;
    blockOpen = false;
    constructor(_commands, element) {
        super(_commands);
        this._element = element;
        const items = document.createElement("div");
        items.classList.add("wolf-menu-items");
        this._element.appendChild(items);
        this.body = new WolfMenuBody(items);
        this._element.style.display = "none";
        this.emitter.on("menuClosed", () => {
            this._element.style.display = "none";
        });
    }
    init() {
        this._initMove();
        this._initClick();
        super.init();
    }
    _initMove() {
        document.addEventListener("mousemove", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            this.handleMove();
        });
    }
    _initClick() {
        document.addEventListener("click", (e) => {
            this._x = e.clientX;
            this._y = e.clientY;
            if (this._active)
                this.selected();
            else if (!this.blockOpen)
                this.openMenu();
        });
    }
    openMenu(commandName = this.startCommand) {
        super.openMenu(commandName);
        this._element.style.display = "";
        this._element.style.top = this._y + "px";
        this._element.style.left = this._x + "px";
        this.body.genBody(this._selectedCommands, this._cancelCommand);
        this.body.select(this.getDirection());
    }
    handleMove() {
        if (!this._active)
            return;
        this.body.clearSelected();
        const res = super.handleMove(this.body._actualRadius);
        this.body.select(res.direction);
        return res;
    }
    setRadius(radius) {
        this.body.radius = radius;
    }
}
