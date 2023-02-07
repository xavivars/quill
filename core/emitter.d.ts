import EventEmitter from 'eventemitter3';
declare class Emitter extends EventEmitter<string> {
    static events: {
        readonly EDITOR_CHANGE: "editor-change";
        readonly SCROLL_BEFORE_UPDATE: "scroll-before-update";
        readonly SCROLL_BLOT_MOUNT: "scroll-blot-mount";
        readonly SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount";
        readonly SCROLL_OPTIMIZE: "scroll-optimize";
        readonly SCROLL_UPDATE: "scroll-update";
        readonly SCROLL_EMBED_UPDATE: "scroll-embed-update";
        readonly SELECTION_CHANGE: "selection-change";
        readonly TEXT_CHANGE: "text-change";
    };
    static sources: {
        readonly API: "api";
        readonly SILENT: "silent";
        readonly USER: "user";
    };
    listeners: Record<string, {
        node: Node;
        handler: Function;
    }[]>;
    constructor();
    emit(...args: unknown[]): boolean;
    handleDOM(event: any, ...args: unknown[]): void;
    listenDOM(eventName: string, node: any, handler: any): void;
}
export declare type EmitterSource = typeof Emitter.sources[keyof typeof Emitter.sources];
export default Emitter;
