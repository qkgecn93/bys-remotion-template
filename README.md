# 不一书Remotion模板生成器 · bys-remotion-template

> 别人给你**一套现成模板**，让你去适应它的风格。
> 这个 Skill 陪你聊二十分钟，产出**你自己的那一套**——以后每期视频，复制、填空、开工。

![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-6f42c1)
![Claude Code](https://img.shields.io/badge/Claude%20Code-ready-d97757)
![Codex](https://img.shields.io/badge/Codex-ready-10a37f)
![Remotion](https://img.shields.io/badge/Remotion-4.x-0b84f3)
![License](https://img.shields.io/badge/license-MIT-green)

## 你什么时候需要它？

- **你打算长期用 Remotion 做视频**，但每次开新一期都要重新调配色、重写字幕逻辑、重新和 AI 解释一遍"我的风格是什么"。
- **你不会写代码**，但想要一套属于自己的视频底座——不是去 GitHub 抄一个别人的模板然后被它的审美绑架。
- **你已经有固定的内容形式**（抖音竖屏口播 / B站横屏知识区 / 录屏教程），想把它固化成"复制即用"的流水线。

一句话：它不生产视频，它生产**你的生产线**。

## 它会交付什么？

一次初始化，两件套，长期复用：

| 产物 | 是什么 | 怎么用 |
|---|---|---|
| **《通用提示词模板.md》** | 你的专属开工单，把画幅/风格/字幕/声音/授权/交付红线全部写死 | 每期复制一份，填【本期信息】和【本期特殊要求】，连素材发给 AI |
| **`_starter/` 工程底座** | 定制过风格的可运行 Remotion 工程 | 每期复制成新工程，只写新场景 |

`_starter/` 里有什么：

```
_starter/
├── src/theme.ts            # 全项目控制台：时长/画幅/配色，换风格只改这里
├── src/Main.tsx            # 每期装配台：分段、字幕开关、（口播的角落时段）
├── src/components/         # Captions 字幕 / InfoCard 信息卡 / MediaPanel 素材面板 / FaceCam 人脸双层
├── src/scenes/blocks.tsx   # 通用场景块：大字/标题页/要点卡/左右对比/结尾三连
├── tools/srt_to_captions.py# SRT → 字幕，关键词自动【】高亮
├── 风格规范.md              # 跨期不变的规矩钉在这里
└── README.md               # 每期流程 + 易踩的坑
```

看成品长什么样：[examples/](examples/) 里有一份完整的生成样例（竖屏纯动画·薄荷绿），含风格效果图、提示词模板、风格规范。

## 快速开始

**最省事的方式**——把仓库链接丢给 Claude Code / Codex，直接说：

```
帮我安装这个 skill：https://github.com/qkgecn93/bys-remotion-template
```

或者用 skills CLI：

```bash
npx skills add qkgecn93/bys-remotion-template
```

也可以手动软链：

```bash
git clone https://github.com/qkgecn93/bys-remotion-template.git
ln -s "$(pwd)/bys-remotion-template" ~/.claude/skills/bys-remotion-template   # Claude Code
# 或
ln -s "$(pwd)/bys-remotion-template" ~/.codex/skills/bys-remotion-template    # Codex
```

Claude 桌面版用户：Settings → Capabilities 里也能装。

装好后，**开一个新对话**，说：

```
初始化 不一书Remotion模板生成器
```

> 新装的 skill 可能要重启对话或客户端才生效。

## 触发方式

这些说法都能唤起它：

- `初始化 不一书Remotion模板生成器`
- `初始化 bys-remotion-template`
- `我想做一套自己的 Remotion 视频模板`
- `帮我搭一套长期做视频的 Remotion 工作流`
- `我是做抖音的，想要个自己风格的视频底座`
- `以后每期视频都能直接套的那种模板，帮我搞一个`

## 它怎么工作？

```
0 欢迎 + 环境检查 → 1 分步访谈 → 2 风格效果图（2-3版供挑选）
→ 3 汇总确认单 → 4 生成两件套 → 5 真实渲帧验收 → 6 邀请试做一期
```

四条它一定会守的规矩：

1. **一次只问一个问题**，每题先讲清"这是什么、影响什么"再提问——不懂代码也能答。
2. **风格必须看图定**：出 2-3 版真实像素尺寸的效果图给你挑，你说"就这版"才往下走。
3. **动笔前出确认单**：所有决策汇总一次，你点头才生成文件。
4. **你答"随便"时它会替你选**，但会明说选了什么、为什么，随时能改。

## 示例

**输入**

> 我是个知识区UP主，想用 Remotion 搞一套自己长期用的视频模板。我做 B站横屏，有录好的真人口播，风格喜欢暗色科技感那种。

**过程摘要**

- 识别出你已经给了画幅/形态/风格方向 → 打包求证一次，不再重复问
- 补问缺口：角落人脸放哪边、字幕来源、主色偏好、BGM、AI 联网权限、交付偏好
- 出 3 版暗色科技效果图（冷蓝霓虹 / 暖橙发光 / 紫青渐变），每版含钩子大字帧、要点卡帧、角落人脸帧
- 你说"V1 但发光收着点" → 只改发光参数重出一版 → 定稿
- 汇总确认单 → 生成两件套 → 渲真帧验收 → 问你要不要试做一期

**输出**（节选自 `examples/`）

```markdown
## 一、任务与格式
做一期知识口播风格视频，横屏 16:9、1920×1080、30fps，冷蓝霓虹暗色科技风。

## 二、本期信息（每期填写）
- 口播视频：`video.mp4`（音轨即口播，全程使用）
- 真实字幕：`video.srt`（时间一律以它为准）
- 风格基准：`_starter/` + `风格规范.md`
...
```

## 它和同类有什么不同？

| | 供给型 Skill（如 video-shotcraft、remotion-templates） | **bys-remotion-template** |
|---|---|---|
| 给你什么 | 现成的镜头卡片库 / 模板索引 | 一场访谈，生成**你自己的**模板 |
| 风格来源 | 作者的审美 | 你在效果图里挑出来的审美 |
| 复用单位 | 单支视频 | 你的长期生产线 |
| 上手门槛 | 要先看懂它的卡片体系 | 回答问题即可，不懂代码也行 |
| 适合谁 | 想快速做一支高质量产品片 | 要长期稳定产出、需要风格一致性的创作者 |

两类不冲突：先用本 Skill 定下你的底座，再去同类库里挑镜头手法往里加，是很自然的组合。

## 安全边界

- **只在你确认后才写文件**。访谈阶段、效果图阶段不产生任何最终交付物。
- **不动你的既有工程**。生成的 `_starter/` 是新目录；要覆盖任何已存在的文件都会先问你。
- **不写死本机路径、不打包 node_modules、不写入任何密钥**。生成的工程在别人电脑上照样能跑。
- **不杜撰**：涉及数据、平台名、工具名时用真实名称；查不到就明说查不到。
- **联网搜索需要你授权**：访谈里会明确问"资料不够时我能不能自己上网找"，答案写进你的提示词模板。

## 文件结构

```
bys-remotion-template/
├── SKILL.md                              # Agent 入口：流程总览与红线
├── references/
│   ├── env-check.md                      # 第0步：环境检查与 remotion-best-practices 安装引导
│   ├── interview-guide.md                # 第1步：完整问题库与提问纪律
│   ├── preview-guide.md                  # 第2步：效果图怎么做、怎么迭代
│   ├── customization-guide.md            # 第4步：怎么按形态裁剪骨架
│   └── prompt-template-guide.md          # 第4步：怎么写《通用提示词模板》
├── assets/starter-skeleton/              # 中性可运行骨架（生成时复制并定制）
├── examples/                             # 生成样例：效果图 + 提示词模板 + 风格规范
└── evals/evals.json                      # 测试用例与断言
```

## 验证与测试

`evals/evals.json` 里有 3 个测试用例，配 16 条断言，覆盖：触发与欢迎语、环境检查完整性、不抢跑、效果图必须先挑后写、确认单前置、已知信息打包求证、目标目录已存在同名文件时不静默覆盖、按形态正确裁剪骨架、提示词模板必含章节、交付前跑通验收脚本。

两轮实测：带 skill 16/16 断言通过，无 skill 基线 2/15。

自测方式：把 `evals/evals.json` 里的 prompt 逐个丢进新对话，对照 `expected_output` 检查。

**生成的工程是否合格**，跑验收脚本（17 项检查：占位符残留、悬空 import、孤儿模块、画幅、写死路径、疑似密钥……）：

```bash
python3 scripts/validate_starter.py <生成的_starter目录>
```

`assets/starter-skeleton/` 的可运行性验证：

```bash
python3 assets/starter-skeleton/tools/srt_to_captions.py <你的.srt> assets/starter-skeleton/tools/keywords.json
cd assets/starter-skeleton && npm install && npx remotion studio
```

## 依赖

- [Remotion](https://www.remotion.dev/) 4.x（个人和小团队免费，公司可能需要付费许可）
- 推荐同时安装 Remotion 官方规则包：`npx skills add remotion-dev/skills`（Skill 会自动检测并引导）
- Python 3（仅字幕脚本用）、ffmpeg（仅口播形态处理音轨用）

## License

MIT
