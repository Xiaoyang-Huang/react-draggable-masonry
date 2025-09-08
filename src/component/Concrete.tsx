import { PropsWithChildren, useContext, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import BrickDataContext from "../context/useBrickDataContext";
import useWallDataContext from "../context/useWallDataContext";
import DragManager from "../context/manager/DragManager";

export default function Concrete({ children, index, id }: PropsWithChildren<{ index: number; id: string }>) {
  const wallData = useContext(useWallDataContext);
  const brickData = useMemo(() => wallData.getOrCreateBrick({ id }), [id, wallData]);

  useEffect(() => {
    // console.log("enter", id, index, wallData.getBrickIndex(brickData));
    if(wallData.isContainBrick(brickData)) return;
    wallData.addBrick(brickData, index);
    return () => {
      // console.log("exit", id, index, wallData.getBrickIndex(brickData));
      if(index === wallData.getBrickIndex(brickData)) return;
      wallData.removeBrick(brickData);
    };
  }, [index, wallData, brickData]);

  useEffect(() => {
    const { container } = brickData;
    const handlerDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!brickData.config.allowToSwap) return;
      const sourceBrick = DragManager.inDragBrick;
      if (!sourceBrick) return;
      if (sourceBrick === brickData) return;
      wallData.swapDragBrickWith(brickData);
      wallData.emitChange();
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) e.dataTransfer.dropEffect = brickData.config.allowToSwap ? "move" : "none";
    };

    container.addEventListener("dragenter", handlerDragEnter);
    container.addEventListener("dragover", handleDragOver);
    return () => {
      container.removeEventListener("dragenter", handlerDragEnter);
      container.removeEventListener("dragover", handleDragOver);
    };
  }, [index, brickData, wallData]);

  return createPortal(<BrickDataContext.Provider value={brickData}>{children}</BrickDataContext.Provider>, brickData.container);
}
