import { AttributorStore, BlockBlot, EmbedBlot } from 'parchment';
import { Blot } from 'parchment/dist/typings/blot/abstract/blot';
import Delta from '@reedsy/quill-delta';
declare class Block extends BlockBlot {
    cache: {
        delta?: Delta | null;
        length?: number;
    };
    delta(): Delta;
    deleteAt(index: number, length: number): void;
    formatAt(index: any, length: any, name: any, value: any): void;
    insertAt(index: any, value: any, def?: unknown): void;
    insertBefore(blot: any, ref: any): void;
    length(): number;
    moveChildren(target: any, ref: any): void;
    optimize(context: any): void;
    path(index: any): [Blot, number][];
    removeChild(child: any): void;
    split(index: any, force?: boolean): this | Blot;
}
declare class BlockEmbed extends EmbedBlot {
    attributes: AttributorStore;
    domNode: HTMLElement;
    attach(): void;
    delta(): Delta;
    format(name: any, value: any): void;
    formatAt(index: any, length: any, name: any, value: any): void;
    insertAt(index: number, value: string, def?: unknown): void;
}
declare function blockDelta(blot: BlockBlot, filter?: boolean): Delta;
declare function bubbleFormats(blot: any, formats?: {}, filter?: boolean): any;
export { blockDelta, bubbleFormats, BlockEmbed, Block as default };
