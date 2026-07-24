#!/usr/bin/env python3
"""逐字稿 → src/captions.ts（没有 SRT 时的降级方案）。

用法：
    python3 tools/estimate_captions.py script.txt tools/keywords.json --cps 4.5

什么时候用它：纯动画 + TTS 配音的形态通常没有真实 SRT——配音还没生成，
时间轴无从谈起。这个脚本按"每秒几个字"估算时间轴，先让工程能跑起来、
能预览节奏；等配音出来之后，再用 srt_to_captions.py 用真实时间轴覆盖。

输入格式：一行一句（空行忽略）。想手动指定某句时长，在行尾加 `@秒数`：
    这句话我要说慢一点，停顿久一些 @4.5
    这句正常

cps（characters per second）中文口播的经验值是 4~5，语速快的到 6。
估出来的时间轴一定不准，但足够搭结构——所以脚本会在文件头写明这是估算值。
"""
import argparse
import json
import re
from pathlib import Path


def estimate(lines, cps, gap_ms):
    caps, t = [], 0
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        m = re.search(r"@\s*([\d.]+)\s*$", line)
        if m:
            dur_ms = int(float(m.group(1)) * 1000)
            line = line[: m.start()].strip()
        else:
            # 只按中日韩字符 + 字母数字计数，标点不占时长
            n = len(re.findall(r"[一-鿿぀-ヿA-Za-z0-9]", line))
            dur_ms = max(800, int(n / cps * 1000))
        line = re.sub(r"[，。！？,.!?；;]+$", "", line)  # 句尾不加标点
        caps.append({"text": line, "startMs": t, "endMs": t + dur_ms})
        t += dur_ms + gap_ms
    return caps


def highlight(text, keywords):
    for kw in sorted(keywords, key=len, reverse=True):
        if kw and kw in text and f"【{kw}】" not in text:
            text = text.replace(kw, f"【{kw}】", 1)
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("keywords", nargs="?")
    ap.add_argument("--cps", type=float, default=4.5, help="每秒字数，中文口播 4~5")
    ap.add_argument("--gap", type=int, default=120, help="句间停顿毫秒")
    a = ap.parse_args()

    lines = Path(a.script).read_text(encoding="utf-8-sig").splitlines()
    kws = []
    if a.keywords and Path(a.keywords).exists():
        kws = json.loads(Path(a.keywords).read_text(encoding="utf-8"))

    caps = estimate(lines, a.cps, a.gap)
    for c in caps:
        c["text"] = highlight(c["text"], kws)

    out_lines = [
        "// 本文件由 tools/estimate_captions.py 生成 —— 时间轴是【估算值】，不是真实录音时间。",
        f"// 估算参数：{a.cps} 字/秒，句间停顿 {a.gap}ms。",
        "// 配音做好之后，导出 SRT 再跑 srt_to_captions.py 覆盖本文件，换成真实时间轴。",
        "export type Caption = { text: string; startMs: number; endMs: number };",
        "export const CAPTIONS: Caption[] = [",
    ]
    for c in caps:
        text = c["text"].replace("\\", "\\\\").replace('"', '\\"')
        out_lines.append(
            f'  {{ text: "{text}", startMs: {c["startMs"]}, endMs: {c["endMs"]} }},'
        )
    out_lines.append("];\n")

    out = Path(__file__).resolve().parent.parent / "src" / "captions.ts"
    out.write_text("\n".join(out_lines), encoding="utf-8")

    total = caps[-1]["endMs"] / 1000 if caps else 0
    print(f"OK：写入 {out}，共 {len(caps)} 条字幕（估算）。")
    print(f"估算总时长 {total:.1f}s —— 把 src/theme.ts 的 DUR 设成 ≥ 这个值。")
    print("提醒：配音完成后请用真实 SRT 跑 srt_to_captions.py 覆盖，估算时间轴对不准口型。")


if __name__ == "__main__":
    main()
