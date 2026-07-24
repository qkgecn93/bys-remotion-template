# 底座定制指南（第 4 步之一：生成用户的 _starter/）

把本 skill 的 `assets/starter-skeleton/` 复制为用户的 `_starter/`（或用户起的名字），然后按访谈结果定制。**骨架代码是可运行的基础，定制时只做必要修改，别重写。**

## 1. theme.ts（必改）

- `WIDTH/HEIGHT`：按画幅（竖屏 1080×1920）。
- 配色块：整体替换为第 2 步"风格档案"的值（accent/accentRGB/text2 等一一对应）。
- 风格差异大时（如亮色风）：`bg` 换浅色、`bgPanel` 换深色半透明、SHADOW 需要减弱——同步改 common.tsx 里的 SHADOW 注释说明。

## 2. 按形态删/留模块

| 模块 | 露脸口播 | 纯动画 | 录屏混合 |
|---|---|---|---|
| `components/FaceCam.tsx` | 留 | 删 | 通常删（用户露脸解说录屏则留） |
| `Main.tsx` 里 FaceCam 两行 + CORNER_RANGES | 留 | 删 | 同上 |
| `Audio(audio.mp3)` | 留（口播音轨） | 视配音方案（TTS→留，无配音→换 BGM） | 留或换 |
| `components/Captions.tsx` | 按 Q3 | 按 Q3 | 按 Q3 |
| `tools/srt_to_captions.py` | 留 | 有配音留，无配音删 | 同左 |
| `components/MediaPanel.tsx` | 留 | 留 | 留（主力组件） |

删模块时同步删 import，确保工程能编译。Main.tsx 里的示例段落改成贴合用户形态的最小示例。

## 3. README.md（从 README.template.md 生成）

填占位符：
- `{{STARTER_NAME}}`：用户起的名字
- `{{ONE_LINE_STYLE_SUMMARY}}`：一句话风格定位（如"暖橙发光 · 暗色科技极简 · 竖屏口播底座"）
- `{{ASSET_CHECKLIST}}`：按形态列素材清单（口播：face.mp4/audio.mp3/video.srt/clips；纯动画：配音 mp3/素材图）
- `{{COMPONENTS_LIST}}`：留下来的组件列表
- `{{PITFALLS_LIST}}`：从下面"坑清单"里挑该形态适用的

生成后删除 README.template.md。

## 4. 风格规范.md（新写）

跨期不变的规矩钉进这个文件，内容来源 = 风格档案 + 访谈答案：
- 配色与换色规矩（只改 theme.ts 一处）
- 文字清晰度规矩（压视频的文字必须 SHADOW；暗场绑内容进度；禁 textDim 压视频）
- 该形态的版式规矩（口播：两种呈现形式怎么选、角落框标准；纯动画：节奏与留白）
- 字幕规矩（句尾无标点、安全区、关键词高亮、钩子段隐藏）
- 动效规矩（统一 ci 缓动、元素跟读音、禁 CSS transition）
- 用户的个性化项（落款、结尾页、logo 位）

## 5. 坑清单（README 速记候选）

- 压在视频/人脸上的文字必须强阴影+暗场绑进度；别用灰色 textDim。
- 满屏人脸时只放一个强调物居中，其余放两侧。
- 角落人脸层永远在所有场景之上、字幕之前。
- 图片按原图比例选 cover/contain，竖图别塞横框。
- 素材间隙不留空场，用块补动画。
- 素材视频开头有重要动画→包 Sequence 从第 0 帧播。
- 每期只改：DUR、captions.ts（脚本生成）、Main.tsx 段落、新场景文件。

## 6. 自检

跑脚本，别靠肉眼：

```bash
python3 scripts/validate_starter.py <生成的_starter目录>
```

它检 17 项：必备文件、`{{占位符}}` 残留、README.template.md 是否删除、**悬空 import**（删了模块没删引用是最常见的静默故障）、theme 画幅与 accentRGB、node_modules、写死的本机路径、疑似密钥、风格规范.md。

FAIL 全清后，再人工确认两件事脚本查不了：theme 的色值和第 2 步的风格档案逐项对得上、README 里的命令在干净机器上说得通。然后进第 5 步真实渲帧验收。
