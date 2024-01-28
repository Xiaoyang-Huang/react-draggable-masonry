import styled from "styled-components";
import { ContainerWrapper, ItemWrapper } from "../Masonry";

const ButtonGroup = styled.div`
  margin-bottom: 10px;
`;

const FullSizeDiv = styled.div`
  height: 100%;
  width: 100%;
  background: #003;
  color: #fff;
  border: #0a3 2px solid;
  box-sizing: border-box;
`;

const BlackBox = styled.div`
  position: absolute;
  background: #003;
  color: #fff;
  border: #0a3 2px solid;
  box-sizing: border-box;
`;
const FlexWrap = styled.div`
  display: flex;
  width: 100px;
  height: 100px;
`;

export default function TestSSM() {
  // return (
  //   <FlexWrap>
  //     <BlackBox
  //       ref={(n) => {
  //         if (!n) return;
  //         console.log(JSON.stringify(n.getBoundingClientRect()));
  //       }}
  //     ></BlackBox>
  //   </FlexWrap>
  // );
  return (
    <div>
      <ButtonGroup>
        <button>123</button>
      </ButtonGroup>
      <ContainerWrapper gap={10} columnWidth={100} rowHeight={100} onOrderChange={(v) => console.log(v)}>
        <ItemWrapper tileId={"search"} colSpan={10} rowSpan={1} style={{ height: "100%", width: "100%" }}>
          <FullSizeDiv>search</FullSizeDiv>
        </ItemWrapper>
        <ItemWrapper tileId={"ssm"} colSpan={10} rowSpan={5}>
          <FullSizeDiv
            ref={(n) => {
              if (!n) return;
              console.log(JSON.stringify(n.getBoundingClientRect()));
            }}
          >
            ssm
          </FullSizeDiv>
        </ItemWrapper>
      </ContainerWrapper>
    </div>
  );
}
