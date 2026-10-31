# Contributing

Thanks for helping improve AI Chat to Markdown.

## How to contribute, in order

1. Open an Issue first for anything bigger than a typo: what site, what went wrong, what you expected.
2. Fork the repo, make a small focused change, and open a Pull Request.
3. Keep each PR to one thing: one site adapter, one bug fix, or one UX improvement.

## Local test (required before a PR)

1. In Chrome, go to `chrome://extensions`, turn on Developer mode, Load unpacked, select this folder.
2. Open a ChatGPT conversation and export it. Check:
   - User and Assistant messages are in order
   - Code blocks stay as fenced code blocks
   - No passwords, keys, or personal data appear in the file
3. If the export is empty, reload the page, scroll to load the conversation, and try again.

## Code rules

- No new permission unless you explain why it is needed in the PR.
- No network requests, no analytics, no API keys. Everything stays in the browser tab.
- Keep the ChatGPT adapter working before adding a new site. New sites go in their own adapter, not by breaking the existing one.
- English for code comments and user-facing text, so the project stays readable internationally.
