import Picker from './picker';
declare class ColorPicker extends Picker {
    constructor(select: any, label: any);
    buildItem(option: any): HTMLSpanElement;
    selectItem(item: any, trigger: any): void;
}
export default ColorPicker;
