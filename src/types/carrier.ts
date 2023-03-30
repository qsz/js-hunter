/**
 * 容器载体类型
 */

import { IClientClass } from './client';

export interface ICarrier {
  /**
   * 绑定Client
   * @param IClient
   */
  bindClient(client: IClientClass): void;

  /**
   * 获取绑定的Client
   */
  getClient(): IClientClass;

  /**
   * 调用Client的方法
   * @param method
   * @param rest
   */
  callOnClient(method: string, ...rest: any[]): void;
}
