import { PropsWithChildren, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ContainerWrapper, { MasonryRef } from "./component/ContainerWrapper";
import DragItem from "./component/DragButton";
import ItemWrapper, { TileId } from "./component/ItemWrapper";

const size = 100;

const MyItem = styled(ItemWrapper)`
  transition: all 300ms;
  background-color: blueviolet;
  color: white;
  font-family: system-ui;
  font-weight: 900;
  font-size: 1rem;
  text-align: center;
  user-select: none;
  border: 3px solid #6800ca;
`;

const DragButton = styled(DragItem)`
  position: absolute;
  top: 10px;
  left: 50%;
  height: 20px;
  transform: translateX(-50%);
  background-color: #00a2ff;
  line-height: 20px;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  margin-bottom: 10px;
`;

const sizes = [
  [2, 1],
  [2, 2],
  [4, 2],
];
function Item({ children, tileId }: PropsWithChildren<{ tileId: TileId }>) {
  // const [sizeIndex, setSizeIndex] = useState(Math.floor(Math.random() * sizes.length));
  const [sizeIndex, setSizeIndex] = useState(0);
  const [width, height] = sizes[sizeIndex];
  // const [width, height] = sizes[0];
  // const width = Math.ceil(Math.random() * 3);
  // const height = Math.ceil(Math.random() * 5);
  // const [width, height] = sizes[Math.floor(Math.random() * sizes.length)];

  return (
    <MyItem
      tileId={tileId}
      colSpan={width}
      rowSpan={height}
      onClick={() => setSizeIndex((v) => ++v % sizes.length)}
      style={{
        lineHeight: height * size + "px",
      }}
    >
      {children}
    </MyItem>
  );
}

const tilesTotal = 10;

export default function Masonry() {
  const masonryRef = useRef<MasonryRef>(null);

  useEffect(() => {
    if (!masonryRef.current) return;
    masonryRef.current.setOrder([8, 2, 3, 4, 6]);
    const randomSwitch = (e: KeyboardEvent) => {
      if (e.key === "s") {
        const arr = new Array(tilesTotal).fill("test").map((item, index) => index);
        const a = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
        const b = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
        console.log(`switch ${a} and ${b}`);
        masonryRef.current?.switchOrder(a, b);
      }
    };
    document.addEventListener("keydown", randomSwitch);
    return () => {
      document.removeEventListener("keydown", randomSwitch);
    };
  }, []);

  return (
    <div>
      <ButtonGroup>
        <button>123</button>
      </ButtonGroup>
      <ContainerWrapper ref={masonryRef} gap={10} columnWidth={size} rowHeight={size} onOrderChange={(v) => console.log(v)}>
        {new Array(tilesTotal).fill("test").map((item, i) => (
          <Item key={i} tileId={i}>
            <DragButton>Drag</DragButton>
            {i}
          </Item>
        ))}
      </ContainerWrapper>
    </div>
  );
}
