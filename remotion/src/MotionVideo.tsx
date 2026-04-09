import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { DeepdivesScene } from "./scenes/DeepdivesScene";
import { ThesisScene } from "./scenes/ThesisScene";
import { AiMlScene } from "./scenes/AiMlScene";
import { StudyPlanScene } from "./scenes/StudyPlanScene";
import { OutroScene } from "./scenes/OutroScene";
import { theme } from "./theme";

export const MotionVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        overflow: "hidden",
      }}
    >
      {/* Scene 1: Intro - Logo + Name + Tagline (0-4.5s) */}
      <Sequence from={0} durationInFrames={135}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Deepdives showcase (4.5-9s) */}
      <Sequence from={135} durationInFrames={135}>
        <DeepdivesScene />
      </Sequence>

      {/* Scene 3: Thesis cards (9-13s) */}
      <Sequence from={270} durationInFrames={120}>
        <ThesisScene />
      </Sequence>

      {/* Scene 4: AI/ML Topics (13-16s) */}
      <Sequence from={390} durationInFrames={90}>
        <AiMlScene />
      </Sequence>

      {/* Scene 5: 80-Day Study Plan (16-18s) */}
      <Sequence from={480} durationInFrames={60}>
        <StudyPlanScene />
      </Sequence>

      {/* Scene 6: Outro - CTA + Socials (18-20s) */}
      <Sequence from={540} durationInFrames={60}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
