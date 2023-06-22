import { createContext } from "react";
import { Tile, TileId } from "../component/ItemWrapper";

export function createDefaultTileManagerContext(setOrderHandle: (ordersDispatcher: (order: Array<TileId>) => Array<TileId>) => void) {
  const tiles: { [key: string]: Tile } = {};
  const boxes: { [key: string]: HTMLDivElement } = {};
  const store = {
    tiles,
    boxes,
    switchOrder: (a: TileId, b: TileId) => {
      let cachedOrder: Array<TileId>;
      setOrderHandle((tilesOrder) => {
        if (cachedOrder === tilesOrder) return [...cachedOrder]; // get rid of react strict mode
        cachedOrder = tilesOrder;
        const aIndex = tilesOrder.indexOf(a);
        const bIndex = tilesOrder.indexOf(b);
        // console.log(a, aIndex, b, bIndex);
        if (aIndex === -1 || bIndex === -1) return tilesOrder;
        [tilesOrder[aIndex], tilesOrder[bIndex]] = [tilesOrder[bIndex], tilesOrder[aIndex]];
        return [...tilesOrder];
      });
    },
    addTile: (item: Tile, box: HTMLDivElement) => {
      const { tileId } = item;
      tiles[tileId] = item;
      boxes[tileId] = box;
      let cachedOrder: Array<TileId>;
      setOrderHandle((tilesOrder) => {
        if (cachedOrder === tilesOrder) return cachedOrder; // get rid of react strict mode
        if (tilesOrder.indexOf(tileId) > -1) return tilesOrder;
        cachedOrder = tilesOrder;
        return [...tilesOrder, tileId];
      });
    },
  };

  return store;
}
export default createContext<ReturnType<typeof createDefaultTileManagerContext>>({
  tiles: {},
  boxes: {},
  addTile: () => void 0,
  switchOrder: () => void 0,
});
