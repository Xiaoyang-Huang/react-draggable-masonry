import { createContext } from "react";
import { Tile } from "../component/ItemWrapper";

export function createDefaultTileManagerContext() {
  const tiles: { [key: string]: Tile } = {};
  let tilesOrder: Array<string> = [];
  const store = {
    tiles,
    tilesOrder,
    addTile: (item: Tile) => {
      const id = item.id;
      tiles[id] = item;
      if (!tilesOrder.includes(id)) tilesOrder.push(id);
    },
    switchOrder: (idA: string, idB: string) => {
      console.log("!!!", idA, idB);
      const tileAIndex = tilesOrder.indexOf(idA);
      const tileBIndex = tilesOrder.indexOf(idB);
      tilesOrder[tileAIndex] = idB;
      tilesOrder[tileBIndex] = idA;
      tilesOrder = [...tilesOrder];
    },
  };

  // test code
  (window as any).xyStore = store;
  return store;
}
export default createContext(createDefaultTileManagerContext());
