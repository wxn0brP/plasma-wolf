import { WolfMenu } from "../src/index";
import { CommandMap } from "../src/types";
import "@wxn0brp/flanker-ui/html";

export const commands: CommandMap = {
    start: [
        { name: "Go to the forest", go: "forest" },
        { name: "Enter the castle", go: "castle" },
        { name: "Return to the village", go: "village" },
        { name: "Explore the cave", go: "cave" },
        { name: "Take a look around", action: () => alert("Take a look around... it's pretty quiet.") },
        { name: "Start again", action: () => alert("Let's start again from the beginning.") },
        { name: "Check your inventory", action: () => alert("Make sure you have only your map and a flashlight.") },
        { name: "Finish", action: () => alert("You're done! Congratulations on finishing the adventure!") },
    ],
    forest: [
        { name: "Gather berries", action: () => alert("You gathered some delicious berries.") },
        { name: "Take a rest", action: () => alert("You took a short rest.") },
        { name: "Find a stream", action: () => alert("You found a stream with cool, clear water.") },
        { name: "Go deeper in the forest", go: "deep_forest" },
        { name: "Return to the start", go: "start" },
        { name: "Light a fire", action: () => alert("You lit a fire and felt warm.") },
        { name: "Listen to the forest sounds", action: () => alert("You listened carefully and heard some soothing sounds.") },
        { name: "Take a break", action: () => alert("You took a short break.") },
    ],
    castle: [
        { name: "Enter the throne room", go: "throne_room" },
        { name: "Talk to the guard", action: () => alert("The guard says: 'You cannot pass without permission.'") },
        { name: "Explore the garden", action: () => alert("The garden is empty and quiet.") },
        { name: "Enter the armory", go: "armory" },
        { name: "Enter the dungeon", go: "dungeon" },
        { name: "Return to the start", go: "start" },
        { name: "Visit the library", go: "library" },
        { name: "Use the lavatory", action: () => alert("You hear the sound of running water.") },
    ],
    village: [
        { name: "Talk to the blacksmith", action: () => alert("Blacksmith: 'How can I help you with the new month?'") },
        { name: "Enter the tavern", go: "tavern" },
        { name: "Visit the shopkeeper", action: () => alert("Shopkeeper: 'Welcome to my humble shop.'") },
        { name: "Talk to the children", action: () => alert("Children: 'We're so happy to see you!'") },
        { name: "Feed the beggar", action: () => alert("The beggar thanks you for the food.") },
        { name: "Return to the start", go: "start" },
        { name: "Get a drink", action: () => alert("You take a refreshing drink.") },
        { name: "Take a walk at night", go: "forest" },
    ],
    cave: [
        { name: "Go deeper", go: "deep_cave" },
        { name: "Write on the wall", action: () => alert("You write an old rhyme on the wall.") },
        { name: "Light a match", action: () => alert("The match flickers and casts a small, warm glow.") },
        { name: "Shout", action: () => alert("Your voice echoes off the walls... and something else.") },
        { name: "Return to the start", go: "start" },
        { name: "Bang on the pipe", action: () => alert("The pipe makes a loud, hollow clang.") },
        { name: "Repeat after the echo", action: () => alert("The echo repeats your words back to you.") },
        { name: "Take a break at the entrance", action: () => alert("You take a short break at the entrance.") },
    ],
}

const wolf = qs(".wolf");
const menu = new WolfMenu(commands, wolf);
menu.init();

menu.emitter.on("distance", (distance: number) => {
    const maxDistance = wolf.clientWidth - 10;
    const percent = Math.min(1, distance / maxDistance);
    wolf.style.setProperty("--alpha", percent.toString());
});