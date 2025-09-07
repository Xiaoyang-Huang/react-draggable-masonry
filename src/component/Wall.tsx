import { PropsWithChildren, useEffect, useMemo } from "react";
import Concrete from "./Concrete";
import DataContext, { WallConfig, WallData } from "../context/useWallDataContext";
import { BrickData } from "../context/useBrickDataContext";
import DragManager from "../context/manager/DragManager";

export default function Wall({
  columnWidth,
  rowHeight,
  gap,
  allowDragInSpace,
  dragMode,
  children,
  swapMode,
  onBrickChange,
}: PropsWithChildren<
  Partial<WallConfig> & {
    onBrickChange?: (wallBricks: Array<BrickData>) => void;
  }
>) {
  const wallData = useMemo(() => {
    const wall = new WallData();
    return wall;
  }, []);

  useEffect(() => {
    const heldHandle = (bricks: Array<BrickData>) => {
      if (!onBrickChange) return;
      onBrickChange(bricks);
    };
    wallData.addListener("brick-change", heldHandle);
    return () => {
      wallData.removeListener("brick-change", heldHandle);
    };
  }, [wallData, onBrickChange]);

  useEffect(() => {
    wallData.config.allowDragInSpace = allowDragInSpace ?? wallData.config.allowDragInSpace;
  }, [allowDragInSpace, wallData]);

  useEffect(() => {
    wallData.config.swapMode = swapMode ?? wallData.config.swapMode;
  }, [swapMode, wallData]);

  useEffect(() => {
    wallData.config.dragMode = dragMode ?? wallData.config.dragMode;
  }, [dragMode, wallData]);

  useEffect(() => {
    const container = wallData.container;
    const handlerDragEnter = (e: DragEvent) => {
      if (!wallData.config.allowDragInSpace) return;
      if (!DragManager.inDragBrick) return;
      const brick = DragManager.inDragBrick;
      if (brick.wall) {
        if (brick.wall !== wallData) {
          brick.wall.removeBrick(brick);
          brick.wall.emitChange();
          brick.orderInWall = -1;
        } else return;
      }
      wallData.addBrick(brick);
      wallData.emitChange();
    };

    const handlerDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!DragManager.inDragBrick) return;
      const isDragFromHere = wallData.isContainBrick(DragManager.inDragBrick);
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = isDragFromHere || !wallData.config.allowDragInSpace ? "none" : "copy";
      }
    };

    container.addEventListener("dragenter", handlerDragEnter);
    container.addEventListener("dragover", handlerDragOver);
    return () => {
      container.removeEventListener("dragenter", handlerDragEnter);
      container.addEventListener("dragover", handlerDragOver);
    };
  }, [wallData]);

  useEffect(() => {
    wallData.config.columnWidth = columnWidth ?? wallData.config.columnWidth;
    wallData.config.rowHeight = rowHeight ?? wallData.config.rowHeight;
    wallData.config.gap = gap ?? wallData.config.gap;
    wallData.setup();
  }, [columnWidth, rowHeight, gap, wallData]);

  return (
    <div
      className="wall-wrap"
      ref={(n) => {
        if(!n) return;
        if (n.contains(wallData.container)) return;
        n.innerHTML = "";
        n.appendChild(wallData.container);
      }}
    >
      <DataContext.Provider value={wallData}>
        {(Array.isArray(children) ? children : [children]).flat().map((child, index) => {
          const key: string = child.key ?? (typeof child === "string" ? child : "item-" + index);
          return (
            <Concrete key={key} id={key} index={index}>
              {child}
            </Concrete>
          );
        })}
      </DataContext.Provider>
    </div>
  );
}
