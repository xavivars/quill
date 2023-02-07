import BaseTheme, { BaseTooltip } from './base';
declare class BubbleTooltip extends BaseTooltip {
    static TEMPLATE: string;
    constructor(quill: any, bounds: any);
    listen(): void;
    cancel(): void;
    position(reference: any): number;
}
declare class BubbleTheme extends BaseTheme {
    constructor(quill: any, options: any);
    extendToolbar(toolbar: any): void;
}
export { BubbleTooltip, BubbleTheme as default };
