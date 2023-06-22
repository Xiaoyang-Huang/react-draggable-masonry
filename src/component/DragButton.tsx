import { PropsWithChildren, HTMLAttributes, useContext, useCallback, PointerEventHandler, PointerEvent as ReactPointEvent, MouseEvent as ReactMouseEvent, MouseEventHandler } from "react";
import TileContext from "../context/TileContext";
import { TileManagerContext } from "../Masonry";
import { ConfigContext } from "../context/ConfigContext";

const elemHasTransition = (elm: HTMLElement) => {
  if ((elm as any).computedStyleMap) return (elm as any).computedStyleMap().getAll("transition")[0].toString() === "all 0s ease 0s";
  return window.getComputedStyle(elm).getPropertyPriority("transition") === "all 0s ease 0s";
};

export default function DragButton({ children, ...rest }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  const { onPointerDown, onClick } = rest;
  const { bounded } = useContext(ConfigContext);
  const { boxes, tiles, switchOrder } = useContext(TileManagerContext);
  const { tileId, boxRef, wrapperRef, containerRef, setDragState, updateBounding } = useContext(TileContext);

  const startDrag = useCallback(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.transition = "left 0ms, top 0ms";
    setDragState(true);
  }, [wrapperRef, setDragState]);

  const endDrag = useCallback(
    (endHandler: Function) => {
      if (!wrapperRef.current) return;
      wrapperRef.current.style.removeProperty("transition");
      const isTransitioned = elemHasTransition(wrapperRef.current);
      const handleTransitionEnd = () => {
        setDragState(false);
        wrapperRef.current?.removeEventListener("transitionend", handleTransitionEnd);
      };
      if (isTransitioned) {
        handleTransitionEnd();
      } else {
        wrapperRef.current.addEventListener("transitionend", handleTransitionEnd);
      }
      updateBounding();
      window.removeEventListener("pointerup", endHandler as any);
    },
    [wrapperRef, setDragState, updateBounding]
  );

  const move = useCallback(
    (moveX: number, moveY: number) => {
      if (!containerRef.current || !wrapperRef.current) return;
      const parentRect = containerRef.current.getBoundingClientRect();
      const containerRect = wrapperRef.current.getBoundingClientRect();
      const left = parseInt(wrapperRef.current.style.left) || 0;
      const top = parseInt(wrapperRef.current.style.top) || 0;
      let targetX = left;
      let targetY = top;

      if (bounded) {
        targetX = Math.max(left + moveX, 0);
        if (targetX + containerRect.width > parentRect.width) targetX = parentRect.width - containerRect.width;

        targetY = Math.max(top + moveY, 0);
        if (targetY + containerRect.height > parentRect.height) targetY = parentRect.height - containerRect.height;
      } else {
        targetX += moveX;
        targetY += moveY;
      }

      wrapperRef.current.style.left = targetX + "px";
      wrapperRef.current.style.top = targetY + "px";
    },
    [containerRef, wrapperRef, bounded]
  );

  const testTile = useCallback(
    (mouseX: number, mouseY: number) => {
      const elements = document.elementsFromPoint(mouseX, mouseY);
      const boxesValues = Object.values(boxes);
      const target = elements.filter((elem) => elem.localName === "div" && elem.childElementCount === 1).find((elem) => elem !== boxRef.current && boxesValues.includes(elem as HTMLDivElement));
      if (target) {
        return Object.values(tiles || {}).find((item) => item.isMe(target))?.tileId;
      }
    },
    [boxRef, boxes, tiles]
  );

  const stopPropagation = (e: ReactPointEvent<HTMLDivElement> | ReactMouseEvent<HTMLDivElement> | PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePointerMove = useCallback(() => {
    return (e: PointerEvent) => {
      stopPropagation(e);
      move(e.movementX, e.movementY);
      const touchedTileId = testTile(e.clientX, e.clientY);
      if (touchedTileId !== undefined) {
        // console.log("switch", tileId, touchedTileId);
        switchOrder(tileId, touchedTileId);
      }
    };
  }, [switchOrder, move, testTile, tileId]);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onPointerDown?.(e);
      if (!boxRef.current || !wrapperRef.current) return;
      startDrag();
      const moveHandler = handlePointerMove();
      window.addEventListener("pointermove", moveHandler);
      window.addEventListener("pointerup", function endHandler(e) {
        stopPropagation(e);
        endDrag(endHandler);
        window.removeEventListener("pointermove", moveHandler);
      });
    },
    [handlePointerMove, boxRef, endDrag, startDrag, wrapperRef, onPointerDown]
  );

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      stopPropagation(e);
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <div {...rest} style={{ userSelect: "none", cursor: "all-scroll", ...rest.style }} onPointerDown={handlePointerDown} onClick={handleClick}>
      {children}
    </div>
  );
}
