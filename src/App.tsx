import styled from "styled-components";

const size = 100;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fill, ${size}px);
  grid-gap: 10px;
  grid-auto-flow: dense;
`;

const Item = styled.div<{
  width: number;
  height: number;
}>`
  background-color: blueviolet;
  line-height: ${(p) => p.height * size}px;
  ${(p) => (p.width > 1 ? "grid-column-end: span " + p.width + ";" : "") + (p.height > 1 ? "grid-row-end: span " + p.height + ";" : "")}
  color: white;
  font-family: system-ui;
  font-weight: 900;
  font-size: 1rem;
  text-align: center;
`;

const sizes = [
  [2, 1],
  [2, 2],
  [4, 2],
];
export default function Masonry() {
  return (
    <Wrapper>
      {new Array(20).fill("test").map((item, i) => {
        // const width = Math.ceil(Math.random() * 3);
        // const height = Math.ceil(Math.random() * 3);
        const [width, height] = sizes[Math.floor(Math.random() * sizes.length)];
        return <Item key={i} width={width} height={height}>{`${i}(${width},${height})`}</Item>;
      })}
    </Wrapper>
  );
}
