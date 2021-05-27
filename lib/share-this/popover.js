import { getOffsetScroll, closest } from "./dom.js";
import { findByName, isCallable } from "./utils.js";
import { isSelectionForward, getEndLineRect } from "./selection.js";

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
export function popoverClick(sharers, event) {
    const item = closest(event.target, `[${dataAttribute}]`);
    if (!item) return;

    const via = item.getAttribute(dataAttribute);
    const sharer = findByName(sharers, via);
    if (sharer && isCallable(sharer.action)) {
        sharer.action(event, item);
    }
}

export function lifeCycleFactory(document) {
    return {
        createPopover() {
            const popover = document.createElement("div");
            popover.addEventListener("click", function(event) {
                popoverClick(this.sharers, event);
            });
            return popover;
        },
        attachPopover(popover) {
            document.body.appendChild(popover);
        },
        removePopover(popover) {
            const parent = popover.parentNode;
            if (parent) parent.removeChild(popover);
        }
    };
}
