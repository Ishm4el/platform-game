/// <reference types="vite/client" />

type Actor = Player | Lava | Coin;
type Actors = Array<Actor>;
type TypeOfActors = typeof Player | typeof Lava | typeof Coin;

interface LevelChars {
  [key: string]: string | TypeOfActors;
  ".": string;
  "#": string;
  "+": string;
  "@": typeof Player;
  o: typeof Coin;
  "=": typeof Lava;
  "|": typeof Lava;
  v: typeof Lava;
}
