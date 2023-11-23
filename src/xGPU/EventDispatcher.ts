

export class EventDispatcher {

    protected eventListeners: any = {};

    constructor() {

    }

    public addEventListener(eventName: string, callback: (dispatcher: EventDispatcher, data?: any) => void, removeListenerAfterDispatch: boolean = false) {
        if (!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        if (removeListenerAfterDispatch) (callback as any).removeAfter = true;
        this.eventListeners[eventName].push(callback);
    }
    public removeEventListener(eventName: string, callback: (dispatcher: EventDispatcher, data?: any) => void) {
        if (this.eventListeners[eventName]) {
            const id = this.eventListeners[eventName].indexOf(callback);
            if (id != -1) {
                this.eventListeners[eventName].splice(id, 1);
            }
        }
    }
    public clearEvents(eventName) {
        this.addEventListener[eventName] = [];
    }
    public hasEventListener(eventName): boolean { return !!this.eventListeners[eventName] }

    public dispatchEvent(eventName: string, eventData?: any) {
        if (this.eventListeners[eventName]) {

            const t = [...this.eventListeners[eventName]];
            t.forEach(callback => {
                callback(this, eventData);
                if ((callback as any).removeAfter) this.removeEventListener(eventName, callback);
            });
        }
    }
}