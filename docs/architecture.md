# 架构说明

```text
浏览器监控台
    |
    | POST /api/scan { keyword }
    v
Next.js Route Handler
    |
    +--> X Recent Search API
    |
    +--> OpenRouter Chat Completions
              |
              v
      结构化信号评估
      confidence / risk / reason
```

## 数据流

1. 前端提交关键词到 `/api/scan`。
2. 服务端通过 `X_BEARER_TOKEN` 调用 X 最近搜索，排除转发并限制英文结果。
3. 原始帖子发送给 OpenRouter，要求只返回 JSON。
4. AI 输出摘要、可信度区间、风险等级和评估原因。
5. 没有密钥时，服务端返回 Demo 帖子，确保页面始终可演示。

## 设计边界

AI 只提供“可信度评估”，不证明事实绝对为真。高风险内容应保留原始链接，由用户查看一手来源。
