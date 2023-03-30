/**
 * 上报数据给服务端
 */
import { IEvent } from '@/types';
import { BaseTransport } from '@/core';
import { getSdkBan } from '@/utils';

export class Transport extends BaseTransport {
  public send(event: IEvent): void {
    if (getSdkBan()) {
      // sdk上报被禁止
      return;
    }
    super.send(event);
  }
}
