export interface CommandBase {
    name: string;
};

export interface ActionCommand extends CommandBase {
    action: () => void;
}

export interface GoCommand extends CommandBase {
    go: string;
}

export type Command = ActionCommand | GoCommand;
export type CommandMap = Record<string, Command[]>;

export type WolfMenuEvents = {
    menuOpened: (commandName: string) => void;
    menuClosed: () => void;
    commandSelected: (command: Command) => void;
    commandExecuted: (command: Command) => void;
    initialized: () => void;
    distance: (distance: number, direction: number) => void;
}

export interface MousePos {
    x: number;
    y: number;
    sx: number;
    sy: number;
}