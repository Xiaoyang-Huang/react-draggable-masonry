import { useMemo, useState } from "react";
import StateBrick from "./component/StateBrick";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`;
const Square = styled.div`
  flex: 1;
  border: 1px solid #aaa;
  box-sizing: border-box;
`;
const Button = styled.button`
  flex: 1;
`;

export default function ImpossibleKeepState() {
  const memoComponent = useMemo(() => <StateBrick key="abc" label="Count will reset while render to another place" />, []);
  const [display, setDisplay] = useState(1);

  return (
    <div>
      <Flex>
        <Square>{display === 0 ? memoComponent : null}</Square>
        <Square>{display === 1 ? memoComponent : null}</Square>
        <Square>{display === 2 ? memoComponent : null}</Square>
      </Flex>
      <Flex>
        <Button onClick={() => setDisplay(0)}>display</Button>
        <Button onClick={() => setDisplay(1)}>display</Button>
        <Button onClick={() => setDisplay(2)}>display</Button>
      </Flex>
    </div>
  );
}
