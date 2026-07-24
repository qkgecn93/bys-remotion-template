import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, FONT } from "../theme";
import { CAPTIONS } from "../captions";

// ---------- 缓动 ----------
// ci：丝滑出场曲线（快进慢停），全项目统一用它，禁止 CSS transition
export const ci = Easing.bezier(0.16, 1, 0.3, 1);
// 回弹（用于图标/数字弹出）
export const OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1);

// ---------- 时间工具 ----------
/** 场景内相对秒 → 帧 */
export const sec = (s: number, fps: number) => Math.round(s * fps);

/**
 * cueAt(segStartSec, captionIndex)
 * 返回"第 N 条字幕开口说话"相对当前场景起点的秒数。
 * 元素出现要跟读音走：说到那句，元素才出现。
 */
export const cueAt = (segStartSec: number, captionIndex: number) => {
  const c = CAPTIONS[captionIndex];
  if (!c) return 0;
  return Math.max(0, c.startMs / 1000 - segStartSec);
};

// ---------- 动画 Hook ----------
/** 上浮入场：返回 {opacity, y}，from 为相对场景起点的秒 */
export const useRise = (fromSec: number, durSec = 0.6) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(
    frame,
    [sec(fromSec, fps), sec(fromSec + durSec, fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ci },
  );
  return { opacity: t, y: (1 - t) * 40, t };
};

/** 弹出入场（带回弹）：返回 scale */
export const usePop = (fromSec: number, durSec = 0.5) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    [sec(fromSec, fps), sec(fromSec + durSec, fps)],
    [0.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OVERSHOOT },
  );
};

// ---------- 文字表现 ----------
/** 前景文字强阴影：压在视频/图片上的文字必须带它，保证清晰 */
export const SHADOW: React.CSSProperties = {
  textShadow:
    "0 2px 8px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,1)",
};

/** 关键词高亮：主色 + 发光 */
export const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      color: theme.accent,
      textShadow: `0 0 24px rgba(${theme.accentRGB},0.8), 0 2px 8px rgba(0,0,0,0.9)`,
    }}
  >
    {children}
  </span>
);

/** 英文小标（卡片/段落顶部的 kicker） */
export const Kicker: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 24,
      letterSpacing: 6,
      textTransform: "uppercase",
      color: theme.accentSoft,
      opacity: 0.9,
    }}
  >
    {children}
  </div>
);

/**
 * Scrim：中心暗场。opacity 必须绑定内容出现进度——
 * 有文字才压暗，没文字不许在画面前挡一块。
 */
export const Scrim: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
      opacity,
      pointerEvents: "none",
    }}
  />
);
