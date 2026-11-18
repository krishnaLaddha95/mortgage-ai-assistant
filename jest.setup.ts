import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

window.HTMLElement.prototype.scrollIntoView = jest.fn();