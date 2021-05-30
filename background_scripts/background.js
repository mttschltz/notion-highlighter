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
        debugger;
    }).then((rawResponse) => {
        return rawResponse.json();
    }).catch(e => {
        console.error('Parsing JSON from search response error', e)
        debugger;
    }).then((response) => {
        console.log('searchResponse=', response)
        if (response.results && response.results.length > 0) {
            console.log('Page already exists, results:', response)
            return
        }
        return fetch('https://api.notion.com/v1/pages/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Notion-Version': '2021-05-13',
                'Authorization': `Bearer ${integrationToken}`,
            },
            body: getBody(rootPageID, text, title, url)
        });
    }).catch(e => {
        console.error('Create page error', e)
        debugger;
    }).then((rawResponse) => {
        if (rawResponse) {
            return rawResponse.json();
        }
        return Promise.resolved()
    }).catch(e => {
        console.error('Parsing JSON from create page response error', e)
        debugger;
    }).then((response) => {
        console.log('Create page response', response);
    })
}

browser.runtime.onMessage.addListener(handleMessage)

function getBody(rootPageID, text, title, url) {
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
            },
            {
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
            }
        ]
    })
}

    
