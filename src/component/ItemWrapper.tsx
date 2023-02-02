import { PropsWithChildren, useRef, useCallback, useEffect, useContext, HTMLAttributes, useMemo, useState } from "react";
import styled from "styled-components";
import TileContext from "../context/TileContext";
import TileManagerContext from "../context/TileManagerContext";

const Container = styled.div`
  position: absolute;
  transition: all 300ms;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 3px dashed #00000060;
  background-color: #00000030;

  &.placeholder {
    ${Container} {
      z-index: 999999;
      transition: left 0ms, top 0ms;
    }
  }
`;

export type Tile = {
  id: string;
  updateBounding: () => void;
};

export type DragAgent = {
  id: string;
  move: (x: number, y: number) => void;
  startDrag: () => void;
  endDrag: () => void;
};

export default function ItemWrapper({ id, children, colSpan = 1, rowSpan = 1, ...rest }: PropsWithChildren<{ id: string; colSpan?: number; rowSpan?: number; onGridChange?: (id: string) => void }> & HTMLAttributes<HTMLDivElement>) {
  const [inDrag, setInDrag] = useState(false);
  const { tiles, addTile } = useContext(TileManagerContext);
  const wrapper = useRef<HTMLDivElement>();
  const container = useRef<HTMLDivElement>();

  const updateBounding = useCallback(() => {
    if (!wrapper.current || !container.current) return;
    const offsetRect = (wrapper.current.parentNode as HTMLElement)?.getBoundingClientRect();
    if (!offsetRect) return;
    const rect = wrapper.current.getBoundingClientRect();
    container.current.style.left = rect.left - offsetRect.left + "px";
    container.current.style.top = rect.top - offsetRect.top + "px";
    container.current.style.height = rect.height + "px";
    container.current.style.width = rect.width + "px";
  }, []);

  const move = useCallback((x: number, y: number) => {
    if (!wrapper.current || !container.current) return;
    const parentRect = (wrapper.current.parentNode as HTMLElement)?.getBoundingClientRect();
    if (!parentRect) return;
    const containerRect = container.current.getBoundingClientRect();

    let targetX = Math.max(parseInt(container.current.style.left) + x, 0);
    if (targetX + containerRect.width > parentRect.left + parentRect.width) targetX = parentRect.left + parentRect.width - containerRect.width;

    let targetY = Math.max(parseInt(container.current.style.top) + y, 0);
    if (targetY + containerRect.height > parentRect.height) targetY = parentRect.height - containerRect.height;

    container.current.style.left = targetX + "px";
    container.current.style.top = targetY + "px";
  }, []);

  const startDrag = useCallback(() => {
    if (!wrapper.current || !container.current) return;
    setInDrag(true);
  }, []);

  const endDrag = useCallback(() => {
    if (!wrapper.current || !container.current) return;
    setInDrag(false);
    updateBounding();
  }, [updateBounding]);

  useEffect(() => {
    Object.values(tiles).forEach((item) => item.updateBounding());
  }, [tiles, colSpan, rowSpan]);

  useEffect(() => {
    addTile({
      id,
      updateBounding,
    });
  }, [id, updateBounding, addTile]);

  const dragAgent: DragAgent = useMemo(
    () => ({
      id,
      move,
      startDrag,
      endDrag,
    }),
    [id, move, startDrag, endDrag]
  );

  return (
    <Wrapper ref={(n) => n && (wrapper.current = n)} className={inDrag ? "placeholder" : ""} style={{ gridColumnEnd: colSpan > 1 ? "span " + colSpan : "auto", gridRowEnd: rowSpan > 1 ? "span " + rowSpan : "auto", ...rest.style }}>
      <Container ref={(n) => n && (container.current = n)} {...rest}>
        <TileContext.Provider value={dragAgent}>{children}</TileContext.Provider>
      </Container>
    </Wrapper>
  );
}
