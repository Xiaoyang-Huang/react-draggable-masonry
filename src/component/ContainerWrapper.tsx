import { Children, HTMLAttributes, PropsWithChildren, useEffect, useRef, useCallback, useState, useMemo, forwardRef, useImperativeHandle, ReactElement } from "react";
import TileManagerContext, { createDefaultTileManagerContext } from "../context/TileManagerContext";
import debounce from "../helper/debounce";
import { Tile, TileId, TileProps } from "./ItemWrapper";

type Props = PropsWithChildren<{ columnWidth?: number; rowHeight?: number; gap?: number; onOrderChange?: (order: Array<TileId>) => void }> & HTMLAttributes<HTMLDivElement>;
export type MasonryRef = {
  switchOrder: (origin: TileId, target: TileId) => void;
  setOrder: (order: Array<TileId>) => void;
  tiles: { [key: string]: Tile };
  boxes: { [key: string]: HTMLDivElement };
};

const debounceTime = 50;
const ContainerWrapper = forwardRef<MasonryRef, Props>(({ columnWidth, rowHeight, gap, children, onOrderChange, ...rest }, ref) => {
  const wrapper = useRef<HTMLDivElement>();
  const childrenArray = Children.toArray(children) as Array<ReactElement<TileProps>>;
  const [tilesOrder, setTilesOrder] = useState<Array<TileId>>(childrenArray.map(({ props, key }) => props.tileId ?? "fixed-" + key));
  const initialContext = useMemo(() => createDefaultTileManagerContext(setTilesOrder), []);

  const handleGridChange = useCallback(() => {
    Object.values(initialContext.tiles).forEach((item) => item.updateBounding());
  }, [initialContext]);

  const sortFn = useCallback(
    ({ props: propsA, key: keyA }: ReactElement<TileProps>, { props: propsB, key: keyB }: ReactElement<TileProps>) => {
      const indexA = tilesOrder.indexOf(propsA.tileId ?? "fixed-" + keyA);
      const indexB = tilesOrder.indexOf(propsB.tileId ?? "fixed-" + keyB);
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
        switchOrder: initialContext.switchOrder,
        tiles: initialContext.tiles,
        boxes: initialContext.boxes,
        setOrder: (order: Array<TileId>) =>
          setTilesOrder((v) => {
            const targetOrder = order.filter((item, index) => order.indexOf(item) === index);
            if (targetOrder.length !== order.length)
              console.warn(
                "detected duplicate items in order, will only keep first index for these items",
                order.filter((item, index) => order.indexOf(item) !== index)
              );
            const notInOrder = v.filter((id) => !targetOrder.includes(id));
            const idExisting = targetOrder.filter((id) => v.includes(id));
            if (idExisting.length !== targetOrder.length)
              console.warn(
                "detected tile id is not in children list",
                targetOrder.filter((id) => !v.includes(id))
              );
            const result = [...idExisting, ...notInOrder];
            if (result.find((item, index) => v[index] !== item)) {
              return result;
            }
            return v;
          }),
      };
    },
    [initialContext]
  );

  useEffect(() => {
    onOrderChange?.(tilesOrder);
  }, [tilesOrder, onOrderChange]);

  useEffect(handleGridChange, [handleGridChange, tilesOrder]);

  return (
    <div
      {...rest}
      ref={(n) => (wrapper.current = n as any)}
      style={{
        gridTemplateColumns: columnWidth !== undefined ? `repeat(auto-fill, ${columnWidth + (typeof columnWidth === "number" ? "px" : "")})` : columnWidth,
        gridAutoRows: rowHeight !== undefined ? rowHeight + (typeof rowHeight === "number" ? "px" : "") : rowHeight,
        gridGap: gap !== undefined ? gap + (typeof gap === "number" ? "px" : "") : gap,
        position: "relative",
        display: "grid",
        gridAutoFlow: "dense",
        ...rest.style,
      }}
    >
      <TileManagerContext.Provider value={initialContext}>{childrenArray.sort(sortFn)}</TileManagerContext.Provider>
    </div>
  );
});

export default ContainerWrapper;
