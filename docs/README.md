# Signal Loom 文档

Signal Loom 是一个面向个人的信息热点监控工具：用户输入关键词，系统从 X 获取公开内容，再通过 OpenRouter 做去重、证据完整性和风险评估，最终将高价值信号送入网页版收件箱。

## 当前阶段

- 已完成网页版监控台和 Demo 数据模式
- 已完成 `POST /api/scan` 扫描入口
- 已完成 X Recent Search 与 OpenRouter JSON 评分适配
- 已完成前端手动扫描和每 30 分钟自动扫描轮询
- 真实浏览器通知与 Skill 封装留到网页版验收后

## 快速开始

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。没有 API Key 也可以直接使用 Demo 模式。
