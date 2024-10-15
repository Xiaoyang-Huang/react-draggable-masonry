import { createContext } from "react";
import DragManager from "./manager/DragManager";
import { WallData } from "./useWallDataContext";

export type BrickConfig = {
  width: number;
  height: number;
  id: string;
  allowToSwap: boolean;
  wall?: WallData;
};

export class BrickData {
  public readonly config: BrickConfig;
  public readonly container = document.createElement("div");
  public wall;
  public orderInWall = -1;

  constructor(data: Partial<BrickConfig> & Pick<BrickConfig, "id">) {
    this.config = {
      width: 1,
      height: 1,
      allowToSwap: false,
      ...data,
    };
    this.wall = data.wall;
  }

  public setup() {
    Object.entries({
      display: "flex",
      position: "relative",
      gridColumnEnd: this.config.width > 1 ? "span " + this.config.width : "auto",
      gridRowEnd: this.config.height > 1 ? "span " + this.config.height : "auto",
    }).forEach(([key, value]) => {
      (this.container.style as any)[key] = value;
    });
    if (DragManager.inDragBrick === this) {
      this.container.classList.add("in-drag");
    } else {
      this.container.classList.remove("in-drag");
    }
  }
}

const BrickDataContext = createContext<BrickData>(new BrickData({ id: "never" }));
export default BrickDataContext;
