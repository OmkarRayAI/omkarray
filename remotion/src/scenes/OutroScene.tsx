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

const links = ["X", "LinkedIn", "Substack", "Email"];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame: frame - 3,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
  });

  // Pulsing dot
  const pulse =
    0.8 + 0.2 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GrainOverlay />

      {/* Decorative lines */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: theme.accent,
          opacity: interpolate(mainProgress, [0, 1], [0, 0.06]),
          transform: "translateY(-120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: theme.accent,
          opacity: interpolate(mainProgress, [0, 1], [0, 0.06]),
          transform: "translateY(120px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* Status dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 30,
            opacity: interpolate(frame, [8, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#2d6a4f",
              opacity: pulse,
            }}
          />
          <span
            style={{
              fontFamily: theme.fontMono,
              fontSize: 11,
              color: theme.textMuted,
              letterSpacing: "0.08em",
            }}
          >
            OPEN TO COLLABORATE
          </span>
        </div>

        {/* Main URL */}
        <div
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 64,
            color: theme.text,
            letterSpacing: "-0.01em",
            opacity: mainProgress,
            transform: `scale(${interpolate(mainProgress, [0, 1], [0.9, 1])})`,
          }}
        >
          omkarray.com
        </div>

        {/* Divider */}
        <div
          style={{
            width: interpolate(mainProgress, [0, 1], [0, 80]),
            height: 1,
            backgroundColor: theme.accent,
            marginTop: 28,
            marginBottom: 28,
            opacity: 0.4,
          }}
        />

        {/* Social links */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          {links.map((link, i) => {
            const linkDelay = 12 + i * 5;
            const linkOpacity = interpolate(
              frame - linkDelay,
              [0, 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            const linkY = interpolate(frame - linkDelay, [0, 10], [10, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <span
                key={i}
                style={{
                  fontFamily: theme.fontSans,
                  fontSize: 15,
                  color: theme.textMuted,
                  letterSpacing: "0.06em",
                  opacity: linkOpacity,
                  transform: `translateY(${linkY}px)`,
                }}
              >
                {link}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom copyright */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontFamily: theme.fontMono,
          fontSize: 10,
          color: theme.textMuted,
          opacity: interpolate(frame, [20, 35], [0, 0.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          letterSpacing: "0.1em",
        }}
      >
        © 2026 OMKAR RAY
      </div>
    </AbsoluteFill>
  );
};
