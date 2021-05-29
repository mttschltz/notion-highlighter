import { closest, contains } from "./dom.js";
import rangy from "../rangy";

let highlighter = rangy.createHighlighter();    
highlighter.addClassApplier(rangy.createClassApplier("share-this-highlight", {}));

export function highlight(range) {
    highlighter.highlightSelection("share-this-highlight", {  });
    highlighter.highlightRanges("share-this-highlight", [range], {  });
}