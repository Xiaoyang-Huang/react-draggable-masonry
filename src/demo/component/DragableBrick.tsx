import StyledBrick from "./StyledBrick";
import { useState } from "react";

export default function DragableBrick({ label }: { label: string }) {
  const [dragable, setDragable] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <StyledBrick onPointerDown={() => setDragable(true)} onDragEnd={() => setDragable(false)} draggable={dragable}>
      <p>Dragable {label}</p>
      <p>Count: {count}</p>
      <p>
        <button onClick={() => setCount((v) => ++v)}>+</button>
        <button onClick={() => setCount((v) => --v)}>-</button>
      </p>
    </StyledBrick>
  );
}
