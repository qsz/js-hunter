/**
 * 跨域 JS 资源中事件报错
 * 如果不处理, 那么当跨域静态资源中JS出现错误，报错信息只会展示`Script error`
 * @example
 * 在跨域静态JS中
 * ```
 * window.addEventListener('click', function aa(e) {
 *  console.log(click_error);
 * });
 * ```
 */

import { EventType, EventLevel, IEvent, IClient, IBrowserOptions } from '@/types';
import { registerHandler, BaseCapture } from '@/core';
import { getCommonEventData, getEventMessage, compressString, errorNameMap, processStackMsg } from '@/utils';

export class ScriptCapture extends BaseCapture {
  public type = 'ScriptCapture';

  protected _client: IClient<IBrowserOptions>;

  public register(): void {
    const options = this._client.getOptions();
    if (!options.scriptCapture) {
      return;
    }
    registerHandler({
      type: EventType.ScriptEventError,
      callback: (data: { error: any; target: string; type: string; handlerName: string }) => {
        const { error, target, type, handlerName } = data;
        // 上报数据
        const errorName = errorNameMap[(error && error.name) || ''] || 'Error';
        const stack = processStackMsg(error);

        const eventMsg = stack
          ? `跨域js中事件执行报错 ${stack}`
          : `跨域js中事件执行报错 事件对象:${target} 事件名称:${type} 回调函数名称:${handlerName}`;

        const event: IEvent = getCommonEventData({
          eventKey: compressString('scriptEvent', `${eventMsg}`),
          type: EventType.ScriptEventError,
          message: getEventMessage(errorName, eventMsg),
          level: EventLevel.Error,
        });

        // 异常信息上报
        this._client.captureEvent(event);
      },
    });
  }
}
