import { PropsWithChildren, useRef, useCallback, useEffect, useContext, HTMLAttributes, useMemo, useState, RefObject } from "react";
import styled from "styled-components";
import TileContext, { TileAgent } from "../context/TileContext";
import TileManagerContext from "../context/TileManagerContext";

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  &.placeholder {
    box-sizing: border-box;
    border: 3px dashed #00000060;
    background-color: #00000030;

    ${Container} {
      z-index: 999999;
    }
  }
`;

export type TileId = number | string;
export type Tile = {
  tileId: TileId;
  isMe: (testElem: Element) => boolean;
  updateBounding: () => void;
};

export type TileProps = { tileId: TileId; colSpan?: number; rowSpan?: number; onGridChange?: (id: TileId) => void };

export default function ItemWrapper({ tileId, children, colSpan = 1, rowSpan = 1, ...rest }: PropsWithChildren<TileProps> & HTMLAttributes<HTMLDivElement>) {
  console.log(`item ${tileId} is re-render`);
  const [inDrag, setInDrag] = useState(false);
  const { tiles, addTile, containerRef } = useContext(TileManagerContext);
  const boxRef = useRef<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>();

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
      containerRef,
      boxRef: boxRef as RefObject<HTMLDivElement>,
      wrapperRef: wrapperRef as RefObject<HTMLDivElement>,
      setDragState: setInDrag,
      updateBounding,
    };
  }, [tileId, containerRef, boxRef, wrapperRef, setInDrag, updateBounding]);

  return (
    <Wrapper ref={(n) => n && (boxRef.current = n)} className={inDrag ? "placeholder" : ""} style={{ gridColumnEnd: colSpan > 1 ? "span " + colSpan : "auto", gridRowEnd: rowSpan > 1 ? "span " + rowSpan : "auto", ...rest.style }}>
      <Container ref={(n) => n && (wrapperRef.current = n)} {...rest}>
        <TileContext.Provider value={tileAgent}>{children}</TileContext.Provider>
      </Container>
    </Wrapper>
  );
}
