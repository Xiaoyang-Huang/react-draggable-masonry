import { useState } from "react";
import StyledBrick from "./StyledBrick";

export default function StateBrick({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  return (
    <StyledBrick key={label}>
      <p>{label}</p>
      <p>Count: {count}</p>
      <p>
        <button onClick={() => setCount((v) => ++v)}>+</button>
        <button onClick={() => setCount((v) => --v)}>-</button>
      </p>
    </StyledBrick>
  );
}
