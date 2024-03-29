import { PropsWithChildren, useRef, useCallback, useEffect, useContext, HTMLAttributes, useMemo, useState, RefObject } from "react";
import TileContext, { TileAgent } from "../context/TileContext";
import TileManagerContext from "../context/TileManagerContext";

export type TileId = number | string;
export type Tile = {
  tileId: TileId;
  isMe: (testElem: Element) => boolean;
  updateBounding: () => void;
};

export type TileProps = { tileId: TileId; colSpan?: number; rowSpan?: number };

export default function ItemWrapper({ tileId, children, colSpan = 1, rowSpan = 1, ...rest }: PropsWithChildren<TileProps> & HTMLAttributes<HTMLDivElement>) {
  // console.log(`item ${tileId} is re-render`);
  const [inDrag, setInDrag] = useState(false);
  const { tiles, addTile } = useContext(TileManagerContext);
  const boxRef = useRef<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();
  const memoChild = useMemo(() => children, [children]);

  const isMe = useCallback((testElem: Element) => boxRef.current === testElem, []);

  const updateBounding = useCallback(() => {
    if (!boxRef.current || !wrapperRef.current) return;
    const offsetRect = (boxRef.current.parentNode as HTMLElement)?.getBoundingClientRect();
    if (!offsetRect) return;
    const rect = boxRef.current.getBoundingClientRect();
    if (!inDrag) {
      wrapperRef.current.style.left = rect.left - offsetRect.left + "px";
      wrapperRef.current.style.top = rect.top - offsetRect.top + "px";
    }
    wrapperRef.current.style.height = rect.height + "px";
    wrapperRef.current.style.width = rect.width + "px";
  }, [inDrag]);

  useEffect(() => {
    Object.values(tiles).forEach((item) => item.updateBounding());
  }, [tiles, colSpan, rowSpan]);

  useEffect(() => {
    if (!boxRef.current) return;
    addTile(
      {
        tileId,
        updateBounding,
        isMe,
      },
      boxRef.current
    );
  }, [tileId, isMe, updateBounding, addTile]);

  const tileAgent: TileAgent = useMemo(() => {
    return {
      tileId,
      boxRef: boxRef as RefObject<HTMLDivElement>,
      wrapperRef: wrapperRef as RefObject<HTMLDivElement>,
      containerRef: containerRef as RefObject<HTMLDivElement>,
      setDragState: setInDrag,
      updateBounding,
    };
  }, [tileId, boxRef, wrapperRef, setInDrag, updateBounding]);

  return (
    <div
      ref={(n) => {
        if (n) {
          boxRef.current = n;
          containerRef.current = n.parentNode as HTMLDivElement;
        }
      }}
      className={inDrag ? "inDrag" : ""}
      style={Object.assign(
        { display: "flex", width: "100%", height: "100%", gridColumnEnd: colSpan > 1 ? "span " + colSpan : "auto", gridRowEnd: rowSpan > 1 ? "span " + rowSpan : "auto" },
        inDrag
          ? {
              boxSizing: "border-box",
              border: "3px dashed #00000060",
              backgroundColor: "#00000030",
            }
          : (undefined as any)
      )}
    >
      <div {...rest} ref={(n) => n && (wrapperRef.current = n)} style={Object.assign({ position: "absolute", boxSizing: "border-box", width: "-webkit-fill-available", height: "-webkit-fill-available" }, rest.style, inDrag ? { zIndex: 999999 } : (undefined as any))}>
        <TileContext.Provider value={tileAgent}>{memoChild}</TileContext.Provider>
      </div>
    </div>
  );
}
