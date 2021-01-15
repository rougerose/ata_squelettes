export const addEvent = (obj, type, callback) => {
    if (obj == null || typeof obj == "undefined") return;
    if (obj.addEventListener) {
        obj.addEventListener(type, callback, false);
    } else if (obj.attachEvent) {
        obj.attachEvent("on" + type, callback);
    } else {
        obj["on" + type] = callback;
    }
};
