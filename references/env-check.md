# 环境检查（第 0 步）

欢迎语发完后做三项检查。检查结果用一句话汇报即可，不要吓到新手（"缺 X 也没关系，我有办法"）。

## 1. remotion-best-practices skill

看当前可用 skills 列表里有没有 `remotion-best-practices`（Remotion 官方出的最佳实践 skill，做视频时能显著减少 AI 写错 Remotion 代码）。

**没有时**，告诉用户两个选项：

- **让我来装**（推荐，需用户同意）：在终端执行官方命令
  ```bash
  npx skills add remotion-dev/skills
  ```
  这是 Remotion 官方的 Agent Skills 安装方式（文档：https://www.remotion.dev/docs/ai/skills ）。装完提醒用户：新装的 skill 可能要**重启对话/客户端**才生效。
- **用户自己装**：把上面的命令发给用户，或告诉用户在 Claude 客户端的 Settings → Capabilities 里安装 skills。

**兜底**：装不上也不阻塞。规则文件是公开的，需要时直接从 GitHub 读取：
`https://github.com/remotion-dev/remotion/tree/main/packages/skills`
把这一点写进用户的《通用提示词模板.md》备注里，让以后的对话也知道去哪找规则。

## 2. Node

`node -v`。有 → 第 5 步可以做真实 Remotion 验收。没有 → 照常走流程，第 5 步降级为"用户回本机验收"，并在最后交付时给一句安装指引（https://nodejs.org 下 LTS 版）。

## 3. ffmpeg —— 别在第 0 步检查

ffmpeg 只有露脸口播（要抽音轨、做响度归一化）和需要处理音视频素材的形态才用得上。而形态是第 1 步 Q2 才问的——在还不知道用户做不做真人出镜的时候就报"你缺 ffmpeg"，对新手是纯噪音，还可能吓得他先去装一个根本用不上的东西。

所以：**Q2 得到"露脸口播 / 需要处理音视频"的答案之后再查** `ffmpeg -version`。没有就在交付的 README 里注明安装方式，不阻塞。

## 检查话术示例

> ✅ 环境检查完成：Remotion 最佳实践规则已就位，Node 也有了，等下可以直接渲真帧给你验收。
> （或）⚠️ 检测到还没装 remotion-best-practices，这是 Remotion 官方的"防翻车规则包"。要我现在帮你装吗？一条命令的事～
