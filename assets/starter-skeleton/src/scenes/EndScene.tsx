import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, FONT } from "../theme";
import { SHADOW, useRise, usePop } from "../components/common";

/** 结尾引导页：点赞 / 收藏 / 关注 / 转发。落款交给底部字幕，这里不重复 */
export const EndScene: React.FC<{ at?: number; cta?: string }> = ({
  at = 0,
  cta = "觉得有用的话",
}) => {
  const rise = useRise(at, 0.6);
  const items = ["👍 点赞", "⭐ 收藏", "➕ 关注", "↗️ 转发"];
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: theme.text,
          opacity: rise.opacity,
          transform: `translateY(${rise.y}px)`,
          ...SHADOW,
        }}
      >
        {cta}
      </div>
      <div style={{ display: "flex", gap: 36 }}>
        {items.map((it, i) => (
          <EndChip key={it} label={it} at={at + 0.3 + i * 0.2} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const EndChip: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const s = usePop(at);
  return (
    <div
      style={{
        transform: `scale(${s})`,
        fontSize: 38,
        fontWeight: 700,
        color: theme.text,
        background: theme.bgPanel,
        border: `1.5px solid rgba(${theme.accentRGB},0.5)`,
        boxShadow: `0 0 24px rgba(${theme.accentRGB},0.2)`,
        borderRadius: 999,
        padding: "18px 34px",
      }}
    >
      {label}
    </div>
  );
};
