import { createContext } from "react";
import { DragAgent, TileId } from "../component/ItemWrapper";

export default createContext<DragAgent>({
  tileId: "mock",
  testTile: (x: number, y: number) => void 0,
  move: (x: number, y: number) => void 0,
  switchTile: (idA: TileId, idBstring: TileId) => void 0,
  startDrag: () => void 0,
  endDrag: () => void 0,
});
