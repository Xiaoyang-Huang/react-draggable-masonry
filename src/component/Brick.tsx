import { forwardRef, HTMLAttributes, PropsWithChildren, useContext, useEffect, useImperativeHandle, useRef } from "react";
import BrickDataContext, { BrickConfig } from "../context/useBrickDataContext";
import DragManager from "../context/manager/DragManager";

const Brick = forwardRef<HTMLDivElement, PropsWithChildren<Partial<BrickConfig> & HTMLAttributes<HTMLDivElement>>>(
  ({ draggable, children, width, height, allowToSwap, ...rest }, ref) => {
    const brickData = useContext(BrickDataContext);

    const box = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => box.current!, [box]);

    useEffect(() => {
      brickData.config.allowToSwap = allowToSwap ?? true;
      return () => {
        brickData.wall?.removeBrick(brickData);
      }
    }, [brickData, allowToSwap]);

    useEffect(() => {
      if (!box.current) return;
      const boxRef = box.current;
      const handleDragStart = (e: DragEvent) => DragManager.setInDragBrick(brickData);
      const handleDragEnd = (e: DragEvent) => DragManager.unsetInDragBrick();

      boxRef.addEventListener("dragstart", handleDragStart);
      boxRef.addEventListener("dragend", handleDragEnd);
    }, [brickData]);

    useEffect(() => {
      const { config } = brickData;
      config.width = width ?? config.width;
      config.height = height ?? config.height;
      brickData.setup();
    }, [width, height, brickData]);

    return (
      <div {...rest} ref={box} draggable={draggable}>
        {children}
      </div>
    );
  }
);

export default Brick;
