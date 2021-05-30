import shareThis from '../lib/share-this/core'
import rangy from "../lib/rangy";
import * as notionSharer from "../lib/share-this/sharers/notion";

function handleResponse(message) {
    console.log(`Message from the background script:  ${JSON.stringify(message)}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(text) {
    // TODO: when a block element ends... add a new line (or insert a separate paragraph into the notion page)
    // TODO: Links
    var sending = browser.runtime.sendMessage({
        text,
        title: document.title,
        url: document.location.href
    });
    sending.then(handleResponse, handleError);
}

notionSharer.action = (event, item, text) => {
    console.log(`item`, item) // can't traverse this up to popover... only goes to ul for some reason... not in dom yet?
    console.log(`text`, text) 

    notifyBackgroundPage(text);
}

const selectionShare = shareThis({
    sharers: [ notionSharer ],
    highlight: true,
});

selectionShare.init();