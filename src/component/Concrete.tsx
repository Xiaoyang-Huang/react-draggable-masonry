import { PropsWithChildren, useContext, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import BrickDataContext from "../context/useBrickDataContext";
import useWallDataContext from "../context/useWallDataContext";
import DragManager from "../context/manager/DragManager";

export default function Concrete({ children, index, id }: PropsWithChildren<{ index: number; id: string }>) {
  const wallData = useContext(useWallDataContext);
  const brickData = useMemo(() => wallData.getOrCreateBrick({ id }), [id, wallData]);

  useEffect(() => {
    wallData.addBrick(brickData, index);
    return () => {
      wallData.removeBrick(brickData);
    };
  }, [wallData, brickData]);

  useEffect(() => {
    const { container } = brickData;
    const { container: mountPoint } = wallData;
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
    if (!mountPoint.contains(container)) {
      if (mountPoint.childNodes.length <= index) mountPoint.appendChild(container);
      else {
        mountPoint.insertBefore(container, mountPoint.childNodes[index]);
      }
    }
    return () => {
      container.removeEventListener("dragenter", handlerDragEnter);
      container.removeEventListener("dragover", handleDragOver);
      if(mountPoint.contains(container)){
        // console.log(!wallData.isContainBrick(brickData) || wallData.getBrickIndex(brickData) !== index, brickData, index, id, wallData.getBrickIndex(brickData));
        if(!wallData.isContainBrick(brickData) || wallData.getBrickIndex(brickData) !== index){
          mountPoint.removeChild(container);
        }
      }
    };
  }, [index, brickData, wallData]);

  return createPortal(<BrickDataContext.Provider value={brickData}>{children}</BrickDataContext.Provider>, brickData.container);
}
