var browser = require("webextension-polyfill");

browser.contextMenus.create({
    id: "notion-highlighter-start",
    title: "Notion Highlighter: Start on page",
    contexts: ["all"],
});

