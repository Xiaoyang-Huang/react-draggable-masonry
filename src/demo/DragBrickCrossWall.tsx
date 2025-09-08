import { useState } from "react";
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

const bricks = new Array(20).fill(1).map((never, index) => {
  const label = "brick " + index;
  return { key: label, node: getNode(label, index) };
});

export default function DragBrickCrossWall() {
  const [bricksInA, setBricksInA] = useState<Array<string>>(bricks.slice(0, Math.floor(bricks.length / 2)).map((b) => b.key));
  const [bricksInB, setBricksInB] = useState<Array<string>>(bricks.slice(Math.floor(bricks.length / 2), bricks.length).map((b) => b.key));
  const [bricksInC, setBricksInC] = useState<Array<string>>([]);

  // console.log(bricks, bricksInA, bricksInB, bricksInC);
  return (
    <div>
      <Wall
        columnWidth={200}
        rowHeight={200}
        swapMode="external"
        allowDragInSpace={true}
        onBrickChange={(bricks) => {
          const keySort = bricks.map((b) => b.config.id);
          console.log("wall A change:", keySort);
          setBricksInA(keySort);
        }}
      >
        {bricks
          .filter((b) => bricksInA.includes(b.key))
          .sort(({ key: keyA }, { key: keyB }) => bricksInA.indexOf(keyA) - bricksInA.indexOf(keyB))
          .map((i) => i.node)}
      </Wall>
      <Wall
        columnWidth={200}
        rowHeight={200}
        swapMode="external"
        allowDragInSpace={true}
        onBrickChange={(bricks) => {
          const keySort = bricks.map((b) => b.config.id);
          console.log("wall B change:", keySort);
          setBricksInB(keySort);
        }}
      >
        {bricks
          .filter((b) => bricksInB.includes(b.key))
          .sort(({ key: keyA }, { key: keyB }) => bricksInB.indexOf(keyA) - bricksInB.indexOf(keyB))
          .map((i) => i.node)}
      </Wall>
      <Wall
        columnWidth={200}
        rowHeight={200}
        swapMode="external"
        onBrickChange={(bricks) => {
          const keySort = bricks.map((b) => b.config.id);
          console.log("wall C change:", keySort);
          setBricksInC(keySort);
        }}
      >
        {bricks
          .filter((b) => bricksInC.includes(b.key))
          .sort(({ key: keyA }, { key: keyB }) => bricksInC.indexOf(keyA) - bricksInC.indexOf(keyB))
          .map((i) => i.node)}
      </Wall>
      <button
        onClick={() => {
          const index = bricks.length;
          const label = "brick " + index;
          bricks.push({ key: label, node: getNode(label, index) });
          setBricksInC((v) => {
            return [...v, label];
          });
        }}
      >
        Add
      </button>
      <button
        onClick={() => {
          const lastBrick = bricks.pop();
          if (lastBrick) {
            const lastKey = lastBrick.key;
            setBricksInA((v) => v.filter((k) => k !== lastKey));
            setBricksInB((v) => v.filter((k) => k !== lastKey));
            setBricksInC((v) => v.filter((k) => k !== lastKey));
          }
        }}
      >
        Remove
      </button>
    </div>
  );
}
