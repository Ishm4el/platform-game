import Vec from "../utility/Vec";

export default class Player {
  pos: Vec;
  speed: Vec;
  size: Vec = new Vec(0.8, 1.5);

  constructor(pos: Vec, speed: Vec) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() {
    return "player";
  }

  static create(pos: Vec) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
}
