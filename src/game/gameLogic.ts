import { Player } from "./actors/Player";
import { Coin } from "./actors/Coin";
import { Vec } from "./utility/Vec";
import { Lava } from "./actors/Lava";
import { drawGrid, elt } from "./utility/helperFunctions";

const levelChars: LevelChars = {
  ".": "empty",
  "#": "wall",
  "+": "laval",
  "@": Player,
  o: Coin,
  "=": Lava,
  "|": Lava,
  v: Lava,
};

// Stores a level
class Level {
  height: number;
  width: number;
  startActors: Array<Lava | Player | Coin>;
  rows: Array<Array<string>>;

  constructor(plan: string) {
    const rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((rows, y): Array<string> => {
      return rows.map((ch, x): string => {
        let type = levelChars[ch];
        if (typeof type !== "string") {
          const pos = new Vec(x, y);
          const createdType = type.create(pos, ch);
          if (createdType !== undefined) this.startActors.push(createdType);
          else throw new Error("createdType is 'undefined'");
          type = "empty";
        }
        return type;
      });
    });
  }
}

class State {
  level: Level;
  actors: Actors;
  status: string;

  constructor(level: Level, actors: Actors, status: string) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level: Level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find((a) => a.type === "player");
  }
}

// const simpleLevel = new Level(simpleLevelPlan);
// console.log(`${simpleLevel.width} by ${simpleLevel.height}`)
// 22 by 9

class DOMDisplay {
  dom: HTMLElement;
  actorLayer: null;

  constructor(parent: HTMLElement, level: Level) {
    this.dom = elt("div", { class: "game" }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() {
    this.dom.remove();
  }
}

export { State, DOMDisplay, type Level };
