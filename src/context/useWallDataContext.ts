import { createContext } from "react";
import { BrickConfig, BrickData } from "./useBrickDataContext";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import DragManager from "./manager/DragManager";

export type WallConfig = {
  columnWidth: number | string;
  rowHeight: number | string;
  gap: number | string;
  allowDragInSpace: boolean;
  dragMode: "normal" | "adapt";
  swapMode: "internal" | "external";
};

export class WallData extends (EventEmitter as new () => TypedEmitter<{
  "brick-change": (wallBricks: Array<BrickData>) => void;
}>) {
  private _bricks: Array<BrickData> = [];

  public readonly config: WallConfig;
  public readonly container = document.createElement("div");

  constructor(data?: Partial<WallConfig>) {
    super();
    this.config = {
      columnWidth: 100,
      rowHeight: 100,
      gap: 0,
      allowDragInSpace: false,
      dragMode: "normal",
      swapMode: "internal",
      ...data,
    };
  }

  public setup() {
    Object.entries({
      gridTemplateColumns: `repeat(auto-fill, ${typeof this.config.columnWidth === "number" ? this.config.columnWidth + "px" : this.config.columnWidth})`,
      gridAutoRows: typeof this.config.rowHeight === "number" ? this.config.rowHeight + "px" : this.config.rowHeight,
      gridGap: typeof this.config.gap === "number" ? this.config.gap + "px" : this.config.gap,
      position: "relative",
      display: "grid",
      gridAutoFlow: "dense",
    }).forEach(([key, value]) => {
      (this.container.style as any)[key] = value;
    });
  }

  public isContainBrick(brickData: BrickData) {
    return this._bricks.includes(brickData);
  }

  public addBrick(brickData: BrickData, index?: number) {
    const existingIndex = this._bricks.findIndex((b) => b === brickData);
    if (existingIndex === -1) {
      if (index !== undefined) {
        brickData.orderInWall = index;
        this._bricks.splice(index, 0, brickData);
      } else if (brickData.orderInWall !== -1) {
        this._bricks.splice(brickData.orderInWall, 0, brickData);
      } else {
        brickData.orderInWall = this._bricks.length;
        this._bricks.push(brickData);
      }
      brickData.wall = this;
    }
    return existingIndex;
  }

  public removeBrick(brickData: BrickData) {
    const existingIndex = this._bricks.findIndex((b) => b === brickData);
    if (existingIndex > -1) {
      this._bricks.splice(existingIndex, 1);
    }
    return existingIndex;
  }

  public getOrCreateBrick(data: Partial<BrickConfig> & Pick<BrickConfig, "id">) {
    const { id } = data;
    const existingIndex = this._bricks.findIndex((b) => b.config.id === id);
    if (existingIndex === -1) {
      const brick = new BrickData({ id });
      return brick;
    } else {
      const brick = this._bricks[existingIndex];
      brick.wall = this;
      return brick;
    }
  }

  public swapDragBrickWith(targetBrick: BrickData) {
    const inDragBrick = DragManager.inDragBrick;
    if (!inDragBrick || !inDragBrick.wall) return;

    if (inDragBrick.wall !== this) {
      const sourceWall = inDragBrick.wall;
      const sourceIndex = sourceWall.removeBrick(inDragBrick);
      const targetIndex = this.removeBrick(targetBrick);
      sourceWall.addBrick(targetBrick, sourceIndex);
      this.addBrick(inDragBrick, targetIndex);
      DragManager.setInDragBrick(inDragBrick);
      sourceWall.emitChange();
    } else if (inDragBrick.wall === this) {
      let inDragBrickIndex = -1,
        targetBrickIndex = -1;
      this._bricks.forEach((b, i) => {
        if (inDragBrickIndex > -1 && targetBrickIndex > -1) return;
        if (b === inDragBrick) inDragBrickIndex = i;
        if (b === targetBrick) targetBrickIndex = i;
      });
      [this._bricks[inDragBrickIndex], this._bricks[targetBrickIndex]] = [this._bricks[targetBrickIndex], this._bricks[inDragBrickIndex]];

      if (this.config.swapMode === "internal") {
        const siblingA = inDragBrick.container.nextSibling === targetBrick.container ? inDragBrick.container : inDragBrick.container.nextSibling;
        targetBrick.wall!.container.insertBefore(inDragBrick.container, targetBrick.container);
        inDragBrick.wall!.container.insertBefore(targetBrick.container, siblingA);
      }
    }

    if (this.config.dragMode === "adapt") {
      const { width, height } = targetBrick.config;
      targetBrick.config.width = inDragBrick.config.width;
      targetBrick.config.height = inDragBrick.config.height;
      targetBrick.setup();
      inDragBrick.config.width = width;
      inDragBrick.config.height = height;
      inDragBrick.setup();
    }
  }

  public emitChange() {
    this.emit("brick-change", this._bricks);
  }
}

const WallDataContext = createContext<WallData>(new WallData());
export default WallDataContext;
