#!/usr/bin/env python3
"""验收一个生成好的 _starter/ 是否可以交付给用户。

用法：
    python3 scripts/validate_starter.py <生成的_starter目录>

这个脚本存在的原因：第 4 步定制骨架时最容易犯的错都是静默的——
删了 FaceCam.tsx 却忘了删 Main.tsx 里的 import（工程打不开）、
README 里留着 {{STARTER_NAME}}（用户一眼看到就不信任了）、
theme.ts 的画幅和访谈结论对不上（做出来的视频尺寸是错的）。
这些错误都能程序化检出，就不该靠肉眼复查。

在把 _starter 交给用户之前跑一遍，FAIL 全清了再交付。
"""
import re
import sys
from pathlib import Path

RED, GRN, YEL, RST = "\033[31m", "\033[32m", "\033[33m", "\033[0m"
results = []


def check(ok, level, msg):
    results.append((ok, level, msg))
    tag = f"{GRN}PASS{RST}" if ok else (f"{RED}FAIL{RST}" if level == "FAIL" else f"{YEL}WARN{RST}")
    print(f"{tag} {msg}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    root = Path(sys.argv[1]).resolve()
    if not root.is_dir():
        print(f"目录不存在：{root}")
        sys.exit(1)

    src = root / "src"
    ts_files = list(src.rglob("*.ts")) + list(src.rglob("*.tsx")) if src.is_dir() else []

    # 1. 必备文件
    for rel in ["src/theme.ts", "src/Main.tsx", "src/Root.tsx", "src/index.ts",
                "package.json", "tsconfig.json", "README.md"]:
        check((root / rel).exists(), "FAIL", f"必备文件存在：{rel}")

    # 2. 模板占位符残留
    leftovers = []
    for f in list(root.rglob("*.md")) + ts_files:
        try:
            for m in re.findall(r"\{\{[A-Z_]+\}\}", f.read_text(encoding="utf-8")):
                leftovers.append(f"{f.relative_to(root)}:{m}")
        except (OSError, UnicodeDecodeError):
            pass
    check(not leftovers, "FAIL", f"无 {{{{占位符}}}} 残留" + (f" —— 发现：{leftovers[:5]}" if leftovers else ""))
    check(not (root / "README.template.md").exists(), "FAIL", "README.template.md 已删除")

    # 3. 悬空 import（删了模块却没删引用）
    dangling = []
    for f in ts_files:
        try:
            text = f.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for imp in re.findall(r'from\s+"(\.[^"]+)"', text):
            target = (f.parent / imp).resolve()
            if not any(Path(str(target) + ext).exists() for ext in ("", ".ts", ".tsx", "/index.ts")):
                dangling.append(f"{f.relative_to(root)} → {imp}")
    check(not dangling, "FAIL", "无悬空 import" + (f" —— 发现：{dangling[:5]}" if dangling else ""))

    # 3b. 孤儿模块（文件还在但没人引用）
    # 按形态裁剪时，删除有可能被环境阻止，agent 容易退而求其次"只删 import 留着文件"。
    # 悬空 import 查不出这种情况，但孤儿模块会让用户打开工程时困惑：这文件干嘛的？
    orphans = []
    entry_names = {"index", "Root", "Main", "theme", "captions"}
    all_text = "\n".join(
        f.read_text(encoding="utf-8", errors="ignore") for f in ts_files
    )
    for f in ts_files:
        stem = f.stem
        if stem in entry_names:
            continue
        if not re.search(rf'from\s+"[^"]*/{re.escape(stem)}"', all_text):
            orphans.append(str(f.relative_to(root)))
    check(not orphans, "WARN",
          "无孤儿模块（文件存在但无人引用）" + (f" —— 发现：{orphans[:5]}，按形态裁剪时该删的文件删干净" if orphans else ""))

    # 4. theme.ts 关键值已定制
    theme = (src / "theme.ts")
    if theme.exists():
        t = theme.read_text(encoding="utf-8")
        w = re.search(r"WIDTH\s*=\s*(\d+)", t)
        h = re.search(r"HEIGHT\s*=\s*(\d+)", t)
        check(bool(w and h), "FAIL", f"theme.ts 定义了画幅：{w.group(1) if w else '?'}×{h.group(1) if h else '?'}")
        check("accentRGB" in t, "FAIL", "theme.ts 保留了 accentRGB（发光/描边靠它统一换色）")
        check(bool(re.search(r"DUR\s*=\s*\d+", t)), "WARN", "theme.ts 定义了 DUR")

    # 5. 不该出现的东西
    check(not (root / "node_modules").exists(), "FAIL", "未打包 node_modules")
    hardcoded = []
    for f in ts_files + list(root.rglob("*.json")) + list(root.rglob("*.md")):
        try:
            text = f.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        if re.search(r"[A-Za-z]:\\\\Users\\\\|/Users/[a-z]|/home/[a-z]", text):
            hardcoded.append(str(f.relative_to(root)))
    check(not hardcoded, "FAIL", "无写死的本机路径" + (f" —— 发现：{hardcoded[:3]}" if hardcoded else ""))
    secrets = [str(f.relative_to(root)) for f in root.rglob("*")
               if f.is_file() and re.search(r"(sk-[A-Za-z0-9]{16,}|api[_-]?key\s*[:=]\s*['\"][^'\"]{12,})",
                                            f.read_text(encoding="utf-8", errors="ignore")[:20000])]
    check(not secrets, "FAIL", "无疑似密钥" + (f" —— 发现：{secrets[:3]}" if secrets else ""))

    # 6. 交付文档
    check((root / "风格规范.md").exists(), "WARN", "风格规范.md 存在（跨期不变的规矩要有地方钉）")

    fails = sum(1 for ok, lv, _ in results if not ok and lv == "FAIL")
    warns = sum(1 for ok, lv, _ in results if not ok and lv == "WARN")
    print(f"\n汇总：PASS {sum(1 for ok, _, _ in results if ok)} / WARN {warns} / FAIL {fails}")
    if fails:
        print(f"{RED}有 FAIL 项，先修好再交付给用户。{RST}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
