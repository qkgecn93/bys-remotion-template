import React from "react";
import { theme, FONT } from "../theme";
import { Kicker } from "./common";

/**
 * 半透明发光信息卡：英文小标 + 中文要点。
 * 用于口播两侧的浮层卡、或纯动画里的要点卡。
 */
export const InfoCard: React.FC<{
  kicker?: string;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}> = ({ kicker, title, desc, icon, width = 420, style }) => (
  <div
    style={{
      width,
      fontFamily: FONT,
      background: theme.bgPanel,
      border: `1.5px solid rgba(${theme.accentRGB},0.45)`,
      boxShadow: `0 0 32px rgba(${theme.accentRGB},0.18), inset 0 0 24px rgba(${theme.accentRGB},0.06)`,
      borderRadius: 20,
      padding: "26px 30px",
      backdropFilter: "blur(6px)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      ...style,
    }}
  >
    {icon && <div style={{ fontSize: 40 }}>{icon}</div>}
    {kicker && <Kicker>{kicker}</Kicker>}
    <div style={{ fontSize: 38, fontWeight: 800, color: theme.text }}>
      {title}
    </div>
    {desc && (
      <div style={{ fontSize: 26, lineHeight: 1.5, color: theme.textDim }}>
        {desc}
      </div>
    )}
  </div>
);
