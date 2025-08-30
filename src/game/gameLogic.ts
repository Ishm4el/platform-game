import Player from "./actors/Player";
import { drawActors, drawGrid, elt } from "./utility/helperFunctions";
import type { Actors } from "./actors/Actors";
import Level from "./utility/Level";
import { SCALE } from "./settings";

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
    const thePlayer = this.actors.find((a) => a.type === "player");
    if (thePlayer instanceof Player) {
      return thePlayer;
    } else throw new Error("Player was not found!");
  }
}

class DOMDisplay {
  dom: HTMLElement;
  actorLayer: HTMLElement | null = null;

  scrollPlayerIntoView = (state: State) => {
    const width = this.dom.clientWidth;
    const height = this.dom.clientHeight;
    const margin = width / 3;

    // The viewport
    const left = this.dom.scrollLeft;
    const right = left + width;
    const top = this.dom.scrollTop;
    const bottom = top + height;

    const player: Player = state.player;
    const center = player.pos.plus(player.size.times(0.5)).times(SCALE);

    if (center.x < left + margin) {
      this.dom.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
      this.dom.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
      this.dom.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
      this.dom.scrollTop = center.y + margin - height;
    }
  };

  syncState = (state: State) => {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
  };

  constructor(parent: HTMLElement, level: Level) {
    this.dom = elt("div", { class: "game" }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() {
    this.dom.remove();
  }
}

export { DOMDisplay, Level, State };
