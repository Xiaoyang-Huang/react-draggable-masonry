import { Children, PropsWithChildren, useEffect, useRef, useCallback, useState, useMemo, forwardRef, useImperativeHandle, ReactElement, RefObject } from "react";
import styled from "styled-components";
import TileManagerContext, { createDefaultTileManagerContext } from "../context/TileManagerContext";
import debounce from "../helper/debounce";
import { TileId, TileProps } from "./ItemWrapper";

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: dense;
`;

type Props = PropsWithChildren<{ columnWidth?: number; rowHeight?: number; gap?: number }>;
export type MasonryRef = {
  switchOrder: (origin: TileId, target: TileId) => void;
};

const debounceTime = 100;
const ContainerWrapper = forwardRef<MasonryRef, Props>(({ columnWidth, rowHeight, gap, children }, ref) => {
  console.log("Container re-render");
  const wrapper = useRef<HTMLDivElement>();
  const childrenArray = Children.toArray(children) as Array<ReactElement<TileProps>>;
  const [tilesOrder, setTilesOrder] = useState<Array<TileId>>(childrenArray.map(({ props }) => props.tileId));
  const initialContext = useMemo(() => createDefaultTileManagerContext(ref as RefObject<MasonryRef>), [ref]);

  const handleGridChange = useCallback(() => {
    Object.values(initialContext.tiles).forEach((item) => item.updateBounding());
  }, [initialContext]);

  useEffect(() => {
    if (!wrapper.current) return;
    const resizeObserver = new ResizeObserver(() => debounce(debounceTime, handleGridChange));
    resizeObserver.observe(wrapper.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [handleGridChange, tilesOrder]);

  useImperativeHandle(
    ref,
    () => {
      return {
        switchOrder: (a, b) => {
          const aIndex = tilesOrder.indexOf(a);
          const bIndex = tilesOrder.indexOf(b);
          const temp = tilesOrder[aIndex];
          tilesOrder[aIndex] = tilesOrder[bIndex];
          tilesOrder[bIndex] = temp;
          setTilesOrder([...tilesOrder]);
        },
      };
    },
    [tilesOrder]
  );

  return (
    <Wrapper
      ref={(n) => (wrapper.current = n as any)}
      style={{
        gridTemplateColumns: columnWidth !== undefined ? `repeat(auto-fill, ${columnWidth + (typeof columnWidth === "number" ? "px" : "")})` : columnWidth,
        gridAutoRows: rowHeight !== undefined ? rowHeight + (typeof rowHeight === "number" ? "px" : "") : rowHeight,
        gridGap: gap !== undefined ? gap + (typeof gap === "number" ? "px" : "") : gap,
      }}
    >
      <TileManagerContext.Provider value={initialContext}>{childrenArray.sort(({ props: propsA }, { props: propsB }) => tilesOrder.indexOf(propsA.tileId) - tilesOrder.indexOf(propsB.tileId))}</TileManagerContext.Provider>
    </Wrapper>
  );
});

export default ContainerWrapper;
