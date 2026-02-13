# Public and Private API Documentation

## API Stability Guarantees

- **Public API**: Functions and properties that do not start with an underscore (`_`) are considered part of the public API. These are stable and guaranteed to maintain backward compatibility between versions unless noted in the changelog.

- **Private API**: Functions and properties that start with an underscore (`_`) are considered private implementation details. These may change or be removed between versions without notice.

## Public API (Stable)

### WolfMenuCore Class

#### Properties

- `emitter`: Event emitter for WolfMenu events
- `distanceAccept`: Boolean to control if distance-based command selection is enabled
- `distanceCount`: Number of pixels required to trigger distance-based selection
- `startCommand`: String representing the default command to start with
- `threshold`: Threshold value for direction calculation
- `_commands`: Map of commands (constructor parameter)

#### Methods

- `init()`: Initialize the menu event listeners
- `handleMove(radius?: number)`: Handle mouse movement logic, returns an object with delta, direction, and distance
- `openMenu(commandName: string)`: Open the menu with a specific command
- `selected()`: Handle command selection
- `getDirection(delta?: Delta)`: Get direction based on movement delta
- `setStart(x: number, y: number)`: Set the starting coordinates
- `go(commandName: string)`: Navigate to a command submenu

### WolfMenu Class (Browser-specific extension of WolfMenuCore)

#### Properties

- `body`: Instance of WolfMenuBody for UI rendering
- `_element`: HTMLDivElement element for the menu

#### Methods

- `init()`: Initialize the menu event listeners
- `setRadius(radius: number)`: Set the radius of the menu
- `handleMove()`: Handle mouse movement logic with UI updates, returns an object with delta, direction, and distance

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

- `parent`: HTMLElement that serves as the parent container
- `body`: Array of HTMLDivElement elements for menu items
- `selectedClass`: CSS class name for selected items
- `radius`: Menu radius value
- `_actualRadius`: Actual calculated radius
- `blockOpen`: Boolean to control menu opening (document click listener)

#### Methods

- `genBody(commands: Command[], cancelCommand: Command)`: Generate the menu body with commands
- `clearSelected()`: Clear the selected state from all items
- `select(i: number)`: Select an item by index
- `openMenu(commandName: string)`: Open the menu with a specific command (browser-specific)

## Private API (Unstable)

### WolfMenuCore Class

#### Properties

- `_x`: Current X coordinate
- `_y`: Current Y coordinate
- `_startX`: Menu start X coordinate
- `_startY`: Menu start Y coordinate
- `_active`: Boolean indicating if menu is active
- `_selectedCommands`: Currently selected commands
- `_logFn`: Logging function (default: console.log)
- `_cancelCommand`: Cancel command object

#### Methods

- `setStart(x = this._x, y = this._y)`: Set the starting coordinates with default values

### WolfMenu Class (Browser-specific)

#### Properties

- `_element`: HTMLDivElement element for the menu

#### Methods

- `_initMove()`: Initialize mouse movement listeners
- `_initClick()`: Initialize click listeners

### Utility Functions (in utils.ts)

- `getAngle(delta: Delta)`: Calculate angle from a delta (private helper)
- `getSector(angle: number, steps: number)`: Calculate sector from an angle and steps (private helper)
