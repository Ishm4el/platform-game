import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Level from "./utility/Level";
import type { Actor, Actors } from "./actors/Actors";
import Player from "./actors/Player";
import { arrowKeys, SCALE } from "./settings";
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

export default function Game({
  aLevel,
  advance,
  destroy,
}: {
  aLevel: string;
  advance: React.Dispatch<React.SetStateAction<number>>;
  destroy: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const gameDiv = useRef<HTMLDivElement>(null!);
  const [level] = useState<Level>(new Level(aLevel));
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

  const runAnimation = (frameFunc: { (time: number): boolean; (arg0: number): boolean; }) => {
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
          // setGameState(() => gameState.update(time, arrowKeys));
          const newGameState = gameState.update(time, arrowKeys);
          setGameState(newGameState);
          scrollPlayerIntoView();
          // would syncDom here
          if (newGameState.status === "playing") return true;
          if (newGameState.status === "lost") {
            console.log("lost!");
            resolve(newGameState.status);
            return false;
          }
          if (newGameState.status === "won") {
            resolve(newGameState.status);
            return false;
          } else if (ending > 0) {
            ending -= time;
            return true;
          } else {
            resolve(newGameState.status);
            return false;
          }
        });
      });
    };

    // runLevel()
    async function runnerRunLevel() {
      await runLevel();
      if (gameState.status === "won") advance((prev) => prev + 1);
      else if (gameState.status === "lost") destroy(true);
    }

    runnerRunLevel();
    return () => cancelAnimationFrame(requestRef.current!);
  });

  return (
    <div className={`game ${gameState.status}`} ref={gameDiv}>
      <DrawActors actors={gameState.actors} />
      <DrawGrid level={level} />
    </div>
  );
}

export function RunGame({ plans }: { plans: string[] }) {
  const [stage, setStage] = useState(0);
  const [level, setLevel] = useState(plans[stage]);
  const [tempDestroy, setTempDestroy] = useState(false);

  console.log(level);

  useEffect(() => {
    if (tempDestroy !== false) setTempDestroy(false);
  }, [tempDestroy]);

  useEffect(() => {
    if (stage > plans.length) {
      alert("Reached END!");
    }
    setTempDestroy(true);
    setLevel(() => plans[stage]);
  }, [stage]);

  return (
    <>
      {tempDestroy ? (
        <></>
      ) : (
        <Game aLevel={level} advance={setStage} destroy={setTempDestroy} />
      )}
      {stage > plans.length ? <h1>END!</h1> : <></>}
    </>
  );
}
