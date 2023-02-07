import Delta from '@reedsy/quill-delta';
import Op from '@reedsy/quill-delta/dist/Op';
import Module from '../core/module';
export declare type CellData = {
    content?: Delta['ops'];
    attributes?: Record<string, unknown>;
};
export declare type TableRowColumnOp = Omit<Op, 'insert'> & {
    insert?: {
        id: string;
    };
};
export interface TableData {
    rows?: Delta['ops'];
    columns?: Delta['ops'];
    cells?: Record<string, CellData>;
}
export declare const composePosition: (delta: Delta, index: number) => number;
export declare const tableHandler: {
    compose(a: TableData, b: TableData, keepNull?: boolean): TableData;
    transform(a: TableData, b: TableData, priority: boolean): TableData;
    invert(change: TableData, base: TableData): TableData;
};
declare class TableEmbed extends Module {
    static register(): void;
}
export default TableEmbed;
