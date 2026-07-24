# {{STARTER_NAME}} · 我的 Remotion 视频底座

{{ONE_LINE_STYLE_SUMMARY}}
每期视频复制本文件夹开新工程，只写新场景，跨期风格保持统一。

> 由 不一书Remotion模板生成器 (bys-remotion-template) 生成

## 每期流程

1. **复制本文件夹**为新一期工程（本文件夹永远保持干净，不直接在里面做片子）。
2. 素材放进 `public/`：
   {{ASSET_CHECKLIST}}
3. **生成字幕**（如本期有口播/字幕）：
   `python tools/srt_to_captions.py public/video.srt tools/keywords.json`
   跑完把 `src/theme.ts` 的 `DUR` 改成脚本提示的时长。
4. **写场景**：优先用 `src/scenes/blocks.tsx` 的通用块（用法见 `src/scenes/_cookbook.md`），在 `Main.tsx` 的 `<Seg a b>` 里按秒登记，`at` 用 `cueAt` 跟读音。
5. 预览：`npm install` → `npx remotion studio`
6. 渲染：`npx remotion render MyVideo out/video.mp4`（或在 Studio 里点 Render）

## 制作新一期最省事的方式

把《通用提示词模板.md》复制一份，填好【本期信息】和【本期特殊要求】，连同素材一起发给 AI 助手，让它按模板开工。

## 目录

- `src/theme.ts` —— 全项目控制台：时长/画幅/配色/字体，换风格只改这里
- `src/Main.tsx` —— 每期装配台：分段、（角落时段）、字幕开关
- `src/components/` —— 通用组件：{{COMPONENTS_LIST}}
- `src/scenes/blocks.tsx` —— 通用场景块（大字/标题/卡片/对比/结尾）
- `tools/` —— SRT 转字幕脚本 + 关键词高亮配置
- `风格规范.md` —— 本底座的文字版风格规范（跨期不变的规矩钉在这里）

## 速记（易踩的坑）

{{PITFALLS_LIST}}
