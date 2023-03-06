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
        [tilesOrder[aIndex], tilesOrder[bIndex]] = [tilesOrder[bIndex], tilesOrder[aIndex]];
        return [...tilesOrder];
      });
    },
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
  switchOrder: () => void 0,
});
