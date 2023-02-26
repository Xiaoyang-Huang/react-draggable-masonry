import { createContext, RefObject } from "react";
import { MasonryRef } from "../component/ContainerWrapper";
import { TileId } from "../component/ItemWrapper";

export type TileAgent = {
  tileId: TileId;
  containerRef: RefObject<MasonryRef>;
  boxRef: RefObject<HTMLDivElement>;
  wrapperRef: RefObject<HTMLDivElement>;
  setDragState: (inDrag: boolean) => void;
  updateBounding: () => void;
};
export default createContext<TileAgent>({
  tileId: "mock",
  containerRef: {} as any,
  boxRef: {} as any,
  wrapperRef: {} as any,
  setDragState: () => void 0,
  updateBounding: () => void 0,
});
