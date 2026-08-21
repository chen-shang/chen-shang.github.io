# Repository Guidelines

## Project Structure & Module Organization

本仓库是“AI 纪元”中文静态站点，不使用框架、包管理器或服务端。`index-all.html` 是内容入口；主文章位于根目录，按 `partN.html` 命名，专题及工具连接教程使用 `dartmouth.html`、`connect-*.html`、`mcp-db-email.html` 等描述性名称。公共样式和交互分别维护在 `styles.css`、`scripts.js`；页面特有样式使用对应文件，如 `part8.html` 搭配 `part8.css`。图片、截图统一放入 `source/`。`css/learning-map.css` 和 `js/learning-map.js` 属于旧版资源，除修复遗留页面外不要继续扩展。

## Build, Test, and Development Commands

项目无需构建或安装依赖。可直接打开 HTML；涉及跨页面链接或浏览器调试时，在仓库根目录运行：

```bash
python3 -m http.server 8011
```

访问 `http://localhost:8011/index-all.html`，不要占用 8080 端口。提交前运行：

```bash
git diff --check
git status --short
```

前者检查空白和冲突标记问题，后者确认没有提交日志、临时截图或无关文件。

## Coding Style & Naming Conventions

沿用现有四空格缩进和语义化 HTML5，页面保留 `lang="zh-CN"`、viewport、图片 `alt` 与交互元素的 ARIA 属性。CSS 类名使用 kebab-case，优先复用 `styles.css` 的变量和组件；仅页面专用规则放入 `partN.css` 或同名样式文件。共享 JavaScript 写入 `scripts.js`，单页交互才使用内联脚本。正文、注释和导航文案以中文为主。

## Testing Guidelines

仓库暂无自动化测试，所有修改都需浏览器人工验证。至少检查目标页面与 `index-all.html`，并覆盖桌面和小于 768px 的窄屏。确认导航高亮、目录、锚点、前后篇链接、图片路径、滚动动画及控制台无报错。视觉调整应保留修改前后截图供评审。

## Commit & Pull Request Guidelines

历史提交多为简短的 `fix`，尚无强制规范。新提交建议使用简洁、祈使式且带范围的格式，例如 `fix(part7): correct MCP terminology`。PR 应列出受影响文件、修改目的、人工验证步骤和关联 issue；视觉变更附截图，事实性内容修订附权威来源与核对日期，避免夹带无关改动。

## Content, Navigation & Security

新增、删除或重排文章时，同步更新入口卡片、各页顶部导航及相邻文章的前后篇链接。不要提交密钥、账号、真实个人信息、本地配置或调试产物；外部产品界面与时效性信息应注明核对日期。
