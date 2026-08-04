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

const topics = [
  { title: "Transformers", subtitle: "Attention Is All You Need — and Why" },
  {
    title: "Reinforcement Learning",
    subtitle: "Learning from Reward, Not Labels",
  },
  { title: "AI Agents", subtitle: "Agents That Plan, Act, and Recover" },
  {
    title: "LLM Evaluation",
    subtitle: "When Benchmarks Lie — The Maths of LLM Evals",
  },
  { title: "RAG", subtitle: "Retrieval-Augmented Generation Done Right" },
  { title: "Multimodal AI", subtitle: "One Model, Every Modality" },
  {
    title: "Gradient Descent",
    subtitle: "The Geometry of Gradient Descent",
  },
  { title: "PyTorch", subtitle: "Tensors to Multi-GPU — Visual Map" },
];

export const AiMlScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - 3,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.7 },
  });

  const exitOpacity = interpolate(frame, [72, 90], [1, 0], {
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
          padding: "80px 120px",
          height: "100%",
          gap: 80,
        }}
      >
        {/* Left side - header */}
        <div style={{ width: 380, flexShrink: 0 }}>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 12,
              letterSpacing: "0.12em",
              color: theme.accent,
              textTransform: "uppercase",
              opacity: titleProgress,
              marginBottom: 12,
            }}
          >
            Core Areas
          </div>
          <div
            style={{
              fontFamily: theme.fontSerif,
              fontSize: 56,
              color: theme.text,
              letterSpacing: "-0.02em",
              opacity: titleProgress,
              transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            AI/ML
          </div>
          <div
            style={{
              width: interpolate(titleProgress, [0, 1], [0, 60]),
              height: 2,
              backgroundColor: theme.accent,
              marginTop: 16,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 15,
              color: theme.textMuted,
              lineHeight: 1.6,
              opacity: interpolate(frame, [15, 28], [0, 0.7], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Machine learning areas I actively study, build with, and write
            about.
          </div>
        </div>

        {/* Right side - topic list */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {topics.map((topic, i) => {
            const itemDelay = 10 + i * 5;
            const itemProgress = spring({
              frame: frame - itemDelay,
              fps,
              config: { damping: 20, stiffness: 100, mass: 0.6 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                  padding: "12px 0",
                  borderBottom: `1px solid rgba(255,255,255,0.05)`,
                  opacity: itemProgress,
                  transform: `translateX(${interpolate(itemProgress, [0, 1], [30, 0])}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fontSerif,
                    fontSize: 20,
                    color: theme.text,
                    minWidth: 220,
                  }}
                >
                  {topic.title}
                </span>
                <span
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 13,
                    color: theme.textMuted,
                    fontStyle: "italic",
                  }}
                >
                  {topic.subtitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
