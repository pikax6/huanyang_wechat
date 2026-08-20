# 还阳计划 · 微信小程序

一个帮助用户进行日常任务管理与习惯养成的微信小程序，提供「今日任务」等页面，支持多套主题（莫兰迪 / 多巴胺 / 极简）。

## 技术栈

| 层面 | 技术 |
|---|---|
| 开发框架 | 微信原生小程序（WXML / WXSS / JS） |
| 全局配置 | `app.json` / `app.js` / `app.wxss` |
| 组件化 | 自定义 `components/` |
| 主题 | `themes/` 多套配色方案 |
| 工具 | `utils/` |

- AppID：`wx55004ec1616ac4a7`（公开标识）
- 基础库：`2.32.0`

## 目录结构

```
还阳计划/
├─ app.js / app.json / app.wxss   # 入口与全局配置/样式
├─ sitemap.json                   # 索引配置
├─ project.config.json            # 项目配置（appid 等）
├─ components/                    # 自定义组件
├─ pages/                         # 页面（today 等）
├─ themes/                        # 主题配色
├─ utils/                         # 工具函数
├─ design/                        # UI 方案参考图
└─ 功能设计文档.md                # 功能设计说明
```

## 本地开发

1. 用 **微信开发者工具** 打开本项目根目录。
2. 确认 `project.config.json` 中的 AppID 与你的小程序一致（当前为 `wx55004ec1616ac4a7`）。
3. 编译预览即可；如需 npm 包，执行「工具 → 构建 npm」。

## 说明

- 隐私/本地配置不在版本库内（见 `.gitignore`）。
- 详细上传与文件标注见 [`GitHub上传说明.md`](./GitHub上传说明.md)。
