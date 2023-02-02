import { createContext } from "react";
import { Tile } from "../component/ItemWrapper";

export function createDefaultTileManagerContext() {
  const tiles: { [key: string]: Tile } = {};
  const store = {
    tiles,
    addTile: (item: Tile) => (tiles[item.id] = item),
  };

  // test code
  (window as any).xyStore = store;
  return store;
}
export default createContext(createDefaultTileManagerContext());
