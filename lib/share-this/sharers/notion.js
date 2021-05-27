export function render(text, rawText, refUrl) {
    const shareText = this.getText(text);
    const url = this.getShareUrl(shareText, refUrl);

    return "<p>Save to Notion</a>";
}

const CHAR_LIMIT = 120;
export function getText(text) {
    let chunk = text.trim();
    if (chunk.length > CHAR_LIMIT - 2) {
        chunk = chunk.slice(0, CHAR_LIMIT - 3).trim() + "\u2026";
    }

    return `\u201c${chunk}\u201d`;
}

export function getShareUrl(text, refUrl) {
    return `https://www.notion.com`;
}

export function action(event, item) {
    event.preventDefault();
}

export const name = "notion";
