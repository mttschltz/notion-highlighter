import { getOffsetScroll, closest } from "./dom.js";
import { findByName, isCallable } from "./utils.js";
import { isSelectionForward, getEndLineRect } from "./selection.js";
import styles from './less/share-this.less'

export function stylePopover(popover, range, options) {
    const _document = options.document;
    const _window = _document.defaultView;
    const selection = _window.getSelection();
    const isForward = isSelectionForward(selection);
    const endLineRect = getEndLineRect(range, isForward);
    const offsetScroll = getOffsetScroll(_window);

    const style = popover.style;
    if (isForward) {
        style.right = `${_document.documentElement.clientWidth - endLineRect.right + offsetScroll.left}px`;
    } else {
        style.left = `${endLineRect.left - offsetScroll.left}px`;
    }
    style.width = `${endLineRect.right - endLineRect.left}px`;
    style.height = `${endLineRect.bottom - endLineRect.top}px`;
    style.top = `${endLineRect.top - offsetScroll.top}px`;
    style.position = "absolute";

    // eslint-disable-next-line no-param-reassign
    popover.className = options.popoverClass;
}

const dataAttribute = "data-share-via";
export function popoverClick(sharers, event, text) {
    const item = closest(event.target, `[${dataAttribute}]`);
    if (!item) return;

    const via = item.getAttribute(dataAttribute);
    const sharer = findByName(sharers, via);
    if (sharer && isCallable(sharer.action)) {
        sharer.action(event, item, text);
    }
}

export function lifeCycleFactory(document) {
    return {
        createPopover() {
            const popover = document.createElement("div");
            return popover;
        },
        attachPopover(popover, range) {
            document.body.appendChild(popover);
            // Three problems with using `range` instead of `selection`:
            // 1. It often doesn't include all text if spanning across different element types like headings
            // 2. It will sometimes contain HTML
            // 3. The range is updated sometimes. It will have changed in the click event listener below and the toString() value is empty.
            // Not sure why. Might be related to the click event on the popover clearing the selection. It seemed to go away when the Notion button
            // has <a href="#" rather than <a href="javascript:void(0)" ... maybe changing it to a <button> would help.
            const text = window.getSelection().toString()
            popover.addEventListener("click", function(event) {
                popoverClick(this.sharers, event, text);
            });
        },
        removePopover(popover) {
            const parent = popover.parentNode;
            if (parent) parent.removeChild(popover);
        }
    };
}
