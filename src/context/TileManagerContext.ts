import { createContext, RefObject } from "react";
import { MasonryRef } from "../component/ContainerWrapper";
import { Tile } from "../component/ItemWrapper";

export function createDefaultTileManagerContext(containerRef: RefObject<MasonryRef>) {
  const tiles: { [key: string]: Tile } = {};
  const boxes: { [key: string]: HTMLDivElement } = {};
  const store = {
    tiles,
    boxes,
    containerRef,
    addTile: (item: Tile, box: HTMLDivElement) => {
      tiles[item.tileId] = item;
      boxes[item.tileId] = box;
    },
  };

  return store;
}
export default createContext<ReturnType<typeof createDefaultTileManagerContext>>({
  tiles: {},
  boxes: {},
  addTile: () => void 0,
  containerRef: {} as any,
});
