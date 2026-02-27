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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Horizontal line reveal
  const lineWidth = interpolate(frame, [8, 35], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "OR" logo
  const logoOpacity = interpolate(frame, [5, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.6 },
  });

  // Name reveal
  const nameProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.8 },
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [55, 70], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bio text
  const bioOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Decorative dots
  const dotOpacity = interpolate(frame, [20, 35], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <GrainOverlay />

      {/* Decorative corner elements */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          width: 40,
          height: 40,
          borderTop: `1px solid ${theme.accent}`,
          borderLeft: `1px solid ${theme.accent}`,
          opacity: dotOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          width: 40,
          height: 40,
          borderBottom: `1px solid ${theme.accent}`,
          borderRight: `1px solid ${theme.accent}`,
          opacity: dotOpacity,
        }}
      />

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* OR logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${interpolate(logoScale, [0, 1], [0.8, 1])})`,
            fontFamily: theme.fontSerif,
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: "0.15em",
            color: theme.accent,
            marginBottom: 30,
          }}
        >
          OR
        </div>

        {/* Horizontal line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: theme.accent,
            marginBottom: 35,
            opacity: 0.5,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontFamily: theme.fontSerif,
            fontSize: 82,
            fontWeight: 400,
            color: theme.text,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            opacity: nameProgress,
            transform: `translateY(${interpolate(nameProgress, [0, 1], [25, 0])}px)`,
          }}
        >
          Omkar Ray
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: theme.fontSans,
            fontSize: 20,
            fontWeight: 300,
            color: theme.textMuted,
            letterSpacing: "0.05em",
            marginTop: 20,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          crafting the future of AI-native products
        </div>

        {/* Bio */}
        <div
          style={{
            fontFamily: theme.fontSans,
            fontSize: 16,
            fontWeight: 300,
            color: theme.textMuted,
            opacity: bioOpacity * 0.6,
            marginTop: 16,
            maxWidth: 500,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          curious, optimistic builder creating experiences that feel simple,
          joyful, and a little bit magical.
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: interpolate(frame, [40, 55], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#2d6a4f",
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
          omkarray.com
        </span>
      </div>
    </AbsoluteFill>
  );
};
