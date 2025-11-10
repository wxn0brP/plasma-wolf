export interface CommandBase {
    name: string;
};

export interface ActionCommand extends CommandBase {
    action?: () => void;
}

export interface GoCommand extends CommandBase {
    go?: string;
}

export type Command = ActionCommand | GoCommand;
export type CommandMap = Record<string, Command[]>;