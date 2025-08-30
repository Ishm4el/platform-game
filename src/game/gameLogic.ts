import { Player } from "./actors/Player";
import { Coin } from "./actors/Coin";
import { Vec } from "./utility/Vec";
import { Lava } from "./actors/Lava";

interface LevelChars {
  [key: string]: string | typeof Player | typeof Coin | typeof Lava;
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

export { Level };
