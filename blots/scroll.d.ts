import { ScrollBlot, LeafBlot, Registry } from 'parchment';
import { Blot } from 'parchment/dist/typings/blot/abstract/blot';
import Emitter, { EmitterSource } from '../core/emitter';
import Block, { BlockEmbed } from './block';
import Container from './container';
declare class Scroll extends ScrollBlot {
    static blotName: string;
    static className: string;
    static tagName: string;
    static defaultChild: typeof Block;
    static allowedChildren: (typeof Block | typeof BlockEmbed | typeof Container)[];
    emitter: Emitter;
    batch: false | MutationRecord[];
    constructor(registry: Registry, domNode: HTMLDivElement, { emitter }: {
        emitter: Emitter;
    });
    batchStart(): void;
    batchEnd(): void;
    emitMount(blot: any): void;
    emitUnmount(blot: any): void;
    emitEmbedUpdate(blot: any, change: any): void;
    deleteAt(index: any, length: any): void;
    enable(enabled?: boolean): void;
    formatAt(index: any, length: any, format: any, value: any): void;
    handleDragStart(event: any): void;
    insertAt(index: number, value: string, def?: unknown): void;
    insertBefore(blot: Blot, ref?: Blot): void;
    isEnabled(): boolean;
    leaf(index: number): [LeafBlot | null, number];
    line(index: number): [Block | BlockEmbed | null, number];
    lines(index?: number, length?: number): (Block | BlockEmbed)[];
    optimize(context: {
        [key: string]: any;
    }): void;
    optimize(mutations?: MutationRecord[], context?: {
        [key: string]: any;
    }): void;
    path(index: number): [Blot, number][];
    remove(): void;
    update(source?: EmitterSource): void;
    update(mutations?: MutationRecord[]): void;
    updateEmbedAt(index: number, key: string, change: unknown): void;
}
export interface ScrollConstructor {
    new (registry: Registry, domNode: HTMLDivElement, options: {
        emitter: Emitter;
    }): Scroll;
}
export default Scroll;
