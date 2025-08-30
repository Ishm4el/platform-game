import Lava from "./Lava";
import Player from "./Player";
import Coin from "./Coin";

type Actor = Player | Lava | Coin;
type Actors = Array<Actor>;
type TypeOfActors = typeof Player | typeof Lava | typeof Coin;

export { Actor, Actors, TypeOfActors };
