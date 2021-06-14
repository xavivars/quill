import { ClassAttributor, Scope } from '@reedsy/parchment';
import { ColorAttributor } from './color';

const BackgroundClass = new ClassAttributor('background', 'ql-bg', {
  scope: Scope.INLINE,
});
const BackgroundStyle = new ColorAttributor('background', 'background-color', {
  scope: Scope.INLINE,
});

export { BackgroundClass, BackgroundStyle };
