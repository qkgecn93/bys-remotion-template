import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTIONS } from "../captions";
import { theme, FONT, HEIGHT } from "../theme";
import { Hi } from "./common";

/**
 * 底部字幕。
 * - minStart（秒）：之前的字幕不显示（钩子段用前景大字，不要底部字幕）。
 * - 关键词用【】标记 → 自动高亮发光。
 * - 句尾不加标点；底部留安全区（避开平台 UI）。
 */
export const Captions: React.FC<{ minStart?: number }> = ({
  minStart = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const cur = CAPTIONS.find(
    (c) => nowMs >= c.startMs && nowMs < c.endMs && c.startMs / 1000 >= minStart,
  );
  if (!cur) return null;

  // 解析【】高亮
  const parts = cur.text.split(/(【[^】]*】)/g).filter(Boolean);
  const safeBottom = HEIGHT > 1600 ? 320 : 120; // 竖屏留更大安全区

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: safeBottom,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: HEIGHT > 1600 ? 56 : 44,
          fontWeight: 700,
          color: theme.text,
          background: "rgba(5,8,12,0.62)",
          border: `1px solid ${theme.panelBorder}`,
          borderRadius: 14,
          padding: "14px 36px",
          maxWidth: "86%",
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {parts.map((p, i) =>
          p.startsWith("【") ? (
            <Hi key={i}>{p.slice(1, -1)}</Hi>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
};
