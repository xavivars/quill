import Quill from '../core/quill';
import Theme from '../core/theme';
import Picker from '../ui/picker';
import Tooltip from '../ui/tooltip';
import { Range } from '../core/selection';
declare class BaseTheme extends Theme {
    pickers: Picker[];
    tooltip?: Tooltip;
    constructor(quill: Quill, options: any);
    addModule(name: string): unknown;
    buildButtons(buttons: HTMLElement[], icons: any): void;
    buildPickers(selects: HTMLElement[], icons: any): void;
}
declare class BaseTooltip extends Tooltip {
    textbox: HTMLInputElement | null;
    linkRange?: Range;
    constructor(quill: Quill, boundsContainer: any);
    listen(): void;
    cancel(): void;
    edit(mode?: string, preview?: any): void;
    restoreFocus(): void;
    save(): void;
}
export { BaseTooltip, BaseTheme as default };
