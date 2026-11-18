import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

expect.extend(toHaveNoViolations);

window.HTMLElement.prototype.scrollIntoView = jest.fn();