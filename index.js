// src/direction.ts
function getDirection(x, y, startX, startY) {
  const dx = x - startX;
  const dy = y - startY;
  if (dx === 0 && dy === 0)
    return 8;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const threshold = 0.6;
  if (absDx < 40 && absDy < 40)
    return 8;
  if (absDx > absDy * (1 + threshold)) {
    return dx > 0 ? 2 : 6;
  } else if (absDy > absDx * (1 + threshold)) {
    return dy > 0 ? 4 : 0;
  } else {
    if (dx > 0 && dy < 0)
      return 1;
    if (dx > 0 && dy > 0)
      return 3;
    if (dx < 0 && dy > 0)
      return 5;
    if (dx < 0 && dy < 0)
      return 7;
  }
  return 8;
}

// src/html.ts
var order = [7, 0, 1, 6, 8, 2, 5, 4, 3];

class WolfMenuBody {
  parent;
  constructor(parent) {
    this.parent = parent;
    this.parent.innerHTML = "";
    this.body = this._genBody();
  }
  body;
  _genBody() {
    const out = [];
    for (let i = 0;i < order.length; i++) {
      const outIndex = order[i];
      const div = document.createElement("div");
      this.parent.appendChild(div);
      out[outIndex] = div;
    }
    return out;
  }
  clearSelected() {
    this.body.forEach((div) => div.classList.remove("selected"));
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

// src/index.ts
class WolfMenu {
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

// node_modules/@wxn0brp/flanker-ui/dist/html.js
(() => {
  var f = Object.defineProperty;
  var a = (t, e) => f(t, "name", { value: e, configurable: true });
  var i = { html(t) {
    return t !== undefined ? (this.innerHTML = t, this) : this.innerHTML;
  }, v(t) {
    return t !== undefined ? (this.value = t, this) : this.value;
  }, on(t, e) {
    return this.addEventListener(t, e), this;
  }, css(t, e = null) {
    return typeof t == "string" ? e !== null ? this.style[t] = e : this.style.cssText = t : Object.assign(this.style, t), this;
  }, attrib(t, e = null) {
    return e !== null ? (this.setAttribute(t, e), this) : this.getAttribute(t) || "";
  }, clA(...t) {
    return this.classList.add(...t), this;
  }, clR(...t) {
    return this.classList.remove(...t), this;
  }, clT(t, e) {
    return this.classList.toggle(t, e), this;
  }, animateFade(t, e = {}) {
    let { time: n = 200, cb: s } = e, r = this, l = t === 0 ? 1 : 0, m = Math.min(1, Math.max(0, t)), u = performance.now();
    r.style.opacity = m.toString();
    function o(T) {
      let d = T - u, h = Math.min(d / n, 1), L = m + (l - m) * h;
      r.style.opacity = L.toString(), h < 1 ? requestAnimationFrame(o) : (r.style.opacity = l.toString(), s?.());
    }
    return a(o, "step"), requestAnimationFrame(o), this;
  }, fadeIn(...t) {
    let e = c({ display: "string", cb: "function", time: "number" }, t), { display: n = "block" } = e;
    return this.css("display", n), this.animateFade(0, e), this.fade = true, this;
  }, fadeOut(...t) {
    let e = c({ cb: "function", time: "number" }, t), n = e.time ?? 300;
    return e.time = n, this.animateFade(1, { ...e, cb: a(() => {
      this.css("display", "none"), e.cb?.();
    }, "cb") }), this.fade = false, this;
  }, async fadeInP(...t) {
    return new Promise((e) => {
      this.fadeIn(...t, () => e(this));
    });
  }, async fadeOutP(...t) {
    return new Promise((e) => {
      this.fadeOut(...t, () => e(this));
    });
  }, fade: true, fadeToggle() {
    return this.fade ? this.fadeOut() : this.fadeIn(), this;
  }, add(t) {
    return this.appendChild(t), this;
  }, addUp(t) {
    return this.insertBefore(t, this.firstChild), this;
  }, qs(t, e = 0) {
    return e && (t = `[data-id="${t}"]`), this.querySelector(t);
  }, qi(t, e = 0) {
    return this.qs(t, e);
  } };
  function c(t, e) {
    let n = {};
    if (e.length === 0)
      return n;
    if (e.every((s) => typeof s == "object"))
      return Object.assign({}, ...e);
    for (let s of e)
      for (let [r, l] of Object.entries(t))
        if (typeof s === l) {
          n[r] = s;
          break;
        }
    return n;
  }
  a(c, "convert");
  Object.assign(HTMLElement.prototype, i);
  Object.assign(document, i);
  Object.assign(document.body, i);
  Object.assign(document.documentElement, i);
  for (let t of ["qs", "qi"])
    typeof i[t] == "function" && (window[t] = function(...e) {
      return i[t].apply(document, e);
    });
})();

// public/index.ts
var commands = {
  start: [
    { name: "Go to the forest", go: "forest" },
    { name: "Enter the castle", go: "castle" },
    { name: "Return to the village", go: "village" },
    { name: "Explore the cave", go: "cave" },
    { name: "Take a look around", action: () => alert("Take a look around... it's pretty quiet.") },
    { name: "Start again", action: () => alert("Let's start again from the beginning.") },
    { name: "Check your inventory", action: () => alert("Make sure you have only your map and a flashlight.") },
    { name: "Finish", action: () => alert("You're done! Congratulations on finishing the adventure!") }
  ],
  forest: [
    { name: "Gather berries", action: () => alert("You gathered some delicious berries.") },
    { name: "Take a rest", action: () => alert("You took a short rest.") },
    { name: "Find a stream", action: () => alert("You found a stream with cool, clear water.") },
    { name: "Go deeper in the forest", go: "deep_forest" },
    { name: "Return to the start", go: "start" },
    { name: "Light a fire", action: () => alert("You lit a fire and felt warm.") },
    { name: "Listen to the forest sounds", action: () => alert("You listened carefully and heard some soothing sounds.") },
    { name: "Take a break", action: () => alert("You took a short break.") }
  ],
  castle: [
    { name: "Enter the throne room", go: "throne_room" },
    { name: "Talk to the guard", action: () => alert("The guard says: 'You cannot pass without permission.'") },
    { name: "Explore the garden", action: () => alert("The garden is empty and quiet.") },
    { name: "Enter the armory", go: "armory" },
    { name: "Enter the dungeon", go: "dungeon" },
    { name: "Return to the start", go: "start" },
    { name: "Visit the library", go: "library" },
    { name: "Use the lavatory", action: () => alert("You hear the sound of running water.") }
  ],
  village: [
    { name: "Talk to the blacksmith", action: () => alert("Blacksmith: 'How can I help you with the new month?'") },
    { name: "Enter the tavern", go: "tavern" },
    { name: "Visit the shopkeeper", action: () => alert("Shopkeeper: 'Welcome to my humble shop.'") },
    { name: "Talk to the children", action: () => alert("Children: 'We're so happy to see you!'") },
    { name: "Feed the beggar", action: () => alert("The beggar thanks you for the food.") },
    { name: "Return to the start", go: "start" },
    { name: "Get a drink", action: () => alert("You take a refreshing drink.") },
    { name: "Take a walk at night", go: "forest" }
  ],
  cave: [
    { name: "Go deeper", go: "deep_cave" },
    { name: "Write on the wall", action: () => alert("You write an old rhyme on the wall.") },
    { name: "Light a match", action: () => alert("The match flickers and casts a small, warm glow.") },
    { name: "Shout", action: () => alert("Your voice echoes off the walls... and something else.") },
    { name: "Return to the start", go: "start" },
    { name: "Bang on the pipe", action: () => alert("The pipe makes a loud, hollow clang.") },
    { name: "Repeat after the echo", action: () => alert("The echo repeats your words back to you.") },
    { name: "Take a break at the entrance", action: () => alert("You take a short break at the entrance.") }
  ]
};
var wolf = qs(".wolf");
var menu = new WolfMenu(commands, wolf);
menu.init();
export {
  commands
};
