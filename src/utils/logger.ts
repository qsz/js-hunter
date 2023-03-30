/**
 * 用于全局的打印
 */
import { getGlobalObject } from './common';

const PREFIX = 'js-hunter Logger';

const globalObject = getGlobalObject();

const _console = globalObject.console || {};

export const logger = {
  log(...args: any[]): void {
    _console.log(`${PREFIX}【Log】:`, ...args);
  },
  warn(...args: any[]): void {
    _console.warn(`${PREFIX}【Log】:`, ...args);
  },
  error(...args: any[]): void {
    _console.error(`${PREFIX}【Log】:`, ...args);
  },
};
