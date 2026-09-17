# 配置说明

在 `.env.local` 中配置：

- `X_API_KEY`：TwitterAPI.io API Key。新账号通常带有 `$0.1` 免费 credits，之后按调用量计费。
- `OPENROUTER_API_KEY`：OpenRouter API Key。
- `OPENROUTER_MODEL`：可选模型，默认 `openai/gpt-4o-mini`。
- `APP_URL`：发送给 OpenRouter 的来源标识，生产环境改成实际网址。

## 手动测试 API

```bash
curl -X POST http://localhost:3000/api/scan \
  -H 'Content-Type: application/json' \
  -d '{"keyword":"AI agents"}'
```

返回中的 `mode` 为 `demo` 或 `live`。不要把 `.env.local` 提交到 Git。
