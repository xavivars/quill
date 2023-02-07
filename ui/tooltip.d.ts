import Quill from '../core';
declare class Tooltip {
    quill: Quill;
    boundsContainer: HTMLElement;
    root: HTMLDivElement;
    constructor(quill: Quill, boundsContainer: HTMLElement);
    hide(): void;
    position(reference: any): number;
    show(): void;
}
export default Tooltip;
