import React from "react";
import { Composition } from "remotion";
import { MotionVideo } from "./MotionVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OmkarRayMotion"
        component={MotionVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
