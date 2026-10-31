# AI Chat to Markdown

Export your own AI chat conversation to a clean Markdown file, with one click, locally in your browser.

**No account. No API key. No data sent anywhere.** The extension only reads the conversation already open in your tab and downloads a `.md` file to your computer.

## What it does in v0.1.7

- One-click export from a ChatGPT conversation to Markdown
- Keeps code blocks as fenced code blocks, and tables as Markdown tables
- File name comes from the chat title
- Clean output: no plugin credit or notes added to the exported file, and common page UI labels are filtered out
- Works fully offline, after the page has loaded


## Install it locally (no store needed yet)

1. Open Chrome and go to `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder (`ai-chat-to-markdown`)
5. Open a ChatGPT conversation, click the extension icon, click **Export to Markdown**
6. Find the `.md` file in your Downloads folder

If it says "No conversation turns found", reload the chat page once, scroll so the conversation loads, and try again.

## Roadmap

- [ ] Gemini adapter
- [ ] Claude adapter
- [ ] Choose file name / include timestamps
- [ ] Export only selected messages
- [ ] Publish to the Chrome Web Store

## Privacy

This extension does not collect, store, or transmit your conversations, account information, passwords, or API keys. Everything happens in your browser tab.

## Contributing

Issues and pull requests are welcome. Please keep the first version small: one site, one format, done well.

## License

MIT — see `LICENSE`.
