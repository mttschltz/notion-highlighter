import shareThis from '../lib/share-this/core'
import * as notionSharer from "../lib/share-this/sharers/notion";

console.log(`loading share-this`)

const selectionShare = shareThis({
    sharers: [ notionSharer ],
    highlight: true,
});

selectionShare.init();