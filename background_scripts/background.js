var browser = require("webextension-polyfill");
import optionsStorage from '../options/options-storage.js';

browser.contextMenus.create({
    id: "notion-highlighter-start",
    title: "Notion Highlighter: Start on page",
    contexts: ["all"],
});

function handleMessage({text, title, url}, sender, sendResponse) {
    if (!text) {
        console.log('Empty range')
        return
    }
    // get credentials each time in case they are updated
    let integrationToken
    let rootPageID
    optionsStorage.getAll()
        .then(({ integrationToken: it, rootPageID: rpID }) => {
            integrationToken = it
            rootPageID = rpID
            return fetch('https://api.notion.com/v1/search', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Notion-Version': '2021-05-13',
                    'Authorization': `Bearer ${integrationToken}`,
                },
                body: JSON.stringify({
                    "query": title,
                    "sort": {
                        "direction": "descending",
                        "timestamp": "last_edited_time"
                    }
                })
            }); 
    }).catch(e => {
        console.error('Search error', e)
    }).then((rawResponse) => {
        return rawResponse.json();
    }).catch(e => {
        console.error('Parsing JSON from search response error', e)
    }).then((response) => {
        console.log('searchResponse=', response)
        let updatePageID
        if (response.results && response.results.length > 0) {
            const page = response.results[0]
            let existingTitle
            try {
                existingTitle = page.properties.title.title[0].text.content
            } catch (e) {
                console.error(`title not found in first page`, page)
            }
            
            if (title === existingTitle) {
                updatePageID = page.id
            }
        }

        const highlightBlocks = getHighlightBlocks(text)

        if (updatePageID) {
            return fetch(`https://api.notion.com/v1/blocks/${updatePageID}/children`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Notion-Version': '2021-05-13',
                    'Authorization': `Bearer ${integrationToken}`,
                },
                body: getUpdatePageBody(highlightBlocks)
            });
        }

        return fetch('https://api.notion.com/v1/pages/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Notion-Version': '2021-05-13',
                'Authorization': `Bearer ${integrationToken}`,
            },
            body: getNewPageBody(rootPageID, title, url, highlightBlocks)
        });
    }).catch(e => {
        console.error('Create page error', e)
    }).then((rawResponse) => {
        if (rawResponse) {
            return rawResponse.json();
        }
        return Promise.resolved()
    }).catch(e => {
        console.error('Parsing JSON from create page response error', e)
    }).then((response) => {
        console.log('Create page response', response);
    })
}

browser.runtime.onMessage.addListener(handleMessage)

function getHighlightBlocks(text) {
    return [{
        "object": "block",
        "type": "paragraph",
        "paragraph": {
            "text": [
                {
                    "type": "text",
                    "text": {
                        "content": '' // empty block
                    }
                },
            ]
        }
    },
    {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
            "text": [
                {
                    "type": "text",
                    "text": {
                        "content": text
                    }
                }
            ]
        }
    }]
}

function getUpdatePageBody(highlightBlocks) {
    return JSON.stringify({
        "children": highlightBlocks
    })
}

 function getNewPageBody(rootPageID, title, url, highlightBlocks) {
    return JSON.stringify({
        "parent": {
            "page_id": rootPageID
        },
        "properties": {
            "title": [
                {
                    "text": {
                        "content": title
                    }
                }
            ]
        },
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "text": [
                        {
                            "type": "text",
                            "text": {
                                "content": `URL: `
                            }
                        },
                        {
                            "type": "text",
                            "text": {
                                "content": url,
                                "link": {
                                    "url": url
                                }
                            }
                        }
                    ]
                }
            }, ...highlightBlocks
        ]
    })
}

    
