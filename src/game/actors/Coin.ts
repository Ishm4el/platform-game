import State from "../utility/State";
import Vec from "../utility/Vec";

export default class Coin {
  pos: Vec;
  basePos: Vec;
  wobble: number;
  size = new Vec(0.6, 0.6);

  constructor(pos: Vec, basePos: Vec, wobble: number) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  static create(pos: Vec) {
    const basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }

  get type() {
    return "coin";
  }

  collide(state: State) {
    const filtered = state.actors.filter((a) => a != this);
    let status = state.status;
    if (!filtered.some((a) => a.type == "coin")) status = "won";
    return new State(state.level, filtered, status);
  }
}
