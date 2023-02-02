import { PropsWithChildren, useMemo, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import TileManagerContext, { createDefaultTileManagerContext } from "../context/TileManagerContext";
import debounce from "../helper/debounce";

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: dense;
`;

export default function ContainerWrapper({ columnWidth, rowHeight, gap, children }: PropsWithChildren<{ columnWidth?: number | string; rowHeight?: number | string; gap?: number | string }>) {
  const wrapper = useRef<HTMLDivElement>();
  const initialContext = useMemo(() => createDefaultTileManagerContext(), []);

  const handleGridChange = useCallback(() => {
    Object.values(initialContext.tiles).forEach((item) => item.updateBounding());
  }, [initialContext]);

  useEffect(() => {
    if (!wrapper.current) return;
    const resizeObserver = new ResizeObserver(() => debounce(100, handleGridChange));
    resizeObserver.observe(wrapper.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [handleGridChange]);

  return (
    <Wrapper
      ref={(n) => (wrapper.current = n as any)}
      style={{
        gridTemplateColumns: columnWidth !== undefined ? `repeat(auto-fill, ${columnWidth + (typeof columnWidth === "number" ? "px" : "")})` : columnWidth,
        gridAutoRows: rowHeight !== undefined ? rowHeight + (typeof rowHeight === "number" ? "px" : "") : rowHeight,
        gridGap: gap !== undefined ? gap + (typeof gap === "number" ? "px" : "") : gap,
      }}
    >
      <TileManagerContext.Provider value={initialContext}>{children}</TileManagerContext.Provider>
    </Wrapper>
  );
}
