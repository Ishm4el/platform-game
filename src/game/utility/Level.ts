import type { TypeOfActors } from "../actors/Actors";
import Player from "../actors/Player";
import Coin from "../actors/Coin";
import Lava from "../actors/Lava";
import Vec from "./Vec";

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
  "+": "lava",
  "@": Player,
  o: Coin,
  "=": Lava,
  "|": Lava,
  v: Lava,
};

// Stores a level
export default class Level {
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

  touches = (pos: Vec, size: Vec, type: string) => {
    const xStart = Math.floor(pos.x);
    const xEnd = Math.ceil(pos.x + size.x);
    const yStart = Math.floor(pos.y);
    const yEnd = Math.ceil(pos.y + size.y);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        const isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
        const here = isOutside ? "wall" : this.rows[y][x];
        if (here == type) return true;
      }
    }
    return false;
  };
}
