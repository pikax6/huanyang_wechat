# GitHub 上传说明（还阳计划 · 微信小程序）

本文件逐项标注项目里每个文件/目录是否上传、体积与风险，并给出推送步骤。
仓库地址：`https://github.com/pikax6/huanyang_wechat`

> 说明：本仓库由 WorkBuddy 在沙箱中完成「本地准备」，推送由你在本机执行。

---

## 一、文件清单（是否上传 · 体积 · 风险）

| 路径 | 类型 | 体积 | 上传? | 标注说明 |
|---|---|---|---|---|
| `app.js` | 源码 | 8.0K | ✅ | 小程序入口逻辑（全局） |
| `app.json` | 源码 | 4.0K | ✅ | 全局配置：页面路由、窗口、主题 |
| `app.wxss` | 源码 | 4.0K | ✅ | 全局样式 |
| `sitemap.json` | 源码 | 1.0K | ✅ | 索引配置 |
| `project.config.json` | 配置 | 4.0K | ✅ | 项目配置，含**公开** appid `wx55004ec1616ac4a7`，可入库 |
| `project.private.config.json` | 配置 | 1.0K | ❌ | 微信开发者工具本机私有设置，**约定不入库**（已在 .gitignore） |
| `components/` | 源码 | 69K | ✅ | 自定义组件 |
| `pages/` | 源码 | 171K | ✅ | 页面（含 today 等页面逻辑/样式/结构） |
| `themes/` | 源码 | 8.0K | ✅ | 主题配置 |
| `utils/` | 源码 | 40K | ✅ | 工具函数 |
| `design/` | 资源 | 660K | ✅ | UI 方案图（莫兰迪/多巴胺/极简三版），属设计参考，可入库 |
| `功能设计文档.md` | 文档 | 16K | ✅ | 功能设计说明，公开无隐私 |
| `软著材料/` | 隐私 | **35M** | ❌ | 软件著作权申请材料（含签章页/鉴别材料截图），**含个人信息，公开仓库务必排除**（已在 .gitignore） |
| `.gitignore` | 配置 | — | ✅ | 本次新增，忽略规则 |
| `README.md` | 文档 | — | ✅ | 仓库首页说明（本次新增） |

---

## 二、敏感信息检查

- ✅ 源码中**未发现**硬编码密码 / API Key / AppSecret / Token。
- ✅ `project.config.json` 里的 `appid`（wx55004ec1616ac4a7）是小程序**公开标识**，可安全入库。
- ⚠️ 若日后接入后端，请勿把接口密钥写进前端源码；密钥应通过后端环境变量注入。

---

## 三、实际会入库的文件树（约 1MB 级，不含 35M 隐私目录）

```
微信小程序-还阳计划/
├─ app.js / app.json / app.wxss / sitemap.json
├─ project.config.json
├─ components/   pages/   themes/   utils/
├─ design/            (UI 方案图)
├─ 功能设计文档.md
├─ .gitignore
└─ README.md
```

---

## 四、推送步骤（你在本机执行）

仓库已 `git init` 并提交，remote `origin` 已指向 `huanyang_wechat`。**沙箱无法自推**（无交互终端、读不到 Windows 凭据），请在你自己电脑的终端完成：

```bash
# 1) 打开 Git Bash（或 PowerShell），进入项目目录
cd /d/A-TRAE-WORk/微信小程序-还阳计划

# 2) 推送（远程仓库已建好且为空，勿勾初始化选项）
git push -u origin main
```

- 若提示输入密码：GitHub 已不支持账号密码，请填 **Personal Access Token（PAT）**，用户名填 `pikax6`。
- 若尚未在 GitHub 建仓库：新建**空仓库**（不要勾 Add README/.gitignore/license），地址用 `https://github.com/pikax6/huanyang_wechat.git`。
- 推完验证：`git ls-remote origin`，能看到 `main` 即成功。

---

## 五、公开仓库注意

- `软著材料/` 已被忽略，不会出现在仓库；若你将来改私有仓库并想保留它，删除 `.gitignore` 中对应两行即可（注意其中含个人隐私）。
- 若设为 Public，请勿在源码中填入真实接口密钥。
