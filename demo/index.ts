import { uiMsg } from "@wxn0brp/flanker-dialog";
import "@wxn0brp/flanker-dialog/style.css";
import "@wxn0brp/flanker-ui/html";
import { WolfMenu } from "../src/index";
import { CommandMap } from "../src/types";

export const commands: CommandMap = {
    start: [
        { name: "Go to the forest", go: "forest" },
        { name: "Enter the castle", go: "castle" },
        { name: "Return to the village", go: "village" },
        { name: "Explore the cave", go: "cave" },
    ],
    forest: [
        { name: "Gather berries", action: () => uiMsg("You gathered some delicious berries.") },
        { name: "Take a rest", action: () => uiMsg("You took a short rest.") },
        { name: "Find a stream", action: () => uiMsg("You found a stream with cool, clear water.") },
        { name: "Go deeper in the forest", go: "deep_forest" },
        { name: "Return to the start", go: "start" },
        { name: "Light a fire", action: () => uiMsg("You lit a fire and felt warm.") },
        { name: "Listen to the forest sounds", action: () => uiMsg("You listened carefully and heard some soothing sounds.") },
        { name: "Take a break", action: () => uiMsg("You took a short break.") },
    ],
    castle: [
        { name: "Enter the throne room", go: "throne_room" },
        { name: "Talk to the guard", action: () => uiMsg("The guard says: 'You cannot pass without permission.'") },
        { name: "Explore the garden", action: () => uiMsg("The garden is empty and quiet.") },
        { name: "Enter the dungeon", go: "dungeon" },
        { name: "Return to the start", go: "start" },
        { name: "Visit the library", go: "library" },
        { name: "Use the lavatory", action: () => uiMsg("You hear the sound of running water.") },
    ],
    village: [
        { name: "Talk to the blacksmith", action: () => uiMsg("Blacksmith: 'How can I help you with the new month?'") },
        { name: "Visit the shopkeeper", action: () => uiMsg("Shopkeeper: 'Welcome to my humble shop.'") },
        { name: "Feed the beggar", action: () => uiMsg("The beggar thanks you for the food.") },
        { name: "Return to the start", go: "start" },
        { name: "Get a drink", action: () => uiMsg("You take a refreshing drink.") },
        { name: "Take a walk at night", go: "forest" },
    ],
    cave: [
        { name: "Go deeper", go: "deep_cave" },
        { name: "Write on the wall", action: () => uiMsg("You write an old rhyme on the wall.") },
        { name: "Light a match", action: () => uiMsg("The match flickers and casts a small, warm glow.") },
        { name: "Shout", action: () => uiMsg("Your voice echoes off the walls... and something else.") },
        { name: "Return to the start", go: "start" },
        { name: "Bang on the pipe", action: () => uiMsg("The pipe makes a loud, hollow clang.") },
        { name: "Repeat after the echo", action: () => uiMsg("The echo repeats your words back to you.") },
        { name: "Take a break at the entrance", action: () => uiMsg("You take a short break at the entrance.") },
    ],
}

const wolf = qs(".wolf");
const menu = new WolfMenu(commands, wolf);
menu.init();

menu.emitter.on("distance", (distance: number) => {
    const maxDistance = menu.body._actualRadius + menu.distanceCount;

    const percentAccent = Math.min(
        100,
        Math.max(0, Math.round(distance / maxDistance * 100))
    );

    const color = `color-mix(in srgb, var(--accent) ${percentAccent}%, white)`;
    wolf.style.setProperty("--color", color);
});