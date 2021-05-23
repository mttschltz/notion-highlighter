require('./TextHighlighter.js')

var hltr = new window.TextHighlighter(document.body, {
    onBeforeHighlight: function (range) {
        return window.confirm('Send to Notion?');
    },
    onAfterHighlight: function (range, highlights) {
        // TODO: Send to Notion
    },
});