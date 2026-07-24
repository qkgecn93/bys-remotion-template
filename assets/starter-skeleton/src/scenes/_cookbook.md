# 场景块速查（_cookbook）

写新场景时优先拼通用块；块不够用再写自定义场景（放 `scenes/` 下，一段一个文件）。

| 块 | 用途 | 关键参数 |
|---|---|---|
| `BigStatement` | 钩子/金句全屏大字 | `text`（【】高亮）、`scrim`（压人脸/视频时开） |
| `StepTitle` | 段落标题页 | `no`、`title` |
| `CardsRow` | 2-3 张要点卡依次弹出 | `cards[]`、竖屏自动纵排 |
| `BeforeAfter` | 左右/上下对比 | `left/right.node` 可放 `MediaPanel` |
| `EndScene` | 结尾三连引导 | 落款交给底部字幕，别重复 |
| `InfoCard` | 单张发光信息卡 | 口播两侧浮层用 |
| `MediaPanel` | 素材视频/图片面板 | `fit` 按原图比例选 |

## 跟读音出现（最重要的一条）

```tsx
<Seg a={12} b={20}>
  {/* 说到第 5 条字幕时才出现 */}
  <CardsRow at={cueAt(12, 5)} cards={[...]} />
</Seg>
```

## 压在人脸/视频上的文字

- 必须 `SHADOW` 强阴影；暗场用 `Scrim` 且 opacity 跟内容进度。
- 次级文字用 `theme.text2`，禁止 `textDim`（灰色在视频上看不清）。
- 满屏人脸时只放一个强调物居中，其余信息放人脸左右两侧。

## 素材视频从头播

素材开头有重要动画时：

```tsx
<Sequence from={Math.round(出现秒 * fps)} layout="none">
  <MediaPanel src="clips/demo.mp4" width={900} height={506} />
</Sequence>
```
