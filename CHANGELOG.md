# Changelog

## 0.1.7 — Clean export, no plugin notes
- Removed the plugin-generated header lines from exported files: the "Exported locally with AI Chat to Markdown" credit and the "This page does not label turns" note. The file now starts with the chat title and goes straight into the conversation.
- Also filtered the "记忆已更新" / "Memory updated" system label.

## 0.1.6 — Line-level UI filtering
- UI chrome that arrives inside a combined block is now filtered line by line, not only when it is a whole block. This removes the remaining leaks seen in the real v0.1.5 export: "升级订阅 / 分享", "OpenAI Help Center / +1", and the "ChatGPT 可能会出错。请核查重要信息。" footer. Fenced code blocks are preserved untouched.
- Fixed a related fence loss: a <pre> block reached directly by the main walker now keeps its ``` fences, instead of exporting as plain code text.

## 0.1.5 — Table, UI-label, and user-bubble fixes
- Tables are now converted to real Markdown tables (header + separator + rows) instead of being flattened to separate lines.
- UI labels seen in the real v0.1.4 export are filtered out when they appear as a whole block: "你说：", "ChatGPT 说：", "最新一条回复", citation pills like "+1", and standalone "OpenAI Help Center".
- Plain-text user bubbles are now captured: a div/span with no block descendants and only inline text is exported, which was the likely reason the user's original question was missing in v0.1.4 (user messages are often not wrapped in <p>).

## 0.1.4 — Div-only page fallback
- Fixed the all-zero diagnostic case (role=0, conversation-turn articles=0, articles=0, markdown blocks=0) on a real ChatGPT page whose conversation is built from plain div/p/h/li/table elements with hashed class names. Added a last-resort <main> block extractor that exports headings, paragraphs, list items, code blocks and table cells in order as one combined Message block, instead of failing with no file.
- Honest limit kept in the file: without labelled turns this fallback cannot reliably split You vs Assistant, so it does not guess. Diagnostic counts now also include main and main-block counts.

## 0.1.3 — Real-page fallback
- Fixed the "No conversation turns found" failure on a real ChatGPT page that shows a conversation but has no `data-message-author-role` elements. The extractor now falls back to `article[data-testid^="conversation-turn"]`, then to any article, and labels those turns "Message" when the role is unknown, instead of exporting nothing.
- Empty-page errors now include diagnostic counts (role / conversation-turn articles / articles / markdown blocks) so the next failure can be diagnosed without guessing.

## 0.1.2 — Test fix
- Fixed code blocks exporting as "undefined" in environments where `innerText` is unavailable, by falling back to `textContent`. Found by a simulated ChatGPT page test.
- Bumped the version string in exported files to match the manifest.

## 0.1.1 — Optimization release
- Trimmed permissions to only `activeTab`. Removed unused `scripting` and `downloads` permissions, so the extension asks for less and is easier to trust.
- Added CONTRIBUTING, issue templates, and a pull request template for open-source maintenance.

## 0.1.0 — First MVP
- One-click ChatGPT conversation export to Markdown.
- Code blocks preserved as fenced code blocks.
- Fully local: no account, no API key, no data sent anywhere.
- README, MIT LICENSE, and local install instructions.
