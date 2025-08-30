import Level from "./Level";
import type { Actors, Actor } from "../actors/Actors";
import Player from "../actors/Player";

export default class State {
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
    const thePlayer = this.actors.find((a) => a.type === "player");
    if (thePlayer instanceof Player) return thePlayer;
    else throw new Error("Player was not found!");
  }

  overlap(actor1: Actor, actor2: Actor) {
    return (
      actor1.pos.x + actor1.size.x > actor2.pos.x &&
      actor1.pos.x < actor2.pos.x + actor2.size.x &&
      actor1.pos.y + actor1.size.y > actor2.pos.y &&
      actor1.pos.y < actor2.pos.y + actor2.size.y
    );
  }

  update(time: number, keys) {
    const actors = this.actors.map((actor) => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);

    if (newState.status != "playing") return newState;

    const player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava"))
      return new State(this.level, actors, "lost");

    for (const actor of actors) {
      if (actor != player && this.overlap(actor, player)) {
        newState = actor.collide(newState);
      }
    }
  }
}
