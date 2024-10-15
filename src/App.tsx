import Basic from "./demo/Basic";
import ExternalSwapMode from "./demo/ExternalSwapMode";
import Demo from "./demo/Demo";
import DragBrickCrossWall from "./demo/DragBrickCrossWall";
import { createElement, useState } from "react";
import styled from "styled-components";
// import ImpossibleKeepState from "./demo/ImpossibleKeepState";

const demoes = {
  Basic,
  ExternalSwapMode,
  Demo,
  DragBrickCrossWall,
};

const DemoButton = styled.button<{ active: boolean }>`
  margin-right: 5px;
  ${(p) => (p.active ? "background:white" : "")}
`;

export default function Masonry() {
  const [currentDemo, setCurrentDemo] = useState("Demo");
  return (
    <div>
      <h1>
        Demoes:{" "}
        {Object.keys(demoes).map((key) => (
          <DemoButton active={key === currentDemo} onClick={() => setCurrentDemo(key)} key={key}>
            {key}
          </DemoButton>
        ))}
      </h1>
      <div>{createElement(demoes[currentDemo as keyof typeof demoes], null, null)}</div>
    </div>
  );
}
