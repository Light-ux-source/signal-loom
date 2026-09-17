# 架构说明

```text
浏览器监控台
    |
    | POST /api/scan { keyword }
    v
Next.js Route Handler
    |
    +--> TwitterAPI.io Advanced Search
    |
    +--> OpenRouter Chat Completions
              |
              v
      结构化信号评估
      confidence / risk / reason
```

## 数据流

1. 用户新增中文关键词，前端立即调用 `/api/scan`。
2. 页面打开期间，客户端每 30 分钟遍历全部启用关键词并调用扫描接口。
3. 服务端用 `X_API_KEY` 通过 `X-API-Key` 请求 TwitterAPI.io，查询中加入 `lang:zh -is:retweet`。
4. 服务端再次过滤不含中文字符的帖子，避免英文或混杂内容进入 AI。
5. 原始帖子发送给 OpenRouter，要求返回简体中文 JSON。
6. AI 输出中文标题、摘要、可信度、热度、风险和原因。
7. 前端按帖子 ID 去重，将新结果合并到信息流并增加通知数量。
8. 没有 API Key 时返回中文 Demo 帖子，确保页面始终可演示。

## 关键接口

### `POST /api/scan`

请求：

```json
{ "keyword": "人工智能" }
```

成功响应包含 `keyword`、`mode`（`demo` 或 `live`）和 `signals`。空关键词返回 `400`，TwitterAPI.io 或 OpenRouter 上游失败返回 `502`。

## 当前运行边界

自动扫描是浏览器端定时器，不是服务端任务队列。只有页面保持打开时才会每 30 分钟扫描。要支持后台持续监控，需要后续增加数据库、服务端 Cron/队列和通知投递服务。

## 设计边界

AI 只提供“可信度评估”，不证明事实绝对为真。高风险内容应保留原始链接，由用户查看一手来源。`lang:zh` 和中文字符过滤是语言过滤，不等于内容真实性验证。
