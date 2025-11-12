# Public and Private API Documentation

## API Stability Guarantees

- **Public API**: Functions and properties that do not start with an underscore (`_`) are considered part of the public API. These are stable and guaranteed to maintain backward compatibility between versions unless noted in the changelog.

- **Private API**: Functions and properties that start with an underscore (`_`) are considered private implementation details. These may change or be removed between versions without notice.

## Public API (Stable)

### WolfMenu Class

#### Properties

- `emitter`: Event emitter for WolfMenu events
- `distanceAccept`: Boolean to control if distance-based command selection is enabled
- `distanceCount`: Number of pixels required to trigger distance-based selection
- `startCommand`: String representing the default command to start with

#### Methods

- `init()`: Initialize the menu event listeners
- `getDirection(delta?: Delta)`: Get direction based on movement delta
- `setRadius(radius: number)`: Set the radius of the menu

### Utility Functions (in utils.ts)

- `getDirection(delta: Delta, steps: number, threshold = 55)`: Calculate direction based on delta and number of steps
- `getDistance({ dx, dy }: Delta)`: Calculate the distance from a delta
- `calculatePositions(radius: number, steps: number)`: Calculate positions for menu items
- `getDelta(startX: number, startY: number, endX: number, endY: number)`: Calculate the delta between two points
- `calculateRadius(steps: number)`: Calculate the radius based on number of steps

### Types (in types.ts)

- `CommandBase`: Interface for base command properties
- `ActionCommand`: Interface for commands with actions
- `GoCommand`: Interface for commands that navigate to other commands
- `Command`: Union type of ActionCommand and GoCommand
- `CommandMap`: Type for mapping command names to command arrays
- `WolfMenuEvents`: Event type definitions

### WolfMenuBody Class

#### Properties

- `selectedClass`: CSS class name for selected items
- `radius`: Menu radius value

#### Methods

- `genBody(commands: Command[], cancelCommand: Command)`: Generate the menu body with commands
- `clearSelected()`: Clear the selected state from all items
- `select(i: number)`: Select an item by index

## Private API (Unstable)

### WolfMenu Class

#### Properties

- `_commands`: Map of commands
- `_element`: HTMLDivElement element for the menu
- `_x`: Current X coordinate
- `_y`: Current Y coordinate
- `_startX`: Menu start X coordinate
- `_startY`: Menu start Y coordinate
- `_active`: Boolean indicating if menu is active
- `_selectedCommands`: Currently selected commands
- `_logFn`: Logging function (default: console.log)
- `_cancelCommand`: Cancel command object

#### Methods

- `_initMove()`: Initialize mouse movement listeners
- `_initClick()`: Initialize click listeners
- `_openMenu(commandName: string = this.startCommand)`: Open the menu with a specific command
- `_selected()`: Handle command selection
- `_setStart(x = this._x, y = this._y)`: Set the starting coordinates

### WolfMenuBody Class

#### Properties

- `_actualRadius`: Actual calculated radius

#### Methods

- `_getRadius(steps: number)`: Get the calculated radius for a number of steps

### Utility Functions (in utils.ts)

- `getAngle(delta: Delta)`: Calculate angle from a delta (private helper)
- `getSector(angle: number, steps: number)`: Calculate sector from an angle and steps (private helper)