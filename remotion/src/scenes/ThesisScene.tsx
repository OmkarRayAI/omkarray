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

const theses = [
  {
    number: "01",
    theme: "Voice AI",
    title: "Mixpanel for Voice AI",
    tags: ["Voice Analytics", "Conversation Intelligence", "Product-Led Growth"],
  },
  {
    number: "02",
    theme: "AI Infrastructure",
    title: "RL Environments Are the New Data Moat",
    tags: ["Reinforcement Learning", "AI Infrastructure", "Agent Training"],
  },
  {
    number: "03",
    theme: "Physical AI",
    title: "Physical AI & Robotics — The India Thesis",
    tags: ["Robotics", "India Supply Chain", "Rare Earth"],
  },
];

export const ThesisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
  const titleProgress = spring({
    frame: frame - 3,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.7 },
  });

  // Exit
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
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
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 50 }}>
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
            Structured Thinking
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
            Thesis
          </div>
          <div
            style={{
              width: interpolate(titleProgress, [0, 1], [0, 60]),
              height: 2,
              backgroundColor: theme.accent,
              marginTop: 16,
            }}
          />
        </div>

        {/* Thesis cards - horizontal layout */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flex: 1,
          }}
        >
          {theses.map((thesis, i) => {
            const cardDelay = 15 + i * 12;
            const cardProgress = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 14, stiffness: 65, mass: 0.9 },
            });

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: theme.surface,
                  borderRadius: 14,
                  padding: "32px 28px",
                  opacity: cardProgress,
                  transform: `translateX(${interpolate(cardProgress, [0, 1], [40, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid rgba(255,255,255,0.04)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Large background number */}
                <div
                  style={{
                    position: "absolute",
                    top: -15,
                    right: 10,
                    fontFamily: theme.fontSerif,
                    fontSize: 140,
                    fontWeight: 400,
                    color: theme.accent,
                    opacity: 0.06,
                    lineHeight: 1,
                  }}
                >
                  {thesis.number}
                </div>

                <span
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 13,
                    color: theme.accent,
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  {thesis.number}
                </span>

                <span
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: theme.textMuted,
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {thesis.theme}
                </span>

                <span
                  style={{
                    fontFamily: theme.fontSerif,
                    fontSize: 24,
                    color: theme.text,
                    lineHeight: 1.3,
                    marginBottom: 24,
                    flex: 1,
                  }}
                >
                  {thesis.title}
                </span>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {thesis.tags.map((tag, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: theme.fontMono,
                        fontSize: 9,
                        color: theme.textMuted,
                        padding: "3px 8px",
                        border: `1px solid rgba(255,255,255,0.08)`,
                        borderRadius: 3,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
