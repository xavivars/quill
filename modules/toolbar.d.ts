import Quill from '../core/quill';
import Module from '../core/module';
declare type Handler = () => void;
interface ToolbarProps {
    container: HTMLElement;
}
declare class Toolbar extends Module<ToolbarProps> {
    container: HTMLElement;
    controls: [string, HTMLElement][];
    handlers: Record<string, Handler>;
    constructor(quill: Quill, options: Partial<ToolbarProps>);
    addHandler(format: string, handler: Handler): void;
    attach(input: HTMLElement): void;
    update(range: any): void;
}
declare function addControls(container: HTMLElement, groups: string[][]): void;
export { Toolbar as default, addControls };
