import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, FONT, WIDTH, HEIGHT } from "../theme";
import { Hi, Kicker, SHADOW, Scrim, useRise, usePop } from "../components/common";
import { InfoCard } from "../components/InfoCard";

/**
 * 通用场景块。写新场景时优先拼这些块，不够再写自定义场景。
 * 每个块的 at = 相对场景起点的出现秒数（用 cueAt 算出来，跟读音走）。
 * 用法示例见 _cookbook.md。
 */

/** 全屏中心大字（钩子/金句）。keywords 里的词自动高亮 */
export const BigStatement: React.FC<{
  text: string;
  at?: number;
  sub?: string;
  scrim?: boolean; // 压在人脸/视频上时开启
}> = ({ text, at = 0, sub, scrim = false }) => {
  const rise = useRise(at, 0.7);
  const parts = text.split(/(【[^】]*】)/g).filter(Boolean);
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}
    >
      {scrim && <Scrim opacity={rise.t} />}
      <div
        style={{
          fontSize: HEIGHT > WIDTH ? 92 : 110,
          fontWeight: 900,
          color: theme.text,
          textAlign: "center",
          maxWidth: "84%",
          lineHeight: 1.25,
          // 钩子大字几乎必然要断行，让 text 里的 \n 生效
          whiteSpace: "pre-line",
          opacity: rise.opacity,
          transform: `translateY(${rise.y}px)`,
          ...SHADOW,
        }}
      >
        {parts.map((p, i) =>
          p.startsWith("【") ? <Hi key={i}>{p.slice(1, -1)}</Hi> : p,
        )}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 28,
            fontSize: 40,
            color: theme.text2,
            opacity: rise.opacity,
            ...SHADOW,
          }}
        >
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 段落标题页：步骤号 + 标题 */
export const StepTitle: React.FC<{
  no: string;
  title: string;
  at?: number;
}> = ({ no, title, at = 0 }) => {
  const rise = useRise(at, 0.6);
  const pop = usePop(at + 0.1);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
        gap: 18,
      }}
    >
      <div
        style={{
          fontSize: 34,
          letterSpacing: 10,
          color: theme.accent,
          transform: `scale(${pop})`,
          textShadow: `0 0 24px rgba(${theme.accentRGB},0.7)`,
        }}
      >
        {no}
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          color: theme.text,
          opacity: rise.opacity,
          transform: `translateY(${rise.y}px)`,
          ...SHADOW,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

/** 横排要点卡（2-3 张依次弹出）。竖屏时自动改纵排 */
export const CardsRow: React.FC<{
  cards: { kicker?: string; title: string; desc?: string; icon?: React.ReactNode }[];
  at?: number;
  gapSec?: number;
}> = ({ cards, at = 0, gapSec = 0.35 }) => {
  const vertical = HEIGHT > WIDTH;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: vertical ? "column" : "row",
        gap: 40,
      }}
    >
      {cards.map((c, i) => (
        <Card key={i} {...c} at={at + i * gapSec} vertical={vertical} />
      ))}
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  kicker?: string;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  at: number;
  vertical: boolean;
}> = ({ at, vertical, ...c }) => {
  const rise = useRise(at, 0.55);
  return (
    <div style={{ opacity: rise.opacity, transform: `translateY(${rise.y}px)` }}>
      <InfoCard {...c} width={vertical ? 760 : 440} />
    </div>
  );
};

/** 左右对比（Before/After、A vs B） */
export const BeforeAfter: React.FC<{
  left: { label: string; node: React.ReactNode };
  right: { label: string; node: React.ReactNode };
  at?: number;
}> = ({ left, right, at = 0 }) => {
  const l = useRise(at, 0.55);
  const r = useRise(at + 0.25, 0.55);
  const Col: React.FC<{
    label: string;
    node: React.ReactNode;
    s: { opacity: number; y: number };
    color: string;
  }> = ({ label, node, s, color }) => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        opacity: s.opacity,
        transform: `translateY(${s.y}px)`,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color, ...SHADOW }}>{label}</div>
      {node}
    </div>
  );
  return (
    <AbsoluteFill
      style={{
        flexDirection: HEIGHT > WIDTH ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 48,
        fontFamily: FONT,
      }}
    >
      <Col {...left} s={l} color={theme.bad} />
      <Col {...right} s={r} color={theme.good} />
    </AbsoluteFill>
  );
};

export { Kicker };
