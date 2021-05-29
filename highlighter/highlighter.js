import shareThis from '../lib/share-this/core'
import rangy from "../lib/rangy";
import * as notionSharer from "../lib/share-this/sharers/notion";

function handleResponse(message) {
    console.log(`Message from the background script:  ${JSON.stringify(message)}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(range) {
    // TODO: when a block element ends... add a new line (or insert a separate paragraph into the notion page)
    // TODO: Links
    var sending = browser.runtime.sendMessage({
        text: range.toString()
    });
    sending.then(handleResponse, handleError);
}

notionSharer.action = (event, item, range) => {
    console.log(`item`, item) // can't traverse this up to popover... only goes to ul for some reason... not in dom yet?
    console.log(`range`, range) 

    notifyBackgroundPage(range);
}

const selectionShare = shareThis({
    sharers: [ notionSharer ],
    highlight: true,
});

selectionShare.init();