// AI Chat to Markdown — content script (v0.1.7)
// Runs only in the page you are looking at. It reads the conversation
// already visible in your browser and turns it into Markdown locally.
// It never sends anything to a server, and never reads passwords or keys.

function textWithCodeBlocks(node) {
  let out = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent;
    } else if (child.nodeName === "PRE") {
      const code = child.querySelector("code");
      const lang = code && code.className
        ? code.className.replace("language-", "").split(" ")[0]
        : "";
      const codeText = code ? (code.innerText || code.textContent || "") : (child.innerText || child.textContent || "");
      out += "\n```" + lang + "\n" + codeText + "\n```\n";
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      out += textWithCodeBlocks(child);
      if (["P", "DIV", "LI"].includes(child.nodeName)) out += "\n";
    }
  });
  return out;
}

function clean(text) {
  return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function messagesFromElements(elements) {
  const messages = [];
  const seen = new Set();
  elements.forEach((turn) => {
    // Skip a container that itself contains another turn element, to avoid
    // exporting the same message twice (nested article / div wrappers).
    const inner = turn.querySelector("[data-message-author-role], article[data-testid^='conversation-turn']");
    if (inner && inner !== turn) {
      // Only skip if the inner turn is a direct descendant turn, not just
      // a markdown child. The primary selector already covers those cases.
      // For article fallbacks, nested articles are rare; keep the leaf only.
      if (turn.tagName === "ARTICLE") return;
    }
    const roleEl = turn.matches("[data-message-author-role]")
      ? turn
      : turn.querySelector("[data-message-author-role]");
    const role = roleEl ? roleEl.getAttribute("data-message-author-role") : "unknown";
    const body = turn.querySelector(".markdown, [class*='markdown']") || turn;
    const text = clean(textWithCodeBlocks(body));
    if (text && !seen.has(text)) {
      seen.add(text);
      messages.push({ role, text });
    }
  });
  return messages;
}

function diagnose() {
  const main = document.querySelector("main");
  return {
    role: document.querySelectorAll("[data-message-author-role]").length,
    articleTurn: document.querySelectorAll("article[data-testid^='conversation-turn']").length,
    article: document.querySelectorAll("article").length,
    markdown: document.querySelectorAll(".markdown, [class*='markdown']").length,
    main: main ? 1 : 0,
    mainBlocks: main ? main.querySelectorAll("p, li, h1, h2, h3, h4, pre").length : 0,
  };
}

// UI labels and citation pills seen in the real v0.1.4 export. These are
// page chrome, not conversation text, so they are dropped exactly when
// they appear as a whole block.
const UI_LABELS = new Set([
  "你说：", "你说:", "ChatGPT 说：", "ChatGPT 说:", "ChatGPT said:", "You said:",
  "最新一条回复", "Latest response", "询问 ChatGPT", "Ask ChatGPT",
  "记忆已更新", "Memory updated",
]);
function isUiLabel(text) {
  const plain = text.replace(/^###\s+/, "").trim();
  if (UI_LABELS.has(plain)) return true;
  if (/^\+\d+$/.test(plain)) return true; // citation pill like "+1"
  if (/^OpenAI Help Center$/.test(plain)) return true;
  if (plain === "升级订阅" || plain === "分享" || plain === "Share") return true;
  if (plain.startsWith("ChatGPT 可能会出错") || plain.startsWith("ChatGPT may make mistakes")) return true;
  return false;
}

// v0.1.6: UI chrome can arrive inside one combined block, not just as a
// whole block (e.g. a header container holding "升级订阅\n分享", or a
// citation container holding "OpenAI Help Center\n+1"). So filter line
// by line, preserving fenced code blocks untouched.
function cleanUiLines(text) {
  let inFence = false;
  return text.split("\n").map((line) => {
    if (line.trim().startsWith("```")) { inFence = !inFence; return line; }
    if (inFence) return line;
    return isUiLabel(line) ? "" : line;
  }).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function tableToMarkdown(table) {
  const rows = Array.from(table.querySelectorAll("tr")).map((tr) => {
    return Array.from(tr.querySelectorAll("th, td")).map((cell) => {
      return clean(cell.innerText || cell.textContent || "").replace(/\|/g, "\\|").replace(/\s+/g, " ");
    });
  }).filter((r) => r.length && r.some((c) => c));
  if (!rows.length) return "";
  const width = Math.max.apply(null, rows.map((r) => r.length));
  const norm = rows.map((r) => {
    while (r.length < width) r.push("");
    return "| " + r.join(" | ") + " |";
  });
  const sep = "| " + Array(width).fill("---").join(" | ") + " |";
  // First row is the header if the table uses <th>, otherwise keep it as
  // a header anyway so the Markdown table renders.
  return [norm[0], sep].concat(norm.slice(1)).join("\n");
}

// v0.1.5 main fallback, rewritten from v0.1.4:
// - Tables are converted to real Markdown tables, not flattened cells.
// - UI labels are filtered out.
// - Plain-text user bubbles are captured: a div/span with no block
//   descendants and only inline text (the usual shape of a user message
//   on the div-only page) is now a block, instead of being missed because
//   it is not wrapped in <p>.
// Walk in document order, never recursing into a block/table once taken,
// so no text is exported twice.
function extractMainBlocks() {
  const main = document.querySelector("main");
  if (!main) return [];
  const blocks = [];
  const seen = new Set();
  function push(text) {
    if (!text) return;
    text = cleanUiLines(text);
    if (!text || text.length < 3) return;
    if (seen.has(text)) return;
    seen.add(text);
    blocks.push(text);
  }
  function walk(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.closest("button, nav, form, textarea, [role='navigation']")) return;
    if (node.tagName === "TABLE") { push(tableToMarkdown(node)); return; }
    if (["P", "LI", "H1", "H2", "H3", "H4", "PRE"].includes(node.tagName)) {
      let text;
      if (node.tagName === "PRE") {
        const code = node.querySelector("code");
        const lang = code && code.className ? code.className.replace("language-", "").split(" ")[0] : "";
        const codeText = code ? (code.innerText || code.textContent || "") : (node.innerText || node.textContent || "");
        text = "```" + lang + "\n" + codeText.trim() + "\n```";
      } else {
        text = clean(node.innerText || node.textContent || "");
      }
      if (/^H[1-4]$/.test(node.tagName) && text) text = "### " + text;
      push(text);
      return;
    }
    const hasBlock = node.querySelector("p, li, h1, h2, h3, h4, pre, table");
    if (!hasBlock) {
      const text = clean(node.innerText || node.textContent || "");
      // Only take inline-text containers (user bubbles, plain spans).
      // Skip the huge wrappers that would duplicate everything below them:
      // those always have block descendants, handled above by recursion.
      if (text) push(text);
      return;
    }
    Array.from(node.children).forEach(walk);
  }
  Array.from(main.children).forEach(walk);
  if (blocks.join("\n\n").length < 20) return [];
  return [{ role: "unknown", text: blocks.join("\n\n") }];
}

// --- ChatGPT (first supported site) ---
// v0.1.2 relied only on data-message-author-role. Real pages in late 2026
// can show a conversation without that attribute, so v0.1.3 falls back in
// order: role attribute -> conversation-turn articles -> any article.
// Fallback turns keep role "unknown" and are labelled "Message" in the
// export, rather than failing with no file at all.
function extractChatGPT() {
  const d = diagnose();
  if (d.role > 0) {
    return messagesFromElements(document.querySelectorAll("[data-message-author-role]"));
  }
  if (d.articleTurn > 0) {
    return messagesFromElements(document.querySelectorAll("article[data-testid^='conversation-turn']"));
  }
  if (d.article > 0) {
    const articles = Array.from(document.querySelectorAll("article")).filter((a) => {
      const t = clean(a.innerText || a.textContent || "");
      return t.length > 20 && t.length < 50000;
    });
    return messagesFromElements(articles);
  }
  return extractMainBlocks();
}

function extractGeneric() {
  const candidates = Array.from(document.querySelectorAll("article, [data-testid*='conversation-turn']"));
  const messages = [];
  candidates.forEach((el) => {
    const text = clean(el.innerText || el.textContent || "");
    if (text.length > 20 && text.length < 20000) {
      messages.push({ role: "unknown", text });
    }
  });
  return messages;
}

function extract() {
  const host = location.hostname;
  if (host.includes("chatgpt.com") || host.includes("openai.com")) {
    return extractChatGPT();
  }
  return extractGeneric();
}

function toMarkdown(messages, title) {
  // v0.1.7: the exported file contains only the conversation itself.
  // No plugin credit line and no "this page does not label turns" note
  // are added, because those are not part of the chat.
  let md = "# " + (title || "AI Chat Export") + "\n\n";
  messages.forEach((m) => {
    const label = m.role === "user" ? "You" : m.role === "assistant" ? "Assistant" : "Message";
    md += "## " + label + "\n\n" + cleanUiLines(m.text) + "\n\n---\n\n";
  });
  return md;
}

function download(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.action === "export") {
    const messages = extract();
    if (!messages.length) {
      const d = diagnose();
      sendResponse({ ok: false, error: "No conversation turns found on this page. Diagnostic counts — role=" + d.role + ", conversation-turn articles=" + d.articleTurn + ", articles=" + d.article + ", markdown blocks=" + d.markdown + ", main=" + d.main + ", main blocks=" + d.mainBlocks + ". Reload the chat page, scroll to load it, then try again." });
      return true;
    }
    const title = (document.title || "ai-chat").replace(/[^\w\- ]+/g, "").trim() || "ai-chat";
    const slug = title.toLowerCase().replace(/\s+/g, "-").slice(0, 60);
    download(slug + ".md", toMarkdown(messages, document.title));
    sendResponse({ ok: true, count: messages.length });
    return true;
  }
});
