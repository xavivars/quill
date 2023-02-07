import Delta from '@reedsy/quill-delta';
import Module from '../core/module';
import Quill from '../core/quill';
interface HistoryOptions {
    userOnly: boolean;
    delay: number;
    maxStack: number;
}
declare class History extends Module<HistoryOptions> {
    lastRecorded: number;
    ignoreChange: boolean;
    stack: {
        undo: Delta[];
        redo: Delta[];
    };
    constructor(quill: Quill, options: Partial<HistoryOptions>);
    change(source: any, dest: any): void;
    clear(): void;
    cutoff(): void;
    record(changeDelta: any, oldDelta: any): void;
    redo(): void;
    transform(delta: any): void;
    undo(): void;
}
declare function getLastChangeIndex(scroll: any, delta: any): number;
export { History as default, getLastChangeIndex };
