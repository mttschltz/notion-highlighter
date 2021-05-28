import { closest, contains } from "./dom.js";

export function highlight(range) {
    // create span with same content as the first text node
    // TODO: update to only set the selected content... it's not always the entire container selected
    const span = document.createElement('span')
    span.classList.add('share-this-highlight')
    span.textContent = range.startContainer.textContent

    // insert span before the first text node
    range.startContainer.parentNode.insertBefore(span, range.startContainer)

    // remove the original text node
    range.startContainer.remove()
}