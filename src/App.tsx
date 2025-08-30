import "./App.css";
import { RunGame } from "./game/Game";
import { EASY_LEVELS } from "./game/levels/levels";

function App() {
  return <RunGame plans={EASY_LEVELS} />;
}

export default App;
