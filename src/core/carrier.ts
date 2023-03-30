/**
 * sdk容器载体
 * 全局对象
 */
import { IClientClass, ICarrier } from '@/types';
import { getGlobalObject } from '@/utils';
import { CARRIER_VERSION } from './common';

/**
 * 注册并获取sdk容器载体
 * @param IClient
 */
export function getCurrentCarrier(): ICarrier {
  const globalObject = getGlobalObject();
  globalObject.__JSHUNTER__ = globalObject.__JSHUNTER__ || {
    carrier: undefined,
  };
  if (!globalObject.__JSHUNTER__.carrier || globalObject.__JSHUNTER__.carrier.version < CARRIER_VERSION) {
    // 不存在carrier 或者 carrier版本太低
    globalObject.__JSHUNTER__.carrier = new Carrier();
  }

  return globalObject.__JSHUNTER__.carrier;
}

export class Carrier implements ICarrier {
  private readonly _version = CARRIER_VERSION;

  private _client: IClientClass;

  public bindClient(client: IClientClass): void {
    this._client = client;
    client.setupCaptures();
  }

  public getClient(): IClientClass {
    return this._client;
  }

  public callOnClient(method: string, ...rest: any[]): void {
    const client = this.getClient();
    if (client && client[method]) {
      client[method](...rest);
    }
  }
}
