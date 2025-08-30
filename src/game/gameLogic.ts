import { Player } from "./actors/Player";
import { Coin } from "./actors/Coin";
import { Vec } from "./utility/Vec";
import { Lava } from "./actors/Lava";

type Actor = Player | Lava | Coin;
type Actors = Array<Actor>;
type TypeOfActors = typeof Player | typeof Lava | typeof Coin;

interface LevelChars {
  [key: string]: string | TypeOfActors;
  ".": string;
  "#": string;
  "+": string;
  "@": typeof Player;
  o: typeof Coin;
  "=": typeof Lava;
  "|": typeof Lava;
  v: typeof Lava;
}

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

export { Level, State };
