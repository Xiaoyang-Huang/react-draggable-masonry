import { PropsWithChildren, HTMLAttributes, useContext, useCallback, PointerEventHandler, PointerEvent as ReactPointEvent } from "react";
import styled from "styled-components";
import TileContext from "../context/TileContext";
import { DragAgent } from "./ItemWrapper";

const Wrapper = styled.div`
  user-select: none;
  cursor: all-scroll;
`;
export default function DragButton({ children, ...rest }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  const dragAgent = useContext(TileContext);

  const stopPropagation = (e: ReactPointEvent<HTMLDivElement> | PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePointerMove = useCallback((targetTile: DragAgent) => {
    return (e: PointerEvent) => {
      if (!targetTile) return;
      stopPropagation(e);
      // console.log(e.pageX, startX, e.pageY, startY);
      targetTile.move(e.movementX, e.movementY);
      const touchedTileId = targetTile.testTile(e.pageX, e.pageY);
      if (touchedTileId !== undefined) {
        console.log("switch", targetTile.tileId, touchedTileId);
        targetTile.switchTile(targetTile.tileId, touchedTileId);
      }
    };
  }, []);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!dragAgent) return;
      dragAgent.startDrag();
      const moveHandler = handlePointerMove(dragAgent);
      window.addEventListener("pointermove", moveHandler);
      window.addEventListener("pointerup", function endHandler(e) {
        stopPropagation(e);
        dragAgent.endDrag(endHandler);
        window.removeEventListener("pointermove", moveHandler);
      });
    },
    [dragAgent, handlePointerMove]
  );

  return (
    <Wrapper {...rest} onPointerDown={handlePointerDown} onClick={stopPropagation as any}>
      {children}
    </Wrapper>
  );
}
