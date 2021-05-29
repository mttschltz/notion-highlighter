import optionsStorage from '../options/options-storage.js';
import shareThis from '../lib/share-this/core'
import * as notionSharer from "../lib/share-this/sharers/notion";

notionSharer.action = (event, item, range) => {
    // event.preventDefault();
    console.log(`item`, item) // can't traverse this up to popover... only goes to ul for some reason... not in dom yet?
    console.log(`range`, range) 

    // get credentials each time in case they are updated
    optionsStorage.getAll().then(({ integrationToken, rootPageID }) => {
        console.log(`integrationToken, rootPageID=${integrationToken} ${rootPageID}`)
    })

}

const selectionShare = shareThis({
    sharers: [ notionSharer ],
    highlight: true,
});

selectionShare.init();