// src/utils.ts
class Delta {
  dx;
  dy;
  constructor(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }
}
function getDirection(delta, steps, threshold = 55) {
  const { dx, dy } = delta;
  if (dx === 0 && dy === 0)
    return steps;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (absDx < threshold && absDy < threshold)
    return steps;
  const angle = getAngle(delta);
  const correction = 360 / steps / 2;
  const adjustedAngle = angle + 90 + correction;
  return getSector(adjustedAngle, steps);
}
function getAngle(delta) {
  let angle = Math.atan2(delta.dy, delta.dx);
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
function getDistance({ dx, dy }) {
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
function getDelta(startX, startY, endX, endY) {
  return new Delta(endX - startX, endY - startY);
}
function calculateRadius(steps) {
  const base = 102;
  const perStep = 6;
  let radius = base + perStep * steps;
  if (steps > 8)
    radius += (steps - 8) * 4;
  return radius;
}

// src/html.ts
class WolfMenuBody {
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
    for (let i = 0;i < commands.length; i++) {
      const div2 = document.createElement("div");
      div2.classList.add("wolf-menu-item");
      div2.style.left = `${positions[i * 2]}px`;
      div2.style.top = `${positions[i * 2 + 1]}px`;
      div2.innerHTML = commands[i].name;
      this.parent.appendChild(div2);
      this.body.push(div2);
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
    this.body.forEach((div) => div.classList.remove(this.selectedClass));
  }
  select(i) {
    this.body[i].classList.add(this.selectedClass);
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
  _cancelCommand = { name: "Cancel", action: () => {} };
  body;
  emitter = new VEE;
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
    } else
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
menu.emitter.on("distance", (distance) => {
  const maxDistance = menu.body._actualRadius + menu.distanceCount;
  const percent = Math.min(1, distance / maxDistance);
  wolf.style.setProperty("--alpha", percent.toString());
});
export {
  commands
};

//# debugId=BCF392311915E70664756E2164756E21
//# sourceMappingURL=index.js.map
