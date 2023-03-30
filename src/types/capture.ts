/**
 * 捕获类型
 */
import { IClient } from './client';
import { IOptions } from './options';

export interface ICapture {
  type?: string;

  /**
   * 建立捕获机制
   * 只建立一次
   */
  setupOnce(client: IClient<IOptions>): void;
}
