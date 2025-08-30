import type { Actor, Actors } from "../actors/Actors";
import type { Level } from "../gameLogic";
import { SCALE } from "../settings";

export function elt(
  name: string,
  attrs: { [key: string]: string },
  ...children: HTMLElement[]
): HTMLElement {
  const dom = document.createElement(name);
  for (const attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (const child of children) {
    dom.appendChild(child);
  }
  return dom;
}

// Expands the size of the game with style.
// sets the units of the size of the game to pixels
export function drawGrid(level: Level) {
  return elt(
    "table",
    {
      class: "background",
      style: `width: ${level.width * SCALE}px`,
    },
    ...level.rows.map((row: string[]) =>
      elt(
        "tr",
        { style: `height: ${SCALE}px` },
        ...row.map((type: string) => elt("td", { class: type }))
      )
    )
  );
}

// sets the position and size as defined by the actor's properties
// sets the size to pixels too.
export function drawActors(actors: Actors) {
  return elt(
    "div",
    {},
    ...actors.map((actor: Actor) => {
      const rect = elt("div", { class: `actor ${actor.type}` });
      rect.style.width = `${actor.size.x * SCALE}px`;
      rect.style.height = `${actor.size.y * SCALE}px`;
      rect.style.left = `${actor.pos.x * SCALE}px`;
      rect.style.top = `${actor.pos.y * SCALE}px`;
      return rect;
    })
  );
}
