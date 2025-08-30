import { Vec } from "../utility/Vec";

export class Lava {
  pos: Vec;
  speed: Vec;
  reset: Vec | undefined;
  size: Vec = new Vec(1, 1);

  constructor(pos: Vec, speed: Vec, reset?: Vec) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() {
    return "lava";
  }

  static create(pos: Vec, ch: string) {
    if (ch === "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch === "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}
