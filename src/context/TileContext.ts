import { createContext } from "react";
import { DragAgent } from "../component/ItemWrapper";

export default createContext<DragAgent>({
  id: "mock",
  move: (x: number, y: number) => void 0,
  startDrag: () => void 0,
  endDrag: () => void 0,
});
