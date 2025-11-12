// src/utils.ts
function getDirection({ x, y, sx, sy }, steps, threshold = 55) {
  const dx = x - sx;
  const dy = y - sy;
  if (dx === 0 && dy === 0)
    return steps;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (absDx < threshold && absDy < threshold)
    return steps;
  const angle = getAngle({ x, y, sx, sy });
  const correction = 360 / steps / 2;
  const adjustedAngle = angle + 90 + correction;
  return getSector(adjustedAngle, steps);
}
function getAngle({ x, y, sx, sy }) {
  const deltaX = x - sx;
  const deltaY = y - sy;
  let angle = Math.atan2(deltaY, deltaX);
  angle = angle * (180 / Math.PI);
  if (angle < 0)
    angle += 360;
  return angle;
}
function getSector(angle, steps) {
  const sectorSize = 360 / steps;
  let sector = Math.floor(angle / sectorSize);
  sector = sector % steps;
  return sector;
}
function getDistance({ x, y, sx, sy }) {
  const dx = x - sx;
  const dy = y - sy;
  return Math.sqrt(dx * dx + dy * dy);
}
function calculatePositions(radius, steps) {
  const positions = [];
  const angleStep = 2 * Math.PI / steps;
  for (let i = 0;i < steps; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push(Math.round(x), Math.round(y));
  }
  return positions;
}

// src/html.ts
class WolfMenuBody {
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
    for (let i = 0;i < steps; i++) {
      const div2 = document.createElement("div");
      div2.classList.add("wolf-menu-item");
      div2.style.left = `${positions[i * 2]}px`;
      div2.style.top = `${positions[i * 2 + 1]}px`;
      this.parent.appendChild(div2);
      this.body.push(div2);
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

// node_modules/@wxn0brp/event-emitter/dist/index.js
class VEE {
  _events = {};
  on(event, listener) {
    const _event = event;
    if (!this._events[_event])
      this._events[_event] = [];
    this._events[_event].push(listener);
  }
  once(event, listener) {
    const onceListener = (...args) => {
      this.off(event, onceListener);
      listener(...args);
    };
    this.on(event, onceListener);
  }
  off(event, listener) {
    const _event = event;
    if (!this._events[_event])
      return;
    this._events[_event] = this._events[_event].filter((l) => l !== listener);
  }
  emit(event, ...args) {
    const listeners = this._events[event];
    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
  listenerCount(event) {
    return this._events[event]?.length || 0;
  }
}

// src/index.ts
class WolfMenu {
  _commands;
  _element;
  constructor(_commands, _element) {
    this._commands = _commands;
    this._element = _element;
    const items = document.createElement("div");
    items.classList.add("wolf-menu-items");
    this._element.appendChild(items);
    this._body = new WolfMenuBody(items);
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
  emitter = new VEE;
  distanceAccept = true;
  startCommand = "start";
  init() {
    document.addEventListener("mousemove", (e) => {
      this._x = e.clientX;
      this._y = e.clientY;
      if (!this._active)
        return;
      this._body.clearSelected();
      const direction = this.getDirection();
      this._body.select(direction);
      const distance = getDistance({
        x: this._x,
        y: this._y,
        sx: this._lastX,
        sy: this._lastY
      });
      this.emitter.emit("distance", distance, direction);
      if (!this.distanceAccept)
        return;
      if (distance > this._element.clientWidth)
        this.__open();
    });
    document.addEventListener("click", () => {
      if (this._active)
        this.__open();
      else
        this._open();
    });
    this.emitter.emit("initialized");
  }
  _open(commandName = this.startCommand) {
    this._selectedCommands = this._commands[commandName];
    if (!this._selectedCommands)
      return this._logFn(`Command "${commandName}" not found!`);
    this._element.style.display = "";
    this._element.style.top = this._y + "px";
    this._element.style.left = this._x + "px";
    this._body.genBody(this._selectedCommands.length);
    this._body.setNames(this._selectedCommands, this._cancelCommand);
    this._active = true;
    this._setStart();
    this._body.select(this.getDirection());
    this.emitter.emit("menuOpened", commandName);
  }
  __open() {
    this._element.style.display = "none";
    this._active = false;
    const direction = this.getDirection();
    const command = direction > this._selectedCommands.length ? this._cancelCommand : this._selectedCommands[direction];
    this.emitter.emit("menuClosed");
    if (!command)
      return;
    this.emitter.emit("commandSelected", command);
    if ("go" in command) {
      this._open(command.go);
      return;
    }
    if ("action" in command) {
      command.action();
      this.emitter.emit("commandExecuted", command);
    } else
      this._logFn("Unknown command type", command);
  }
  getDirection() {
    return getDirection({
      x: this._x,
      y: this._y,
      sx: this._lastX,
      sy: this._lastY
    }, this._selectedCommands.length);
  }
  _setStart(x = this._x, y = this._y) {
    this._lastX = x;
    this._lastY = y;
  }
  setRadius(radius) {
    this._body.radius = radius;
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
    { name: "Explore the cave", go: "cave" }
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
    { name: "Enter the dungeon", go: "dungeon" },
    { name: "Return to the start", go: "start" },
    { name: "Visit the library", go: "library" },
    { name: "Use the lavatory", action: () => alert("You hear the sound of running water.") }
  ],
  village: [
    { name: "Talk to the blacksmith", action: () => alert("Blacksmith: 'How can I help you with the new month?'") },
    { name: "Visit the shopkeeper", action: () => alert("Shopkeeper: 'Welcome to my humble shop.'") },
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
menu.distanceAccept = false;
menu.emitter.on("distance", (distance) => {
  const maxDistance = wolf.clientWidth - 10;
  const percent = Math.min(1, distance / maxDistance);
  wolf.style.setProperty("--alpha", percent.toString());
});
export {
  commands
};

//# debugId=DC0EA896254D8F0B64756E2164756E21
//# sourceMappingURL=index.js.map
