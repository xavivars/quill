"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const levels = ['error', 'warn', 'log', 'info'];
let level = 'warn';
function debug(method, ...args) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
        console[method](...args); // eslint-disable-line no-console
    }
}
function namespace(ns) {
    return levels.reduce((logger, method) => {
        logger[method] = debug.bind(console, method, ns);
        return logger;
    }, {});
}
namespace.level = newLevel => {
    level = newLevel;
};
debug.level = namespace.level;
exports.default = namespace;
//# sourceMappingURL=logger.js.map