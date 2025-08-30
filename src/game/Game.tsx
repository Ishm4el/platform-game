import { useLayoutEffect, useRef, useState } from "react";
import Level from "./utility/Level";
import type { Actor, Actors } from "./actors/Actors";
import Player from "./actors/Player";
import { arrowKeys, SCALE } from "./settings";
import { simpleLevelPlan } from "./levels/levels";
import State from "./utility/State";

function DrawGrid({ level }: { level: Level }) {
  return (
    <table className="background" style={{ width: `${level.width * SCALE}px` }}>
      <tbody>
        {level.rows.map((row: string[], index: number) => (
          <tr style={{ height: `${SCALE}px` }} key={`row-${index}`}>
            {row.map((type: string, index: number) => (
              <td className={type} key={`row-${index}_column-${index}`}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DrawActors({ actors }: { actors: Actors }) {
  return (
    <div>
      {actors.map((actor: Actor, index: number) => (
        <div
          className={`actor ${actor.type}`}
          style={{
            width: `${actor.size.x * SCALE}px`,
            height: `${actor.size.y * SCALE}px`,
            left: `${actor.pos.x * SCALE}px`,
            top: `${actor.pos.y * SCALE}px`,
          }}
          key={index}
        ></div>
      ))}
    </div>
  );
}

export default function Game() {
  const gameDiv = useRef<HTMLDivElement>(null!);
  const [level,] = useState<Level>(new Level(simpleLevelPlan));
  const [gameState, setGameState] = useState<State>(State.start(level));

  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(null);

  const scrollPlayerIntoView = () => {
    const width = gameDiv.current.clientWidth;
    const height = gameDiv.current.clientHeight;
    const margin = width / 3;

    // The viewport
    const left = gameDiv.current.scrollLeft;
    const right = left + width;
    const top = gameDiv.current.scrollTop;
    const bottom = top + height;

    const player: Player = gameState.player;
    const center = player.pos.plus(player.size.times(0.5)).times(SCALE);

    if (center.x < left + margin) {
      gameDiv.current.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
      gameDiv.current.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
      gameDiv.current.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
      gameDiv.current.scrollTop = center.y + margin - height;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runAnimation = (frameFunc: any) => {
    function frame(time: number) {
      if (
        previousTimeRef.current !== null &&
        typeof previousTimeRef.current === "number"
      ) {
        const timeStep = Math.min(time - previousTimeRef.current, 100) / 1000;
        if (frameFunc(timeStep) == false) return;
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(frame);
    }
    requestRef.current = requestAnimationFrame(frame);
  };

  useLayoutEffect(() => {
    const runLevel = () => {
      return new Promise((resolve) => {
        runAnimation((time: number) => {
          let ending = 1;
          setGameState(() => gameState.update(time, arrowKeys));
          scrollPlayerIntoView();
          // would syncDom here
          if (gameState.status === "playing") return true;
          else if (ending > 0) {
            ending -= time;
            return true;
          } else {
            resolve(gameState.status);
            return false;
          }
        });
      });
    };
    runLevel();
    // requestRef.current = requestAnimationFrame(runLevel);
    return () => cancelAnimationFrame(requestRef.current!);
    // runLevel();
  });

  return (
    <div className={`game ${gameState.status}`} ref={gameDiv}>
      <DrawActors actors={gameState.actors} />
      <DrawGrid level={level} />
    </div>
  );
}
