/**
 * 数据传输对象类型
 */
import { IEvent } from './event';
export interface ITransport {
  /**
   * 向服务端传递数据
   */
  send(event: IEvent): void;
}

export interface TransportOptions {
  server?: string; // 服务地址
}

export type TransportClass<T extends ITransport> = new (options: TransportOptions) => T;
