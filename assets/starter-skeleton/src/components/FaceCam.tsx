import React from "react";
import {
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, WIDTH, HEIGHT } from "../theme";
import { ci } from "./common";

/**
 * FaceCam —— 露脸口播的人脸主体（两层用法）。（纯动画项目可整个删除本文件）
 *
 * 全程一个持久视频（public/face.mp4，静音，音轨走 public/audio.mp3），
 * 在"全屏"和"角落圆框"之间平滑切换：
 *   <FaceCam part="full"  corner={CORNER_RANGES} />  放在所有场景之下（垫底）
 *   <FaceCam part="corner" corner={CORNER_RANGES} /> 放在所有场景之上、字幕之前（永远最上层）
 *
 * CORNER_RANGES：人脸缩在角落的时间段（秒），其余时间全屏。
 */
export type Range = [number, number];

const D = 280; // 角落圆框直径
const Z = 1.6; // 圆框内视频缩放（保证四边出血，不露黑）
const FOCUS = 0.42; // 人眼在框内的纵向位置比例，机位变了调这里
const FADE = 0.5; // 全屏↔角落过渡时长（秒）

const inRange = (t: number, ranges: Range[]) =>
  ranges.some(([a, b]) => t >= a && t < b);

/** 距离最近的切换边界的进度（0=全屏，1=角落），带过渡 */
const cornerProgress = (t: number, ranges: Range[]) => {
  let p = inRange(t, ranges) ? 1 : 0;
  for (const [a, b] of ranges) {
    if (t >= a - FADE && t < a) p = Math.max(p, (t - (a - FADE)) / FADE);
    if (t >= b && t < b + FADE) p = Math.max(p, 1 - (t - b) / FADE);
  }
  return interpolate(p, [0, 1], [0, 1], { easing: ci });
};

export const FaceCam: React.FC<{
  part: "full" | "corner";
  corner: Range[];
  side?: "right" | "left";
}> = ({ part, corner, side = "right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = cornerProgress(t, corner);

  if (part === "full") {
    // 全屏层：人脸在角落时淡出让位给场景
    return (
      <div style={{ position: "absolute", inset: 0, opacity: 1 - p }}>
        <OffthreadVideo
          src={staticFile("face.mp4")}
          muted
          style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }}
        />
        {/* 轻微压暗 + 暗角，让前景卡片和文字更跳 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>
    );
  }

  // 角落层：圆框 + 发光环，压在所有场景之上
  if (p <= 0.01) return null;
  const showH = D * Z;
  const showW = (showH * 16) / 9;
  const offY = Math.max(D - showH, Math.min(0, D / 2 - showH * FOCUS));
  const x = side === "right" ? WIDTH - D - 60 : 60;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: HEIGHT - D - 60,
        width: D,
        height: D,
        borderRadius: "50%",
        overflow: "hidden",
        border: `3px solid rgba(${theme.accentRGB},0.9)`,
        boxShadow: `0 0 36px rgba(${theme.accentRGB},0.5)`,
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      <OffthreadVideo
        src={staticFile("face.mp4")}
        muted
        style={{
          position: "absolute",
          width: showW,
          height: showH,
          left: (D - showW) / 2,
          top: offY,
          objectFit: "cover",
        }}
      />
    </div>
  );
};
