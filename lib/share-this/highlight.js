import rangy from "../rangy";

let highlighter = rangy.createHighlighter();    
highlighter.addClassApplier(rangy.createClassApplier("share-this-highlight", {}));

export function highlight(range) {
    highlighter.highlightSelection("share-this-highlight", {  });
  
    // highlightRanges errors internally on getDocument() which is a Rangy Range, not standard
    // highlighter.highlightRanges("share-this-highlight", [range], {  });
}