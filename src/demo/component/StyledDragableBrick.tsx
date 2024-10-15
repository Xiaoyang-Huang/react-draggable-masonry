import styled from "styled-components";
import { useState } from "react";
import AnimateBrick from "./AnimateBrick";

const StyledWrap = styled(AnimateBrick)`
  width: 100%;
  background-color: blueviolet;
  color: white;
  font-family: system-ui;
  font-weight: 900;
  font-size: 1rem;
  text-align: center;
  user-select: none;
  border: 3px solid #6800ca;
  box-sizing: border-box;

  .in-drag & {
    background-color: white;
  }
`;

const sizes = [
  [1, 1],
  [2, 1],
  [2, 2],
  [4, 2],
];

export default function StyledDragableBrick({ label }: { label: string }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [width, height] = sizes[sizeIndex];
  return (
    <StyledWrap
      width={width}
      height={height}
      onClick={() => {
        setSizeIndex((v) => ++v % sizes.length);
      }}
      draggable={true}
    >
      {label}
      <p>Drag me</p>
    </StyledWrap>
  );
}
