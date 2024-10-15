import { HTMLAttributes, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { Brick, BrickConfig, BrickDataContext } from "../../Masonry";

export default function AnimateBrick({
  children,
  width = 1,
  height = 1,
  transition = "300ms",
  ...rest
}: PropsWithChildren<{ transition?: string } & Partial<BrickConfig> & HTMLAttributes<HTMLDivElement>>) {
  const brickData = useContext(BrickDataContext);
  const { container } = brickData;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!box.current) return;
    const boxRef = box.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const {
          contentRect: { width, height },
        } = entry;
        boxRef.style.width = width + "px";
        boxRef.style.height = height + "px";
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [container, box]);

  useEffect(() => {
    const { config } = brickData;
    config.width = width ?? config.width;
    config.height = height ?? config.height;
    brickData.setup();
  }, [width, height, brickData]);

  return (
    <Brick
      {...rest}
      ref={box}
      style={Object.assign(
        {
          position: "absolute",
          transition: `width ${transition}, height ${transition}`,
        },
        rest.style
      )}
    >
      {children}
    </Brick>
  );
}
