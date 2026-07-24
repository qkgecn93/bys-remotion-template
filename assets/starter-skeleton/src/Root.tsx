import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { DUR, FPS, WIDTH, HEIGHT } from "./theme";

export const Root: React.FC = () => (
  <Composition
    id="MyVideo"
    component={Main}
    durationInFrames={Math.round(DUR * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
