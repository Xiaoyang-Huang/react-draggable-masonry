import { PropsWithChildren, useRef, useCallback, useEffect, useContext, HTMLAttributes, useMemo, useState } from "react";
import styled from "styled-components";
import TileContext from "../context/TileContext";
import TileManagerContext from "../context/TileManagerContext";
import debounce from "../helper/debounce";

const Container = styled.div`
  position: absolute;
  transition: all 300ms;
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

export type Tile = {
  id: string;
  isMe: (testElem: Element) => boolean;
  updateBounding: () => void;
};

export type DragAgent = {
  id: string;
  move: (moveX: number, moveY: number) => void;
  testTile: (x: number, y: number) => string | undefined | void;
  switchTile: (idA: string, idB: string) => void;
  startDrag: () => void;
  endDrag: () => void;
};

export default function ItemWrapper({ id, children, colSpan = 1, rowSpan = 1, ...rest }: PropsWithChildren<{ id: string; colSpan?: number; rowSpan?: number; onGridChange?: (id: string) => void }> & HTMLAttributes<HTMLDivElement>) {
  const [inDrag, setInDrag] = useState(false);
  const { tiles, switchOrder, addTile } = useContext(TileManagerContext);
  const wrapper = useRef<HTMLDivElement>();
  const container = useRef<HTMLDivElement>();

  const isMe = useCallback((testElem: Element) => wrapper.current === testElem, []);

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

  const move = useCallback((moveX: number, moveY: number) => {
    if (!wrapper.current || !container.current) return;
    const parentRect = (wrapper.current.parentNode as HTMLElement)?.getBoundingClientRect();
    if (!parentRect) return;
    const containerRect = container.current.getBoundingClientRect();

    let targetX = Math.max(parseInt(container.current.style.left) + moveX, 0);
    if (targetX + containerRect.width > parentRect.left + parentRect.width) targetX = parentRect.left + parentRect.width - containerRect.width;

    let targetY = Math.max(parseInt(container.current.style.top) + moveY, 0);
    if (targetY + containerRect.height > parentRect.height) targetY = parentRect.height - containerRect.height;

    container.current.style.left = targetX + "px";
    container.current.style.top = targetY + "px";
  }, []);

  const testTile = useCallback(
    (mouseX: number, mouseY: number) => {
      const targetStyledId: string = (Wrapper as any).styledComponentId as string;
      const elements = document.elementsFromPoint(mouseX, mouseY);
      const target = elements.find((elem) => ~elem.className.indexOf(targetStyledId) && elem !== wrapper.current);
      if (target) {
        return Object.values(tiles).find((item) => item.isMe(target))?.id;
      }
    },
    [tiles]
  );

  const startDrag = useCallback(() => {
    if (!wrapper.current || !container.current) return;
    container.current.style.transition = "left 0ms, top 0ms";
    setInDrag(true);
  }, []);

  const endDrag = useCallback(() => {
    if (!wrapper.current || !container.current) return;
    container.current.style.removeProperty("transition");
    const handleTransitionEnd = () => {
      setInDrag(false);
      container.current?.removeEventListener("transitionend", handleTransitionEnd);
    };
    container.current.addEventListener("transitionend", handleTransitionEnd);
    updateBounding();
  }, [updateBounding]);

  useEffect(() => {
    Object.values(tiles).forEach((item) => item.updateBounding());
  }, [tiles, colSpan, rowSpan]);

  useEffect(() => {
    addTile({
      id,
      updateBounding,
      isMe,
    });
  }, [id, isMe, updateBounding, addTile]);

  const dragAgent: DragAgent = useMemo(
    () => ({
      id,
      move,
      testTile,
      switchTile: (...args) => debounce(100, switchOrder, ...args),
      startDrag,
      endDrag,
    }),
    [id, move, testTile, startDrag, endDrag]
  );

  return (
    <Wrapper ref={(n) => n && (wrapper.current = n)} className={inDrag ? "placeholder" : ""} style={{ gridColumnEnd: colSpan > 1 ? "span " + colSpan : "auto", gridRowEnd: rowSpan > 1 ? "span " + rowSpan : "auto", ...rest.style }}>
      <Container ref={(n) => n && (container.current = n)} {...rest}>
        <TileContext.Provider value={dragAgent}>{children}</TileContext.Provider>
      </Container>
    </Wrapper>
  );
}
