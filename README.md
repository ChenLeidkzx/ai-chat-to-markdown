# AI Chat to Markdown

一键把你自己的 AI 对话导出成干净的 Markdown 文件，全部在浏览器本地完成。

**不用注册账号，不用 API Key，不会把你的对话发到任何地方。** 插件只读取你当前打开的那个对话页面，然后把 `.md` 文件下载到你的电脑上。

## v0.1.7 能做什么

- 一键从 ChatGPT 对话导出 Markdown
- 代码块保留为围栏代码块，表格保留为真正的 Markdown 表格
- 文件名取自对话标题
- 导出结果很干净：不会在文件里加插件署名和说明，也会过滤掉页面上的常见界面文字，比如“升级订阅”“分享”“记忆已更新”
- 页面加载完之后，全程离线可用

## 怎么安装（不用去应用商店）

1. 先下载这个仓库：打开仓库首页，点绿色 **Code** 按钮，点 **Download ZIP**，下载完解压
2. 打开 Chrome，到 `chrome://extensions`
3. 右上角打开 **开发者模式**
4. 点 **加载未打包的扩展程序**
5. 选择解压出来的文件夹，里面要能直接看到 `manifest.json` 才对
6. 打开一个 ChatGPT 对话，点插件图标，点 **Export to Markdown**
7. 导出的 `.md` 文件就在你的下载文件夹里

如果提示“No conversation turns found”，先刷新一次对话页面，往下滚一滚让对话加载出来，再点一次导出。

## 后续计划

- [ ] Gemini 适配
- [ ] Claude 适配
- [ ] 自定义文件名 / 带上时间
- [ ] 只导出选中的消息
- [ ] 上架 Chrome Web Store

## 隐私

这个插件不会收集、保存或传输你的对话内容、账号信息、密码或 API Key，所有处理都在你自己的浏览器标签页里完成。

## 参与贡献

欢迎提 Issue 和 Pull Request。第一版保持小而精：一个网站、一种格式，先做好。

## 开源协议

MIT — 见 `LICENSE`。

---

## English (brief)

Export your own AI chat conversation to a clean Markdown file, locally in your browser. No account, no API key, no data sent anywhere. Install: download this repo as ZIP, unzip it, go to `chrome://extensions`, turn on Developer mode, Load unpacked, and select the folder containing `manifest.json`.
