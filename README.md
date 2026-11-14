# AI Chat to Markdown

一键把你自己的 AI 对话导出成干净的 Markdown 文件，在浏览器本地完成提取和转换。

扩展从你当前打开的受支持对话页面读取内容，并下载 `.md` 文件。扩展本身不上传对话、不调用 AI API、不收集分析数据。使用时仍需访问并登录相应的 AI 网站；该网站自身的数据处理不受本扩展控制。

## 当前功能（v0.1.7）

- 从 ChatGPT 对话导出 Markdown
- 保留围栏代码块和 Markdown 表格
- 根据对话标题生成文件名
- 过滤常见页面界面文字
- 对话页面加载后，提取和转换无需额外网络请求

> Gemini 和 Claude 的站点匹配已在扩展配置中，但 README 暂不将其列为已验证支持；导出行为需在真实页面上验证。

## 浏览器与权限

- 当前安装和手工验证流程以 Chrome 为准；其他 Chromium 浏览器可能兼容，但尚未承诺支持范围。
- 扩展使用 Manifest V3。
- 内容脚本仅匹配 `chatgpt.com`、`chat.openai.com`、`gemini.google.com` 和 `claude.ai` 页面。
- `activeTab` 用于用户点击扩展时访问当前标签页。没有单独申请下载、存储或后台权限。
- 扩展读取当前匹配页面中可见/已加载的对话 DOM；页面尚未加载的历史内容可能无法导出。请检查导出文件再分享，文件可能包含敏感对话内容。

## 安装（Chrome 开发者模式）

1. 在仓库首页点 **Code** → **Download ZIP** 并解压。
2. 打开 `chrome://extensions`，启用 **开发者模式**。
3. 点击 **加载未打包的扩展程序**，选择包含 `manifest.json` 的目录。
4. 打开支持网站上的对话，点击扩展图标，再点 **Export to Markdown**。
5. 导出的 Markdown 文件会保存到浏览器默认下载位置。

如果提示 “No conversation turns found”，刷新对话页，等待内容加载并滚动到需要导出的区域后重试。动态页面结构变化可能暂时影响提取。

## 当前限制

- 目前 README 仅确认 ChatGPT 的导出流程；Gemini 和 Claude 尚未列为经过验证。
- 导出内容取决于页面已加载的内容。
- 图片、附件、语音等非文本内容不保证导出；请检查生成的文件。
- 页面 DOM 更新可能需要调整适配逻辑。

## 计划

- 验证并完善 Gemini、Claude 适配
- 自定义文件名和时间戳
- 只导出选中的消息
- Chrome Web Store 发布

## 隐私

本扩展不包含用于上传对话、遥测或分析的网络请求代码。它会在用户操作时从当前匹配的 AI 网站页面读取对话并在本地生成文件。浏览器访问 AI 网站产生的数据传输由该网站负责；不要将含敏感信息的导出文件公开分享。

## 参与贡献

请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。安全问题请参阅 [SECURITY.md](SECURITY.md)。

## 开源协议

MIT，见 [LICENSE](LICENSE)。

---

## English

Export your own AI conversations to Markdown in your browser. The extension reads the currently open supported conversation page and creates a local file. It does not upload conversations or make AI API calls. You still need to access and sign in to the AI website; its own data practices are outside this extension's control.

Manifest V3. ChatGPT is the currently documented and manually verified export flow. Gemini and Claude are configured as matching sites but are not yet listed as verified. Export depends on content loaded in the page; images, attachments, and audio are not guaranteed to be included. Review exported files before sharing.

Install from source: download and unzip this repository, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the folder containing `manifest.json`.
