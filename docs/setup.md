# 配置说明

在 `.env.local` 中配置：

- `X_API_KEY`：TwitterAPI.io API Key。新账号通常带有 `$0.1` 免费 credits，之后按调用量计费。
- `OPENROUTER_API_KEY`：OpenRouter API Key。
- `OPENROUTER_MODEL`：可选模型，默认 `nex-agi/nex-n2.5-mini:free`。如果该免费模型限流，可以切换到账号可用的其他模型。
- `APP_URL`：发送给 OpenRouter 的来源标识，生产环境改成实际网址。

## 手动测试 API

```bash
curl -X POST http://localhost:3000/api/scan \
  -H 'Content-Type: application/json' \
  -d '{"keyword":"人工智能"}'
```

返回中的 `mode` 为 `demo` 或 `live`。不要把 `.env.local` 提交到 Git。

## 通知权限

新增关键词时，浏览器会请求通知权限。允许后，扫描到新中文热点时会调用浏览器 `Notification` API；拒绝权限不影响页面内的未读数量和站内提示。

## API 成本提示

TwitterAPI.io 是按调用量计费，免费 credits 用尽后会产生费用。OpenRouter 的免费模型通常受共享限流影响，生产使用前应确认模型可用性、余额和地区限制。
