# Signal Loom 文档

Signal Loom 是一个中文热点监控工具：用户输入关键词，系统从 TwitterAPI.io 获取公开内容，过滤非中文内容，再通过 OpenRouter 做去重、证据完整性、可信度和风险评估，最后将热点显示在网页版收件箱中。

## 当前完成度

当前版本是可运行的网页版 MVP，已完成核心闭环：

- 中文关键词监控与筛选
- TwitterAPI.io `advanced_search` 数据接入
- `lang:zh` 查询和服务端中文字符过滤
- OpenRouter 结构化 AI 评分和中文摘要
- 免费模型 `nex-agi/nex-n2.5-mini:free` 配置支持
- 新增关键词后立即触发扫描
- 页面打开期间每 30 分钟扫描全部启用关键词
- 新热点未读数量、站内提示和浏览器通知
- Demo 模式，无密钥也可运行
- 轻量契约测试、Markdown 文档和 GitHub 仓库

## 当前版本不包含

- 数据库持久化：刷新页面后关键词和通知状态会重置
- 服务端常驻定时任务：自动扫描依赖浏览器页面保持打开
- 扫描历史、已保存热点和手动已读操作
- Skill 封装
- 多用户、账号体系和生产部署配置

## 快速开始

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。没有 API Key 也可以直接使用 Demo 模式。

## 验证命令

```bash
npm test
npm run lint
npm run build
```

详细配置见 [setup.md](setup.md)，架构见 [architecture.md](architecture.md)，后续开发顺序见 [roadmap.md](roadmap.md)。
