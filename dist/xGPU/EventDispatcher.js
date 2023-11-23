export class EventDispatcher {
    eventListeners = {};
    constructor() {
    }
    addEventListener(eventName, callback, removeListenerAfterDispatch = false) {
        if (!this.eventListeners[eventName])
            this.eventListeners[eventName] = [];
        if (removeListenerAfterDispatch)
            callback.removeAfter = true;
        this.eventListeners[eventName].push(callback);
    }
    removeEventListener(eventName, callback) {
        if (this.eventListeners[eventName]) {
            const id = this.eventListeners[eventName].indexOf(callback);
            if (id != -1) {
                this.eventListeners[eventName].splice(id, 1);
            }
        }
    }
    clearEvents(eventName) {
        this.addEventListener[eventName] = [];
    }
    hasEventListener(eventName) { return !!this.eventListeners[eventName]; }
    dispatchEvent(eventName, eventData) {
        if (this.eventListeners[eventName]) {
            const t = [...this.eventListeners[eventName]];
            t.forEach(callback => {
                callback(this, eventData);
                if (callback.removeAfter)
                    this.removeEventListener(eventName, callback);
            });
        }
    }
}
