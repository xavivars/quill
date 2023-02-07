import Picker from './picker';
declare class IconPicker extends Picker {
    defaultItem: HTMLElement;
    constructor(select: HTMLSelectElement, icons: Record<string, string>);
    selectItem(target: any, trigger: any): void;
}
export default IconPicker;
