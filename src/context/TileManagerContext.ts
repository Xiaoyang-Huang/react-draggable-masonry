import { createContext, RefObject } from "react";
import { MasonryRef } from "../component/ContainerWrapper";
import { Tile } from "../component/ItemWrapper";

export function createDefaultTileManagerContext(containerRef: RefObject<MasonryRef>) {
  const tiles: { [key: string]: Tile } = {};
  const store = {
    tiles,
    containerRef,
    addTile: (item: Tile) => {
      tiles[item.tileId] = item;
    },
  };

  return store;
}
export default createContext<ReturnType<typeof createDefaultTileManagerContext>>({
  tiles: {},
  addTile: () => void 0,
  containerRef: {} as any,
});
