import { ClassAttributor, StyleAttributor } from 'parchment';
declare const FontClass: ClassAttributor;
declare class FontStyleAttributor extends StyleAttributor {
    value(node: any): string;
}
declare const FontStyle: FontStyleAttributor;
export { FontStyle, FontClass };
