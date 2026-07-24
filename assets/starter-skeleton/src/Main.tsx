import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Audio, staticFile } from "remotion";
import { theme } from "./theme";
import { Captions } from "./components/Captions";
import { FaceCam, Range } from "./components/FaceCam";
import { BigStatement, StepTitle, CardsRow } from "./scenes/blocks";
import { EndScene } from "./scenes/EndScene";
import { cueAt } from "./components/common";

// ============================================================
// Main.tsx —— 每期的装配台。
// 1) 口播模式：设 CORNER_RANGES（人脸缩角落的秒数区间），其余时间全屏
// 2) 每段一个 <Seg a b>（秒），场景内用 cueAt(a, 字幕序号) 让元素跟读音出现
// 3) 纯动画模式：删掉 FaceCam 两行和 Audio 的 face 相关内容
// ============================================================

const CORNER_RANGES: Range[] = [
  [4, 12], // 例：4s-12s 人脸在角落，主画面给大字/素材
];

/** 按秒分段的 Sequence 包装 */
const Seg: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({
  a,
  b,
  children,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(a * fps)} durationInFrames={Math.round((b - a) * fps)}>
      {children}
    </Sequence>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {/* 口播音轨（响度归一化后的 audio.mp3；纯动画模式换 BGM 或删除） */}
      <Audio src={staticFile("audio.mp3")} />

      {/* 人脸全屏层（垫底）—— 纯动画模式删除 */}
      <FaceCam part="full" corner={CORNER_RANGES} />

      {/* ===== 场景段落（示例，按每期内容重写） ===== */}
      <Seg a={0} b={4}>
        <BigStatement text="这里是【钩子】第一句" at={cueAt(0, 0)} scrim />
      </Seg>
      <Seg a={4} b={12}>
        <StepTitle no="STEP 01" title="第一部分" at={cueAt(4, 1)} />
      </Seg>
      <Seg a={12} b={20}>
        <CardsRow
          at={cueAt(12, 2)}
          cards={[
            { kicker: "POINT A", title: "要点一" },
            { kicker: "POINT B", title: "要点二" },
          ]}
        />
      </Seg>
      <Seg a={20} b={26}>
        <EndScene at={0.2} />
      </Seg>

      {/* 人脸角落层（永远压在场景之上）—— 纯动画模式删除 */}
      <FaceCam part="corner" corner={CORNER_RANGES} />

      {/* 底部字幕：minStart 之前（钩子段）不显示 */}
      <Captions minStart={4} />
    </AbsoluteFill>
  );
};
