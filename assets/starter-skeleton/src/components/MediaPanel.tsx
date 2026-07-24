import React from "react";
import { OffthreadVideo, Img, staticFile } from "remotion";
import { theme } from "../theme";

/**
 * 圆角媒体面板：放素材视频 / 录屏 / 图片，带外框和发光。
 * - 图片按原图比例选 fit："cover"（裁满）或 "contain"（完整显示，竖图别塞横框）。
 * - 素材视频若开头有重要动画，把整个面板包进
 *   <Sequence from={出现帧} layout="none"> 让它从第 0 帧播。
 */
export const MediaPanel: React.FC<{
  src: string; // public/ 下的相对路径，如 "clips/demo.mp4"
  kind?: "video" | "img";
  fit?: "cover" | "contain";
  width: number;
  height: number;
  label?: string;
  style?: React.CSSProperties;
}> = ({ src, kind = "video", fit = "cover", width, height, label, style }) => (
  <div style={{ position: "relative", width, ...style }}>
    {label && (
      <div
        style={{
          fontSize: 24,
          color: theme.text2,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    )}
    <div
      style={{
        width,
        height,
        borderRadius: 18,
        overflow: "hidden",
        border: `1.5px solid rgba(${theme.accentRGB},0.4)`,
        boxShadow: `0 12px 48px rgba(0,0,0,0.5), 0 0 28px rgba(${theme.accentRGB},0.15)`,
        background: "#000",
      }}
    >
      {kind === "video" ? (
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: fit }}
        />
      ) : (
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: fit }}
        />
      )}
    </div>
  </div>
);
