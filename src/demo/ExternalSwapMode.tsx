import { ReactNode, useState } from "react";
import ResizeableBrick from "./component/ResizeableBrick";
import DragableBrick from "./component/DragableBrick";
import StateBrick from "./component/StateBrick";
import { Wall } from "../Masonry";

const getNode = (label: string, index: number) => {
  switch (true) {
    case index % 3 === 1:
      return <StateBrick key={label} label={label} />;
    case index % 3 === 2:
      return <ResizeableBrick key={label} label={label} />;
    case index % 3 === 0:
    default:
      return <DragableBrick key={label} label={label} />;
  }
};

export default function ExternalSwapMode() {
  const [bricks, setBricks] = useState<Array<{ key: string; node: ReactNode }>>(
    new Array(10).fill(1).map((never, index) => {
      const label = "brick " + index;
      return { key: label, node: getNode(label, index) };
    })
  );

  return (
    <div>
      <Wall
        columnWidth={200}
        rowHeight={200}
        swapMode="external"
        onBrickChange={(bricks) => {
          console.log(bricks.map((b) => b.config.id));
          const keySort = bricks.map((b) => b.config.id);
          setBricks((v) => v.slice().sort(({ key: keyA }, { key: keyB }) => keySort.indexOf(keyA) - keySort.indexOf(keyB)));
        }}
      >
        {bricks.map((i) => i.node)}
      </Wall>
      <button
        onClick={() =>
          setBricks((v) => {
            console.log(bricks.map((b) => b.key));
            const index = v.length;
            const label = "brick " + index;
            return [...v, { key: label, node: getNode(label, index) }];
          })
        }
      >
        Add
      </button>
      <button onClick={() => setBricks((v) => v.slice(0, v.length - 1))}>Remove</button>
    </div>
  );
}
