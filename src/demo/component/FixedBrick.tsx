import styled from "styled-components";
import { Brick } from "../../Masonry";

const StyleWrap = styled(Brick)`
  width: 100%;
  background-color: blueviolet;
  color: white;
  font-family: system-ui;
  font-weight: 900;
  font-size: 1rem;
  text-align: center;
  user-select: none;
  border: 3px solid #6800ca;
`;
export default function FixedBrick({ label }: { label: string }) {
  return <StyleWrap allowToSwap={false}>{label}</StyleWrap>;
}
