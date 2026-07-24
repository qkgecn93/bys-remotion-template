// 本文件由 tools/srt_to_captions.py 自动生成，不要手改。
// 每期流程：把真实 SRT 放到 public/video.srt，然后运行：
//   python tools/srt_to_captions.py public/video.srt tools/keywords.json
// 文字中的【】包裹的词会在底部字幕里高亮。

export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

// ↓↓↓ 演示数据（跑脚本后会被整体覆盖）↓↓↓
export const CAPTIONS: Caption[] = [
  { text: "这是一条【演示】字幕", startMs: 0, endMs: 2000 },
  { text: "跑过脚本之后这里就是真实时间轴", startMs: 2000, endMs: 4500 },
];
