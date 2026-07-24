#!/usr/bin/env python3
"""SRT → src/captions.ts 转换脚本。

用法：
    python tools/srt_to_captions.py public/video.srt tools/keywords.json

- 时间轴一律以真实 SRT 为准（逐字稿只做辅助）。
- keywords.json 里列出的词会被自动包上【】，在底部字幕里高亮。
- 输出覆盖 src/captions.ts，并打印总时长，提醒你更新 theme.ts 的 DUR。
"""
import json
import re
import sys
from pathlib import Path

TIME_RE = re.compile(
    r"(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})"
)


def to_ms(h, m, s, ms):
    return ((int(h) * 60 + int(m)) * 60 + int(s)) * 1000 + int(ms)


def parse_srt(path: Path):
    blocks = re.split(r"\n\s*\n", path.read_text(encoding="utf-8-sig").strip())
    out = []
    for b in blocks:
        lines = [l.strip() for l in b.splitlines() if l.strip()]
        for i, line in enumerate(lines):
            m = TIME_RE.search(line)
            if m:
                text = " ".join(lines[i + 1 :]).strip()
                if not text:
                    continue
                # 句尾去标点（风格规范：底部字幕句尾不加标点）
                text = re.sub(r"[，。！？,.!?；;]+$", "", text)
                out.append(
                    {
                        "text": text,
                        "startMs": to_ms(*m.groups()[:4]),
                        "endMs": to_ms(*m.groups()[4:]),
                    }
                )
                break
    return out


def highlight(text: str, keywords):
    for kw in sorted(keywords, key=len, reverse=True):
        if kw and kw in text and f"【{kw}】" not in text:
            text = text.replace(kw, f"【{kw}】", 1)
    return text


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    srt = Path(sys.argv[1])
    keywords = []
    if len(sys.argv) > 2 and Path(sys.argv[2]).exists():
        keywords = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))

    caps = parse_srt(srt)
    for c in caps:
        c["text"] = highlight(c["text"], keywords)

    lines = [
        "// 本文件由 tools/srt_to_captions.py 自动生成，不要手改。",
        "export type Caption = { text: string; startMs: number; endMs: number };",
        "export const CAPTIONS: Caption[] = [",
    ]
    for c in caps:
        text = c["text"].replace("\\", "\\\\").replace('"', '\\"')
        lines.append(
            f'  {{ text: "{text}", startMs: {c["startMs"]}, endMs: {c["endMs"]} }},'
        )
    lines.append("];\n")

    out = Path(__file__).resolve().parent.parent / "src" / "captions.ts"
    out.write_text("\n".join(lines), encoding="utf-8")

    total = caps[-1]["endMs"] / 1000 if caps else 0
    print(f"OK：写入 {out}，共 {len(caps)} 条字幕。")
    print(f"最后一条字幕结束于 {total:.1f}s —— 记得把 src/theme.ts 的 DUR 改成 ≥ 这个值。")


if __name__ == "__main__":
    main()
