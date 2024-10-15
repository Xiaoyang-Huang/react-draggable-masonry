import { useState } from "react";
import StyledAnimateBrick from "./StyledAnimateBrick";

const sizes = [
  [1, 1],
  [2, 1],
  [2, 2],
  [4, 2],
];
export default function ResizeableBrick({ label, size = 0 }: { label: string; size?: number }) {
  const [sizeIndex, setSizeIndex] = useState(size);
  const [width, height] = sizes[sizeIndex];
  return (
    <StyledAnimateBrick
      width={width}
      height={height}
      onClick={() => {
        setSizeIndex((v) => ++v % sizes.length);
      }}
    >
      Resize {label}
    </StyledAnimateBrick>
  );
}
