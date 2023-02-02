import { PropsWithChildren, useState } from "react";
import styled from "styled-components";
import ContainerWrapper from "./component/ContainerWrapper";
import DragItem from "./component/DragButton";
import ItemWrapper from "./component/ItemWrapper";

const size = 100;

const MyItem = styled(ItemWrapper)`
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

const sizes = [
  [2, 1],
  [2, 2],
  [4, 2],
];
function Item({ children, id }: PropsWithChildren<{ id: string }>) {
  const [sizeIndex, setSizeIndex] = useState(Math.floor(Math.random() * sizes.length));
  const [width, height] = sizes[sizeIndex];
  // const width = Math.ceil(Math.random() * 3);
  // const height = Math.ceil(Math.random() * 5);
  // const [width, height] = sizes[Math.floor(Math.random() * sizes.length)];
  return (
    <MyItem
      id={id}
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

export default function Masonry() {
  return (
    <ContainerWrapper gap={10} columnWidth={size} rowHeight={size}>
      {new Array(100).fill("test").map((item, i) => (
        <Item key={i} id={i + ""}>
          <DragButton>Drag</DragButton>
          {i}
        </Item>
      ))}
    </ContainerWrapper>
  );
}
