declare const levels: string[];
declare function debug(method: string, ...args: unknown[]): void;
declare namespace debug {
    var level: (newLevel: any) => void;
}
declare function namespace(ns: string): Record<typeof levels[number], typeof debug>;
declare namespace namespace {
    var level: (newLevel: any) => void;
}
export default namespace;
