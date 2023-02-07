"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableHandler = exports.composePosition = void 0;
const quill_delta_1 = __importStar(require("@reedsy/quill-delta"));
const module_1 = __importDefault(require("../core/module"));
const parseCellIdentity = (identity) => {
    const parts = identity.split(':');
    return [Number(parts[0]) - 1, Number(parts[1]) - 1];
};
const stringifyCellIdentity = (row, column) => `${row + 1}:${column + 1}`;
const composePosition = (delta, index) => {
    let newIndex = index;
    const thisIter = new quill_delta_1.OpIterator(delta.ops);
    let offset = 0;
    while (thisIter.hasNext() && offset <= newIndex) {
        const length = thisIter.peekLength();
        const nextType = thisIter.peekType();
        thisIter.next();
        switch (nextType) {
            case 'delete':
                if (length > newIndex - offset) {
                    return null;
                }
                newIndex -= length;
                break;
            case 'insert':
                newIndex += length;
                offset += length;
                break;
            default:
                offset += length;
                break;
        }
    }
    return newIndex;
};
exports.composePosition = composePosition;
const compactCellData = ({ content, attributes }) => {
    const data = {};
    if (content.length() > 0) {
        data.content = content.ops;
    }
    if (attributes && Object.keys(attributes).length > 0) {
        data.attributes = attributes;
    }
    return Object.keys(data).length > 0 ? data : null;
};
const compactTableData = ({ rows, columns, cells }) => {
    const data = {};
    if (rows.length() > 0) {
        data.rows = rows.ops;
    }
    if (columns.length() > 0) {
        data.columns = columns.ops;
    }
    if (Object.keys(cells).length) {
        data.cells = cells;
    }
    return data;
};
const reindexCellIdentities = (cells, { rows, columns }) => {
    const reindexedCells = {};
    Object.keys(cells).forEach(identity => {
        let [row, column] = parseCellIdentity(identity);
        row = (0, exports.composePosition)(rows, row);
        column = (0, exports.composePosition)(columns, column);
        if (row !== null && column !== null) {
            const newPosition = stringifyCellIdentity(row, column);
            reindexedCells[newPosition] = cells[identity];
        }
    }, false);
    return reindexedCells;
};
exports.tableHandler = {
    compose(a, b, keepNull) {
        const rows = new quill_delta_1.default(a.rows || []).compose(new quill_delta_1.default(b.rows || []));
        const columns = new quill_delta_1.default(a.columns || []).compose(new quill_delta_1.default(b.columns || []));
        const cells = reindexCellIdentities(a.cells || {}, {
            rows: new quill_delta_1.default(b.rows || []),
            columns: new quill_delta_1.default(b.columns || []),
        });
        Object.keys(b.cells || {}).forEach(identity => {
            const aCell = cells[identity] || {};
            const bCell = b.cells[identity];
            const content = new quill_delta_1.default(aCell.content || []).compose(new quill_delta_1.default(bCell.content || []));
            const attributes = quill_delta_1.default.AttributeMap.compose(aCell.attributes, bCell.attributes, keepNull);
            const cell = compactCellData({ content, attributes });
            if (cell) {
                cells[identity] = cell;
            }
            else {
                delete cells[identity];
            }
        });
        return compactTableData({ rows, columns, cells });
    },
    transform(a, b, priority) {
        const aDeltas = {
            rows: new quill_delta_1.default(a.rows || []),
            columns: new quill_delta_1.default(a.columns || []),
        };
        const bDeltas = {
            rows: new quill_delta_1.default(b.rows || []),
            columns: new quill_delta_1.default(b.columns || []),
        };
        const rows = aDeltas.rows.transform(bDeltas.rows, priority);
        const columns = aDeltas.columns.transform(bDeltas.columns, priority);
        const cells = reindexCellIdentities(b.cells || {}, {
            rows: bDeltas.rows.transform(aDeltas.rows, !priority),
            columns: bDeltas.columns.transform(aDeltas.columns, !priority),
        });
        Object.keys(a.cells || {}).forEach(identity => {
            let [row, column] = parseCellIdentity(identity);
            row = (0, exports.composePosition)(rows, row);
            column = (0, exports.composePosition)(columns, column);
            if (row !== null && column !== null) {
                const newIdentity = stringifyCellIdentity(row, column);
                const aCell = a.cells[identity];
                const bCell = cells[newIdentity];
                if (bCell) {
                    const content = new quill_delta_1.default(aCell.content || []).transform(new quill_delta_1.default(bCell.content || []), priority);
                    const attributes = quill_delta_1.default.AttributeMap.transform(aCell.attributes, bCell.attributes, priority);
                    const cell = compactCellData({ content, attributes });
                    if (cell) {
                        cells[newIdentity] = cell;
                    }
                    else {
                        delete cells[newIdentity];
                    }
                }
            }
        });
        return compactTableData({ rows, columns, cells });
    },
    invert(change, base) {
        const rows = new quill_delta_1.default(change.rows || []).invert(new quill_delta_1.default(base.rows || []));
        const columns = new quill_delta_1.default(change.columns || []).invert(new quill_delta_1.default(base.columns || []));
        const cells = reindexCellIdentities(change.cells || {}, {
            rows,
            columns,
        });
        Object.keys(cells).forEach(identity => {
            const changeCell = cells[identity] || {};
            const baseCell = (base.cells || {})[identity] || {};
            const content = new quill_delta_1.default(changeCell.content || []).invert(new quill_delta_1.default(baseCell.content || []));
            const attributes = quill_delta_1.default.AttributeMap.invert(changeCell.attributes, baseCell.attributes);
            const cell = compactCellData({ content, attributes });
            if (cell) {
                cells[identity] = cell;
            }
            else {
                delete cells[identity];
            }
        });
        // Cells may be removed when their row or column is removed
        // by row/column deltas. We should add them back.
        Object.keys(base.cells || {}).forEach(identity => {
            const [row, column] = parseCellIdentity(identity);
            if ((0, exports.composePosition)(new quill_delta_1.default(change.rows || []), row) === null ||
                (0, exports.composePosition)(new quill_delta_1.default(change.columns || []), column) === null) {
                cells[identity] = base.cells[identity];
            }
        });
        return compactTableData({ rows, columns, cells });
    },
};
class TableEmbed extends module_1.default {
    static register() {
        quill_delta_1.default.registerEmbed('table-embed', exports.tableHandler);
    }
}
exports.default = TableEmbed;
//# sourceMappingURL=tableEmbed.js.map