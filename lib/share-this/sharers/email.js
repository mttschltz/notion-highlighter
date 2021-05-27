export function render(text, rawText, refUrl) {
    const url = this.getShareUrl(text, refUrl);

    return `<a href="${url}" rel="noopener nofollow noreferrer">`
        + "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-9 -9 96 96\">"
            + "<path d=\"M1 12c-.553 0-1 .447-1 1v52c0 .553.447 1 1 1h76c.553 0 1-.447 1-1V13"
                + "c0-.553-.447-1-1-1H1zm68.816 6L39 40.594 8.184 18h61.632zM72 60H6V23.84"
                + "l29.452 21.593 3.548 2.6 3.548-2.6L72 23.838V60z\" fill=\"currentcolor\"/>"
        + "</svg></a>";
}

export function getShareUrl(text, refUrl) {
    return `mailto:?body=${encodeURIComponent(text)}%0a%0a${encodeURIComponent(refUrl)}`;
}

export const name = "email";
