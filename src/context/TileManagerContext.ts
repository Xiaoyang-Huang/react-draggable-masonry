import { createContext, useState } from "react";
import { Tile } from "../component/ItemWrapper";

export function useDefaultTileManagerContext() {
  const tiles: { [key: string]: Tile } = {};
  const [tilesOrder, setTilesOrder] = useState<Array<string>>([]);
  const store = {
    tiles,
    tilesOrder,
    addTile: (item: Tile) => {
      const id = item.id;
      tiles[id] = item;
      setTilesOrder((tilesOrder) => {
        if (!tilesOrder.includes(id)) {
          tilesOrder.push(id);
          return [...tilesOrder];
        }
        return tilesOrder;
      });
    },
    switchOrder: (idA: string, idB: string) => {
      setTilesOrder((tilesOrder) => {
        const tileAIndex = tilesOrder.indexOf(idA);
        const tileBIndex = tilesOrder.indexOf(idB);
        tilesOrder[tileAIndex] = idB;
        tilesOrder[tileBIndex] = idA;
        return [...tilesOrder];
      });
    },
  };

  // test code
  (window as any).xyStore = store;
  return store;
}
export default createContext<ReturnType<typeof useDefaultTileManagerContext>>({
  tiles: {},
  tilesOrder: [],
  addTile: () => void 0,
  switchOrder: () => void 0,
});
