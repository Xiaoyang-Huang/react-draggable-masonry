import { Wall } from "../Masonry";
import StyledDragableBrick from "./component/StyledDragableBrick";
import FixedBrick from "./component/FixedBrick";

const size = 100;
const tilesTotal = 100;

export default function Demo() {
  return (
    <Wall gap={10} columnWidth={size} rowHeight={size} onBrickChange={(v) => console.log(v)}>
      {new Array(tilesTotal).fill("test").map((item, i) => (i % 2 === 0 ? <StyledDragableBrick key={i} label={i + ""} /> : <FixedBrick key={i} label={i + ""} />))}
    </Wall>
  );
}
