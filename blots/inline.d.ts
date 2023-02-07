import { InlineBlot } from 'parchment';
declare class Inline extends InlineBlot {
    static allowedChildren: any;
    static order: string[];
    static compare(self: any, other: any): number;
    formatAt(index: any, length: any, name: any, value: any): void;
    optimize(context: any): void;
}
export default Inline;
