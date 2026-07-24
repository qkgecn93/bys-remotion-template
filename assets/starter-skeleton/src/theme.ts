// ============================================================
// theme.ts —— 全项目唯一的"控制台"
// 每期视频只需要改【每期必改】区；换风格只改【配色】区。
// ============================================================

// ---------- 每期必改 ----------
export const DUR = 60; // 本期视频时长（秒），跑完字幕脚本后按最后一条字幕更新

// ---------- 画幅（初始化时由生成器定制，之后不动） ----------
export const FPS = 30;
export const WIDTH = 1920; // 竖屏改为 1080
export const HEIGHT = 1080; // 竖屏改为 1920

// ---------- 配色（换色只改这一块，所有发光/描边走 accentRGB） ----------
export const theme = {
  bg: "#0b0f14", // 全局背景
  bgPanel: "rgba(255,255,255,0.05)", // 半透明卡片底
  panelBorder: "rgba(255,255,255,0.12)",
  text: "#f5f7fa", // 主文字
  text2: "#cfe3ff", // 次级文字（亮色，可以压在视频/图片上）
  textDim: "#8a93a3", // 弱文字——只允许在暗色卡片内部用，禁止压在视频画面上
  accent: "#3fd0ff", // 主强调色
  accentSoft: "#9fe6ff",
  accentRGB: "63,208,255", // 供 rgba() 发光/描边用
  good: "#4ade80",
  bad: "#ff5f6b",
};

// 字体栈：中文优先思源黑体/苹方，无需额外安装
export const FONT =
  '"Source Han Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif';
