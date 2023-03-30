/**
 * Promise reject时未被处理的错误
 * @example
 * ```
 * Promise.reject('Hello, Js Hunter!');
 * ```
 */
import { IEvent, EventType, EventLevel } from '@/types';
import { registerHandler, BaseCapture } from '@/core';
import { getCommonEventData, getEventMessage, compressString } from '@/utils';

export class UnhandledrejectionCapture extends BaseCapture {
  public type = 'UnhandledrejectionCapture';

  public register(): void {
    registerHandler({
      type: EventType.PromiseError,
      callback: (data: { reason: string; originType: string }) => {
        const { reason, originType } = data;
        // 上报数据
        const event: IEvent = getCommonEventData({
          eventKey: compressString('unhandledrejection', reason),
          type: EventType.PromiseError,
          message: getEventMessage('未处理的unhandledrejection事件', reason),
          level: EventLevel.Error,
        });
        event.originType = originType;

        // 异常信息上报
        this._client.captureEvent(event);
      },
    });
  }
}
