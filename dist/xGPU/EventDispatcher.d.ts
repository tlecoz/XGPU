export declare class EventDispatcher {
    protected eventListeners: any;
    constructor();
    addEventListener(eventName: string, callback: (data?: any) => void, removeListenerAfterDispatch?: boolean): void;
    removeEventListener(eventName: string, callback: (dispatcher: EventDispatcher, data?: any) => void): void;
    clearEvents(eventName: any): void;
    hasEventListener(eventName: any): boolean;
    dispatchEvent(eventName: string, eventData?: any): void;
}
