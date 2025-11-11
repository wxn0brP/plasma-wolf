# Plasma Wolf

A radial context menu library that appears with a click and allows direction-based command selection. This project implements a dynamic, 8-directional menu system that can be integrated into web applications.

## Features

- **Radial Menu Interface**: Commands are arranged in directions around a center point
- **Direction-Based Navigation**: Move your mouse in a specific direction to highlight commands
- **Context-Aware Menus**: Different menu states with different available commands
- **Flexible Command System**: Support for both action commands and navigation commands

## How It Works

The Plasma Wolf menu appears when triggered at a specific location on the screen. After activation:

1. The menu appears at the specified location
2. Move your mouse in a direction to highlight a command
3. Click to execute the highlighted command
4. The menu disappears and the selected action is performed

Commands can either trigger an action (like executing a function) or navigate to a different context menu.

## Installation

```bash
git clone https://github.com/wxn0brP/plasma-wolf.git
cd plasma-wolf
bun install
suglite
```

## Architecture

The system consists of several key components:

- **WolfMenu class**: Core logic for handling mouse movements, command execution, and menu display
- **Command system**: Structured way to define actions and navigation commands
- **Direction detection**: Algorithm that determines which direction the mouse moved in
- **HTML structure**: Predefined div elements for each direction

## Command Structure

Commands can be of two types:
- **Action Commands**: Execute a function when selected
- **Navigation Commands**: Switch to a different menu context

Example command definition:
```typescript
{
    name: "Execute action",    // Display name
    action: () => console.log("Action executed")  // Execute function
}
```

or

```typescript
{
    name: "Navigate",          // Display name
    go: "other_context"       // Navigate to different context
}
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.