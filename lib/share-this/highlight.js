import rangy from "../rangy";

let highlighter = rangy.createHighlighter();    
highlighter.addClassApplier(rangy.createClassApplier("share-this-highlight", {}));

export function highlight(range) {
    highlighter.highlightRanges("share-this-highlight", [range], {  });
}