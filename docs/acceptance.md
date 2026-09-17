# 验收清单

## 网页功能

- [x] 点击 `立即扫描` 后显示扫描状态，并请求 `/api/scan`
- [x] 点击左侧关键词可以筛选信息流
- [x] 点击 `+` 可以添加新的中文监控关键词，并立即触发扫描
- [x] 搜索框可以按中文标题、摘要和作者过滤
- [x] 新热点会更新未读计数并显示站内提示
- [x] 浏览器允许通知后，新热点会触发系统通知
- [x] 不显示扫描历史、已保存和已读操作
- [x] 没有密钥时页面仍可正常运行
- [x] 已完成桌面端和移动端响应式样式

## 服务功能

- [x] Demo 模式返回结构化信号
- [x] 配置 `X_API_KEY` 后调用 TwitterAPI.io Advanced Search
- [x] 配置 OpenRouter Key 后返回 AI 评分
- [x] X 查询和 AI 输出只保留中文内容
- [x] 空关键词返回 400
- [x] 上游失败返回 502

## 当前已执行

- `npm run lint`：通过
- `npm run build`：通过
- `npm test`：通过，4 项契约测试
- `POST /api/scan`：已用真实中文关键词验证 `live` 模式
- GitHub：`https://github.com/Light-ux-source/signal-loom`

## 仍需人工验收

- 在浏览器中允许通知权限后，新增关键词并确认系统通知出现
- 保持页面打开超过 30 分钟，确认所有启用关键词会轮询扫描
- 使用真实账号额度确认 TwitterAPI.io 和 OpenRouter 的成本与限流表现
