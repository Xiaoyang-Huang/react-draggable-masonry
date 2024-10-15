import { useState } from "react";
import PrintRender from "./component/PrintRender";
import ResizeableBrick from "./component/ResizeableBrick";
import StateBrick from "./component/StateBrick";
import StyledBrick from "./component/StyledBrick";
import DragableBrick from "./component/DragableBrick";
import { Wall } from "../Masonry";

export default function Basic() {
  const [size, setSize] = useState(4);
  return (
    <div>
      <Wall columnWidth={200} rowHeight={200} onBrickChange={(bricks) => console.log(bricks.map((i) => i.config.id))}>
        Fixed content A
        {new Array(size).fill(1).map((never, index) => {
          const label = "brick " + index;
          switch (true) {
            case index % 3 === 1:
              return <StyledBrick key={label}>{label}</StyledBrick>;
            case index % 3 === 2:
              return <ResizeableBrick key={label} label={label} />;
            case index % 3 === 0:
            default:
              return <StateBrick key={label} label={label} />;
          }
        })}
        Fixed content B
        <DragableBrick key={"aaa"} label={"aaa"} />
        <PrintRender />
        <DragableBrick key={"bbb"} label={"bbb"} />
      </Wall>
      <button onClick={() => setSize((v) => ++v)}>Add</button>
      <button onClick={() => setSize((v) => Math.max(0, --v))}>Remove</button>
    </div>
  );
}
