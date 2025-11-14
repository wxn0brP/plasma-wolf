import { prompt, uiMsg } from "@wxn0brp/flanker-dialog";
import "@wxn0brp/flanker-dialog/style.css";
import "@wxn0brp/flanker-ui/html";
import { WolfMenu } from "../src/index";
import { CommandMap } from "../src/types";

const lang = new URLSearchParams(window.location.search).has("lang");
let resource: any;
if (!lang) {
    resource = await fetch(`./resource.json`).then(res => res.json());
} else {
    const link = location.origin + (location.pathname + "/").replace("//", "/") + "resource.json";
    const data = await prompt(`
Instruction to use your own lang.
1. Open <a href="${link}" target="_blank">${link}</a>
2. Translate the text in the file (e.g. Use AI to translate)
3. Paste the result here
`.trim().replaceAll("\n", "<br>"));
    if (data) {
        try {
            resource = JSON.parse(data);
        } catch (e) {
            alert("Invalid JSON: " + e);
            location.reload();
        }
    } else {
        location.reload();
    }
}

let gameState = {
    hasTorch: false,
    hasSword: false,
    hasKey: false,
    wolfDefeated: false,
    guardBribed: false
};

export const commands: CommandMap = {
    start: [
        { name: resource.c.start[0], go: "forest" },
        { name: resource.c.start[1], go: "castle" },
        { name: resource.c.start[2], go: "village" },
        { name: resource.c.start[3], go: "cave" },
    ],
    forest: [
        { name: resource.c.forest[0], action: () => uiMsg(resource.m.gatherBerries) },
        { name: resource.c.forest[1], action: searchForest },
        { name: resource.c.forest[2], action: () => uiMsg(resource.m.findStream) },
        { name: resource.c.forest[3], go: "deep_forest" },
        { name: resource.c.forest[4], go: "start" },
    ],
    deep_forest: [
        { name: resource.c.deep_forest[0], action: encounterWolf },
        { name: resource.c.deep_forest[1], action: () => uiMsg(resource.m.lookForHerbs) },
        { name: resource.c.deep_forest[2], go: "forest" },
    ],
    castle: [
        { name: resource.c.castle[0], go: "throne_room" },
        { name: resource.c.castle[1], action: talkToGuard },
        { name: resource.c.castle[2], action: () => uiMsg(resource.m.exploreGarden) },
        { name: resource.c.castle[3], go: "dungeon" },
        { name: resource.c.castle[4], go: "start" },
    ],
    throne_room: [
        { name: resource.c.throne_room[0], action: approachThrone },
        { name: resource.c.throne_room[1], action: examineChest },
        { name: resource.c.throne_room[2], go: "castle" },
    ],
    dungeon: [
        { name: resource.c.dungeon[0], action: searchDungeon },
        { name: resource.c.dungeon[1], action: () => uiMsg(resource.m.listenToVoices) },
        { name: resource.c.dungeon[2], go: "castle" },
    ],
    village: [
        { name: resource.c.village[0], action: talkToBlacksmith },
        { name: resource.c.village[1], action: () => uiMsg(resource.m.talkToShopkeeper) },
        { name: resource.c.village[2], action: helpBeggar },
        { name: resource.c.village[3], go: "start" },
    ],
    cave: [
        { name: resource.c.cave[0], go: "deep_cave" },
        { name: resource.c.cave[1], action: searchCaveEntrance },
        {
            name: resource.c.cave[2], action: () => {
                if (gameState.hasTorch) {
                    uiMsg(resource.m.lightMatchWithTorch);
                } else {
                    uiMsg(resource.m.lightMatchWithoutTorch);
                }
            }
        },
        { name: resource.c.cave[3], go: "start" },
    ],
    deep_cave: [
        { name: resource.c.deep_cave[0], action: exploreLeftTunnel },
        { name: resource.c.deep_cave[1], action: exploreRightTunnel },
        { name: resource.c.deep_cave[2], go: "cave" },
    ]
};

function searchForest() {
    const foundItem = Math.random() > 0.5;
    if (foundItem && !gameState.hasTorch) {
        gameState.hasTorch = true;
        uiMsg(resource.m.searchForestFound);
    } else {
        uiMsg(resource.m.searchForestNotFound);
    }
}

function encounterWolf() {
    if (gameState.hasSword && !gameState.wolfDefeated) {
        gameState.wolfDefeated = true;
        uiMsg(resource.m.encounterWolfWithSword);
        commands.deep_forest = commands.deep_forest.filter(cmd => cmd.name !== resource.c.deep_forest[0]);
        commands.deep_forest.unshift({
            name: resource.m.examineWolfsDen,
            action: () => uiMsg(resource.m.examineWolfsDen)
        });
    } else if (!gameState.wolfDefeated) {
        uiMsg(resource.m.encounterWolfWithoutSword);
    }
}

function talkToGuard() {
    if (gameState.guardBribed) {
        uiMsg(resource.m.talkToGuardBribed);
    } else {
        uiMsg(resource.m.talkToGuardNotBribed);
    }
}

function talkToBlacksmith() {
    if (!gameState.hasSword) {
        gameState.hasSword = true;
        uiMsg(resource.m.talkToBlacksmithNoSword);
    } else {
        uiMsg(resource.m.talkToBlacksmithWithSword);
    }
}

function helpBeggar() {
    uiMsg(resource.m.helpBeggar);
    if (!commands.castle.find(cmd => cmd.name === resource.dynamicCommands.bribeGuard)) {
        commands.castle.push({
            name: resource.dynamicCommands.bribeGuard,
            action: () => {
                gameState.guardBribed = true;
                uiMsg(resource.m.bribeGuard);
            }
        });
    }
}

function approachThrone() {
    if (gameState.guardBribed || gameState.hasKey) {
        uiMsg(resource.m.approachThroneAuthorized);
    } else {
        uiMsg(resource.m.approachThroneUnauthorized);
    }
}

function examineChest() {
    if (gameState.hasKey) {
        uiMsg(resource.m.examineChestWithKey);
    } else {
        uiMsg(resource.m.examineChestWithoutKey);
    }
}

function searchDungeon() {
    if (!gameState.hasKey) {
        gameState.hasKey = true;
        uiMsg(resource.m.searchDungeonFound);
    } else {
        uiMsg(resource.m.searchDungeonNotFound);
    }
}

function searchCaveEntrance() {
    if (!gameState.hasTorch) {
        uiMsg(resource.m.searchCaveWithoutTorch);
    } else {
        uiMsg(resource.m.searchCaveWithTorch);
    }
}

function exploreLeftTunnel() {
    if (gameState.hasTorch) {
        uiMsg(resource.m.exploreLeftTunnelWithTorch);
    } else {
        uiMsg(resource.m.exploreLeftTunnelWithoutTorch);
    }
}

function exploreRightTunnel() {
    uiMsg(resource.m.exploreRightTunnel);
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