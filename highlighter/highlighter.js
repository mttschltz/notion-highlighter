import shareThis from '../lib/share-this/core'
import * as twitterSharer from "../lib/share-this/sharers/twitter";

console.log(`loading share-this`)

const selectionShare = shareThis({
    sharers: [ twitterSharer ]
});

selectionShare.init();