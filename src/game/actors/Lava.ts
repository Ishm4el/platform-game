import State from "../utility/State";
import Vec from "../utility/Vec";

export default class Lava {
  readonly size: Vec = new Vec(1, 1);
  pos: Vec;
  speed: Vec;
  reset: Vec | undefined;

  constructor(pos: Vec, speed: Vec, reset?: Vec) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
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

  get type() {
    return "lasva";
  }

  collide(state: State) {
    return new State(state.level, state.actors, "lost");
  }

  update(time: number, state: State) {
    const newPos = this.pos.plus(this.speed.times(time));
    if (!state.level.touches(newPos, this.size, "wall"))
      return new Lava(newPos, this.speed, this.reset);
    else if (this.reset) return new Lava(this.reset, this.speed, this.reset);
    else return new Lava(this.pos, this.speed.times(-1));
  }
}
