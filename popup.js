document.getElementById("exportBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Exporting…";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) throw new Error("No active tab.");
    const res = await chrome.tabs.sendMessage(tab.id, { action: "export" });
    if (res && res.ok) {
      status.textContent = "Done — exported " + res.count + " message(s). Check your Downloads folder.";
    } else {
      status.textContent = (res && res.error) || "Nothing to export on this page.";
    }
  } catch (e) {
    status.textContent = "Could not reach this page. Reload the chat page once, then try again.";
  }
});
