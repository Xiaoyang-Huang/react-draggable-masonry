import { PropsWithChildren, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ContainerWrapper, { MasonryRef } from "../component/ContainerWrapper";
import DragItem from "../component/DragButton";
import ItemWrapper, { TileId } from "../component/ItemWrapper";

const size = 100;

const FixItem = styled.div`
  background-color: blueviolet;
  color: white;
  font-family: system-ui;
  font-weight: 900;
  font-size: 1rem;
  text-align: center;
  user-select: none;
  border: 3px solid #6800ca;
  position: relative;

  .indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

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

  .indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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
  z-index: 999;
`;

const ButtonGroup = styled.div`
  margin-bottom: 10px;
`;

const sizes = [
  [2, 1],
  [2, 2],
  [4, 2],
];
function Item({ children, tileId, size = 0 }: PropsWithChildren<{ tileId: TileId; size?: number }>) {
  // const [sizeIndex, setSizeIndex] = useState(Math.floor(Math.random() * sizes.length));
  const [sizeIndex, setSizeIndex] = useState(size);
  const [width, height] = sizes[sizeIndex];
  // const [width, height] = sizes[0];
  // const width = Math.ceil(Math.random() * 3);
  // const height = Math.ceil(Math.random() * 5);
  // const [width, height] = sizes[Math.floor(Math.random() * sizes.length)];
  return (
    <MyItem tileId={tileId} colSpan={width} rowSpan={height} onClick={() => setSizeIndex((v) => ++v % sizes.length)}>
      {children}
    </MyItem>
  );
}

// const simple = true;
export default function TestDefault() {
  const [tilesTotal, setTilesTotal] = useState(10);
  const masonryRef = useRef<MasonryRef>(null);

  useEffect(() => {
    if (!masonryRef.current) return;
    masonryRef.current.setOrder([8, "fixed-.$1", "fixed-.$3", 4, 6]);
  }, []);

  useEffect(() => {
    if (!masonryRef.current) return;
    const keyboardHandle = (e: KeyboardEvent) => {
      if (e.key === "s") {
        const arr = new Array(tilesTotal).fill("test").map((item, index) => index);
        const a = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
        const b = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
        console.log(`switch ${a} and ${b}`);
        masonryRef.current?.switchOrder(a, b);
      } else if (e.key === "a") {
        setTilesTotal((v) => ++v);
      } else if (e.key === "m") {
        setTilesTotal((v) => --v);
      }
    };
    document.addEventListener("keydown", keyboardHandle);
    return () => {
      document.removeEventListener("keydown", keyboardHandle);
    };
  }, [tilesTotal]);

  // return (
  //   <div>
  //     <ButtonGroup>
  //       <button>123</button>
  //     </ButtonGroup>
  //     <ContainerWrapper ref={masonryRef} bounded={true} gap={10} columnWidth={size} rowHeight={size} onOrderChange={(v) => console.log(v)}>
  //       {new Array(tilesTotal).fill("test").map((item, i) =>
  //         simple || i % 2 === 0 ? (
  //           <Item key={i} tileId={i}>
  //             <DragButton>Drag</DragButton>
  //             <div className="indicator">{i}</div>
  //           </Item>
  //         ) : (
  //           <FixItem key={i}>
  //             <div className="indicator">{i}</div>
  //           </FixItem>
  //         )
  //       )}
  //     </ContainerWrapper>
  //   </div>
  // );

  return (
    <div>
      <ButtonGroup>
        <button>123</button>
      </ButtonGroup>
      <ContainerWrapper ref={masonryRef} bounded={true} gap={10} columnWidth={size} rowHeight={size} onOrderChange={(v) => console.log(v)}>
        {new Array(tilesTotal)
          .fill("test")
          .map((item, i) =>
            i % 2 === 0 ? (
              <Item key={i} tileId={i}>
                <DragButton>Drag</DragButton>
                <div className="indicator">{i}</div>
              </Item>
            ) : (
              <FixItem key={i}>
                <div className="indicator">{i}</div>
              </FixItem>
            )
          )
          .concat([
            <Item key={tilesTotal} tileId={tilesTotal} size={2}>
              <ContainerWrapper gap={5} columnWidth={size / 2} rowHeight={size / 2} bounded={true} onOrderChange={(v) => console.log(v)} style={{ width: "100%", height: "100%" }}>
                {new Array(tilesTotal).fill("test").map((item, i) =>
                  i % 2 === 0 ? (
                    <Item key={i} tileId={i}>
                      <DragButton>Drag</DragButton>
                      <div className="indicator">{i}</div>
                    </Item>
                  ) : (
                    <FixItem key={i}>
                      <div className="indicator">{i}</div>
                    </FixItem>
                  )
                )}
              </ContainerWrapper>
            </Item>,
          ])}
      </ContainerWrapper>
      <ButtonGroup>
        <button>456</button>
      </ButtonGroup>
      <ContainerWrapper gap={10} columnWidth={size} rowHeight={size} onOrderChange={(v) => console.log(v)}>
        {new Array(tilesTotal).fill("test").map((item, i) =>
          i % 2 === 0 ? (
            <Item key={i} tileId={i}>
              <DragButton>Drag</DragButton>
              <div className="indicator">{i}</div>
            </Item>
          ) : (
            <FixItem key={i}>
              <div className="indicator">{i}</div>
            </FixItem>
          )
        )}
      </ContainerWrapper>
    </div>
  );
}
