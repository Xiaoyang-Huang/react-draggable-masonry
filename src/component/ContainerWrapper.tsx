import { Children, PropsWithChildren, useEffect, useRef, useCallback, useState, useMemo, forwardRef, useImperativeHandle, ReactElement, RefObject } from "react";
import styled from "styled-components";
import TileManagerContext, { createDefaultTileManagerContext } from "../context/TileManagerContext";
import debounce from "../helper/debounce";
import { Tile, TileId, TileProps } from "./ItemWrapper";

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: dense;
`;

type Props = PropsWithChildren<{ columnWidth?: number; rowHeight?: number; gap?: number; onOrderChange?: (order: Array<TileId>) => void }>;
export type MasonryRef = {
  switchOrder: (origin: TileId, target: TileId) => void;
  setOrder: (order: Array<TileId>) => void;
  tiles: { [key: string]: Tile };
  boxes: { [key: string]: HTMLDivElement };
};

const debounceTime = 50;
const ContainerWrapper = forwardRef<MasonryRef, Props>(({ columnWidth, rowHeight, gap, children, onOrderChange }, ref) => {
  console.log("Container re-render");
  const wrapper = useRef<HTMLDivElement>();
  const childrenArray = Children.toArray(children) as Array<ReactElement<TileProps>>;
  const [tilesOrder, setTilesOrder] = useState<Array<TileId>>(childrenArray.map(({ props }) => props.tileId));
  const initialContext = useMemo(() => createDefaultTileManagerContext(ref as RefObject<MasonryRef>), [ref]);

  const handleGridChange = useCallback(() => {
    Object.values(initialContext.tiles).forEach((item) => item.updateBounding());
  }, [initialContext]);

  const sortFn = useCallback(
    ({ props: propsA }: ReactElement<TileProps>, { props: propsB }: ReactElement<TileProps>) => {
      const indexA = tilesOrder.indexOf(propsA.tileId);
      const indexB = tilesOrder.indexOf(propsB.tileId);
      if (indexA === -1 || indexB === -1) return indexA >= 0 ? -1 : 1;
      return indexA - indexB;
    },
    [tilesOrder]
  );

  useEffect(() => {
    if (!wrapper.current) return;
    const resizeObserver = new ResizeObserver(() => debounce(debounceTime, handleGridChange));
    resizeObserver.observe(wrapper.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [handleGridChange]);

  useImperativeHandle(
    ref,
    () => {
      return {
        switchOrder: (a, b) => {
          const aIndex = tilesOrder.indexOf(a);
          const bIndex = tilesOrder.indexOf(b);
          [tilesOrder[aIndex], tilesOrder[bIndex]] = [tilesOrder[bIndex], tilesOrder[aIndex]];
          setTilesOrder([...tilesOrder]);
          onOrderChange?.(tilesOrder);
        },
        tiles: initialContext.tiles,
        boxes: initialContext.boxes,
        setOrder: (order: Array<TileId>) =>
          setTilesOrder((v) => {
            const notInOrder = v.filter((id) => !order.includes(id));
            return [...order, ...notInOrder];
          }),
      };
    },
    [tilesOrder, initialContext, onOrderChange]
  );

  useEffect(handleGridChange, [handleGridChange, tilesOrder]);

  return (
    <Wrapper
      ref={(n) => (wrapper.current = n as any)}
      style={{
        gridTemplateColumns: columnWidth !== undefined ? `repeat(auto-fill, ${columnWidth + (typeof columnWidth === "number" ? "px" : "")})` : columnWidth,
        gridAutoRows: rowHeight !== undefined ? rowHeight + (typeof rowHeight === "number" ? "px" : "") : rowHeight,
        gridGap: gap !== undefined ? gap + (typeof gap === "number" ? "px" : "") : gap,
      }}
    >
      <TileManagerContext.Provider value={initialContext}>{childrenArray.sort(sortFn)}</TileManagerContext.Provider>
    </Wrapper>
  );
});

export default ContainerWrapper;
