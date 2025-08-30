import "./App.css";
import { useRef } from "react";
import { Level, DOMDisplay, State } from "./game/gameLogic";
import { simpleLevelPlan } from "./game/levels/levels";

function App() {
  const gameDiv = useRef(null);
  console.log(gameDiv);
  const simpleLevel = new Level(simpleLevelPlan);
  const display = new DOMDisplay(document.body, simpleLevel);
  display.syncState(State.start(simpleLevel));
  return <div ref={gameDiv}></div>;
}

export default App;
