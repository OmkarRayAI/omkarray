import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { theme } from "../theme";
import { GrainOverlay } from "../components/GrainOverlay";

const phases = [
  {
    label: "Phase 1",
    title: "Foundations",
    days: "Days 1–10",
    topics: "Value Class · Backward Pass · Autograd · MLP · Language Modeling",
  },
  {
    label: "Phase 2",
    title: "Deep Networks",
    days: "Days 11–20",
    topics:
      "Activations · BatchNorm · Self-Attention · Transformers · GPT",
  },
  {
    label: "Phase 3",
    title: "LLM Architecture",
    days: "Days 21–35",
    topics: "Tokenization · Training · LoRA · RLHF · DPO · Evaluation",
  },
];

export const StudyPlanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - 3,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.6 },
  });

  const exitOpacity = interpolate(frame, [42, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bar animation
  const progressWidth = interpolate(frame, [15, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        opacity: exitOpacity,
      }}
    >
      <GrainOverlay />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "80px 120px",
          height: "100%",
          justifyContent: "center",
        }}
      >
        {/* Big feature number */}
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 14,
            letterSpacing: "0.15em",
            color: theme.accent,
            opacity: titleProgress,
            marginBottom: 8,
          }}
        >
          80-DAY CURRICULUM
        </div>

        <div
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 52,
            color: theme.text,
            letterSpacing: "-0.02em",
            opacity: titleProgress,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [15, 0])}px)`,
            marginBottom: 12,
          }}
        >
          LLM & RAG Study Plan
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 500,
            height: 3,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            marginBottom: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressWidth}%`,
              height: "100%",
              backgroundColor: theme.accent,
              borderRadius: 2,
            }}
          />
        </div>

        {/* Phase cards */}
        <div style={{ display: "flex", gap: 24 }}>
          {phases.map((phase, i) => {
            const cardDelay = 12 + i * 8;
            const cardProgress = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 16, stiffness: 80, mass: 0.7 },
            });

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "24px 22px",
                  backgroundColor: theme.surface,
                  borderRadius: 10,
                  border: `1px solid rgba(255,255,255,0.04)`,
                  opacity: cardProgress,
                  transform: `translateY(${interpolate(cardProgress, [0, 1], [25, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: theme.accent,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {phase.label} · {phase.days}
                </div>
                <div
                  style={{
                    fontFamily: theme.fontSerif,
                    fontSize: 22,
                    color: theme.text,
                    marginBottom: 12,
                  }}
                >
                  {phase.title}
                </div>
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 12,
                    color: theme.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {phase.topics}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
