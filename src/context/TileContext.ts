import { createContext, RefObject } from "react";
import { TileId } from "../component/ItemWrapper";

export type TileAgent = {
  tileId: TileId;
  boxRef: RefObject<HTMLDivElement>;
  wrapperRef: RefObject<HTMLDivElement>;
  setDragState: (inDrag: boolean) => void;
  updateBounding: () => void;
};
export default createContext<TileAgent>({
  tileId: "mock",
  boxRef: {} as any,
  wrapperRef: {} as any,
  setDragState: () => void 0,
  updateBounding: () => void 0,
});
