import { BrickData } from "../useBrickDataContext";

export default class DragManager {
  private static _brickInDrag?: BrickData;

  static get inDragBrick() {
    return DragManager._brickInDrag;
  }

  static setInDragBrick(brickData: BrickData) {
    DragManager.unsetInDragBrick();
    DragManager._brickInDrag = brickData;
    setTimeout(() => brickData.setup());
  }
  static unsetInDragBrick() {
    const _lastBrick = DragManager._brickInDrag;
    DragManager._brickInDrag = undefined;
    _lastBrick?.setup();
  }
}
