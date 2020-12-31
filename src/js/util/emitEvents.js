export const emitEvents = (element, eventName, target) => {
    const event = new CustomEvent(eventName, { detail: target });
    element.dispatchEvent(event);
}
