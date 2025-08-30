import State from "../utility/State";
import Vec from "../utility/Vec";

export default class Coin {
  private readonly wobbleSpeed = 8;
  private readonly wobbleDist = 0.07;
  readonly size = new Vec(0.6, 0.6);
  pos: Vec;
  basePos: Vec;
  wobble: number;

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

  update(time: number) {
    const wobble = this.wobble + time * this.wobbleSpeed;
    const wobblePos = Math.sin(wobble) * this.wobbleDist;
    return new Coin(
      this.basePos.plus(new Vec(0, wobblePos)),
      this.basePos,
      wobble
    );
  }
}
