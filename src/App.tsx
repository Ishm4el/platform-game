import "./App.css";
import { Level, DOMDisplay, State } from "./game/gameLogic";
import { simpleLevelPlan } from "./game/levels/levels";

function App() {
  const simpleLevel = new Level(simpleLevelPlan);
  const display = new DOMDisplay(document.body, simpleLevel);
  display.syncState(State.start(simpleLevel));
  return <></>;
}

export default App;
