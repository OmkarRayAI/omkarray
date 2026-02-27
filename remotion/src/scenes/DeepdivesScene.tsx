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
import { FadeSlide } from "../components/AnimatedText";

const deepdives = [
  { tag: "Voice AI", title: "Bolna AI", color: "#2d6a4f" },
  { tag: "Voice AI", title: "Smallest.ai", color: "#2d6a4f" },
  { tag: "Voice AI", title: "Ringg.ai", color: "#2d6a4f" },
  { tag: "Infrastructure", title: "Building a Datacenter", color: "#1a3a5c" },
  {
    tag: "India E-Commerce",
    title: "Indian E-Comm × GenAI",
    color: "#7a1f2e",
  },
];

export const DeepdivesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
  const titleProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.7 },
  });

  // Exit
  const exitOpacity = interpolate(frame, [115, 135], [1, 0], {
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
        {/* Section header */}
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
            Deep Explorations
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
            Deepdives
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

        {/* Cards grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            flex: 1,
          }}
        >
          {deepdives.map((item, i) => {
            const cardDelay = 20 + i * 10;
            const cardProgress = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 16, stiffness: 70, mass: 0.8 },
            });

            return (
              <div
                key={i}
                style={{
                  width: i < 3 ? "calc(33.33% - 14px)" : "calc(50% - 10px)",
                  backgroundColor: theme.surface,
                  borderRadius: 12,
                  padding: "28px 24px",
                  opacity: cardProgress,
                  transform: `translateY(${interpolate(cardProgress, [0, 1], [30, 0])}px) scale(${interpolate(cardProgress, [0, 1], [0.95, 1])})`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  border: `1px solid rgba(255,255,255,0.04)`,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: item.color,
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    backgroundColor: `${item.color}18`,
                    borderRadius: 4,
                    alignSelf: "flex-start",
                  }}
                >
                  {item.tag}
                </span>
                <span
                  style={{
                    fontFamily: theme.fontSerif,
                    fontSize: 22,
                    color: theme.text,
                    fontWeight: 400,
                  }}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
