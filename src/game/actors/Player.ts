import State from "../utility/State";
import Vec from "../utility/Vec";

export default class Player {
  private readonly playerXSpeed = 7;
  private readonly gravity = 30;
  private readonly jumpSpeed = 17;
  readonly size: Vec = new Vec(0.8, 1.5);
  pos: Vec;
  speed: Vec;

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

  update(time: number, state: State, keys: { [key: string]: string }) {
    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= this.playerXSpeed;
    if (keys.ArrowRight) xSpeed += this.playerXSpeed;
    let pos = this.pos;
    const movedX = pos.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, "wall")) pos = movedX;

    let ySpeed = this.speed.y + time * this.gravity;
    const movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, "wall")) pos = movedY;
    else if (keys.ArrowUp && ySpeed > 0) ySpeed = -this.jumpSpeed;
    else ySpeed = 0;

    return new Player(pos, new Vec(xSpeed, ySpeed));
  }
}
