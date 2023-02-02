import { createContext } from "react";
import { DragAgent } from "../component/ItemWrapper";

export default createContext<DragAgent>({
  id: "mock",
  testTile: (x: number, y: number) => void 0,
  move: (x: number, y: number) => void 0,
  switchTile: (idA: string, idBstring: string) => void 0,
  startDrag: () => void 0,
  endDrag: () => void 0,
});
