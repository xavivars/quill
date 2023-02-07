import Quill from '../core/quill';
import Module from '../core/module';
import { Range } from '../core/selection';
interface UploaderOptions {
    mimetypes: string[];
    handler: (this: {
        quill: Quill;
    }, range: Range, files: File[]) => void;
}
declare class Uploader extends Module<UploaderOptions> {
    constructor(quill: Quill, options: Partial<UploaderOptions>);
    upload(range: Range, files: FileList | File[]): void;
}
export default Uploader;
