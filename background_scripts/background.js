var browser = require("webextension-polyfill");
import optionsStorage from '../options/options-storage.js';

browser.contextMenus.create({
    id: "notion-highlighter-start",
    title: "Notion Highlighter: Start on page",
    contexts: ["all"],
});

function handleMessage(request, sender, sendResponse) {
    if (!request.text) {
        return
    }
    // get credentials each time in case they are updated
    optionsStorage.getAll().then(({ integrationToken, rootPageID }) => {
        return fetch('https://api.notion.com/v1/pages/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Notion-Version': '2021-05-13',
                'Authorization': `Bearer ${integrationToken}`,
                'Access-Control-Allow-Origin': 'https://api.notion.com'
            },
            body: getBody(rootPageID, request.text)
            });
    }).catch(e => {
        debugger;
    }).then((rawResponse) => {
        return rawResponse.json();
    }).then((content) => {
        console.log(content);
    })
}

browser.runtime.onMessage.addListener(handleMessage)

function getBody(rootPageID, text) {
    return JSON.stringify({
        "parent": {
            "page_id": rootPageID
        },
        "properties": {
                "title": [
                    {
                        "text": {
                            "content": document.title
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
                                "content": `URL: ${document.location.href}`
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

    
