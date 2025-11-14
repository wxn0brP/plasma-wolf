import { uiMsg } from "@wxn0brp/flanker-dialog";
import "@wxn0brp/flanker-dialog/style.css";
import "@wxn0brp/flanker-ui/html";
import { WolfMenu } from "../src/index";
import { CommandMap } from "../src/types";

let gameState = {
    hasTorch: false,
    hasSword: false,
    hasKey: false,
    wolfDefeated: false,
    guardBribed: false
};

export const commands: CommandMap = {
    start: [
        { name: "Go to the forest", go: "forest" },
        { name: "Enter the castle", go: "castle" },
        { name: "Return to the village", go: "village" },
        { name: "Explore the cave", go: "cave" },
    ],
    forest: [
        { name: "Gather berries", action: () => uiMsg("You gathered some delicious berries. They look tasty!") },
        { name: "Search for useful items", action: searchForest },
        { name: "Find a stream", action: () => uiMsg("You found a stream with cool, clear water. You take a drink.") },
        { name: "Go deeper in the forest", go: "deep_forest" },
        { name: "Return to the start", go: "start" },
    ],
    deep_forest: [
        { name: "Investigate strange sounds", action: encounterWolf },
        { name: "Look for herbs", action: () => uiMsg("You find some medicinal herbs that might be useful.") },
        { name: "Return to forest edge", go: "forest" },
    ],
    castle: [
        { name: "Enter the throne room", go: "throne_room" },
        { name: "Talk to the guard", action: talkToGuard },
        { name: "Explore the garden", action: () => uiMsg("The garden is beautiful but empty. You notice a small key hidden under a bench!") },
        { name: "Enter the dungeon", go: "dungeon" },
        { name: "Return to the start", go: "start" },
    ],
    throne_room: [
        { name: "Approach the throne", action: approachThrone },
        { name: "Examine the treasure chest", action: examineChest },
        { name: "Return to castle entrance", go: "castle" },
    ],
    dungeon: [
        { name: "Search the cells", action: searchDungeon },
        { name: "Listen for voices", action: () => uiMsg("You hear faint whispers but can't make out the words.") },
        { name: "Return upstairs", go: "castle" },
    ],
    village: [
        { name: "Talk to the blacksmith", action: talkToBlacksmith },
        { name: "Visit the shopkeeper", action: () => uiMsg("Shopkeeper: 'Welcome! I have various goods for sale.'") },
        { name: "Help the beggar", action: helpBeggar },
        { name: "Return to the start", go: "start" },
    ],
    cave: [
        { name: "Go deeper", go: "deep_cave" },
        { name: "Search near entrance", action: searchCaveEntrance },
        {
            name: "Light a match", action: () => {
                if (gameState.hasTorch) {
                    uiMsg("Your torch illuminates the cave perfectly.");
                } else {
                    uiMsg("The match flickers and casts a small, warm glow, but quickly burns out.");
                }
            }
        },
        { name: "Return to the start", go: "start" },
    ],
    deep_cave: [
        { name: "Explore the left tunnel", action: exploreLeftTunnel },
        { name: "Explore the right tunnel", action: exploreRightTunnel },
        { name: "Return to cave entrance", go: "cave" },
    ]
};

function searchForest() {
    const foundItem = Math.random() > 0.5;
    if (foundItem && !gameState.hasTorch) {
        gameState.hasTorch = true;
        uiMsg("You found an old but usable torch! This will help in dark places.");
    } else {
        uiMsg("You search the area but find nothing of interest.");
    }
}

function encounterWolf() {
    if (gameState.hasSword && !gameState.wolfDefeated) {
        gameState.wolfDefeated = true;
        uiMsg("With your sword, you bravely defeat the wolf! The forest is safe now.");
        commands.deep_forest = commands.deep_forest.filter(cmd => cmd.name !== "Investigate strange sounds");
        commands.deep_forest.unshift({
            name: "Examine wolf's den",
            action: () => uiMsg("In the den you find a small treasure! Your adventure is complete!")
        });
    } else if (!gameState.wolfDefeated) {
        uiMsg("A fierce wolf appears! You need a weapon to face it. You retreat quickly.");
    }
}

function talkToGuard() {
    if (gameState.guardBribed) {
        uiMsg("Guard: 'Welcome back, friend. The throne room awaits.'");
    } else {
        uiMsg("Guard: 'Halt! None may pass without the king's permission... though I might be persuaded for some berries.'");
    }
}

function talkToBlacksmith() {
    if (!gameState.hasSword) {
        gameState.hasSword = true;
        uiMsg("Blacksmith: 'Ah, a brave adventurer! Take this sword - it might help you on your journey.'");
    } else {
        uiMsg("Blacksmith: 'That sword looks good on you! Come back if you need it sharpened.'");
    }
}

function helpBeggar() {
    uiMsg("Beggar: 'Thank you for your kindness! I heard the castle guard has a weakness for forest berries...'");
    if (!commands.castle.find(cmd => cmd.name === "Bribe guard with berries")) {
        commands.castle.push({
            name: "Bribe guard with berries",
            action: () => {
                gameState.guardBribed = true;
                uiMsg("The guard happily accepts the berries and lets you pass to the throne room!");
            }
        });
    }
}

function approachThrone() {
    if (gameState.guardBribed || gameState.hasKey) {
        uiMsg("You approach the empty throne. On it rests a royal decree granting you hero status!");
    } else {
        uiMsg("The guard stops you: 'I cannot let you approach the throne without proper authorization!'");
    }
}

function examineChest() {
    if (gameState.hasKey) {
        uiMsg("You unlock the chest with your key and find legendary treasure! You win!");
    } else {
        uiMsg("The treasure chest is securely locked. You'll need a key to open it.");
    }
}

function searchDungeon() {
    if (!gameState.hasKey) {
        gameState.hasKey = true;
        uiMsg("In a dusty corner, you find an old iron key! This might open something important.");
    } else {
        uiMsg("The dungeon cells are empty and creepy. You don't want to stay here long.");
    }
}

function searchCaveEntrance() {
    if (!gameState.hasTorch) {
        uiMsg("It's too dark to see anything properly. You need a light source.");
    } else {
        uiMsg("With your torch, you find ancient markings on the wall pointing to hidden tunnels.");
    }
}

function exploreLeftTunnel() {
    if (gameState.hasTorch) {
        uiMsg("The left tunnel leads to a beautiful crystal cavern. The crystals glow in your torchlight.");
    } else {
        uiMsg("It's pitch black! You stumble in the darkness and decide to turn back.");
    }
}

function exploreRightTunnel() {
    uiMsg("The right tunnel slopes downward and ends at an underground lake. The water seems to glow with a faint blue light.");
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