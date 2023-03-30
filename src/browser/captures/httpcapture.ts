/**
 * XMLHttpRequest/接口请求报错
 * @example
 * ```
 * Promise.reject('Hello, Js Hunter!');
 * ```
 */
import { EventType, EventLevel } from '@/types';
import { registerHandler, BaseCapture } from '@/core';
import { getCommonEventData, HttpErrorStatusCodes, getEventMessage, logger, compressString } from '@/utils';

export class HttpCapture extends BaseCapture {
  public type = 'HttpCapture';

  protected register(): void {
    registerHandler({
      type: EventType.XhrError,
      callback: (data: { method: string; url: string; requestBody: any; response: string; status: number }) => {
        const { method, url, requestBody, response, status } = data;
        if (
          status === HttpErrorStatusCodes.Unset ||
          (status >= HttpErrorStatusCodes.BadRequest && status < HttpErrorStatusCodes.InternalServerError) ||
          status >= HttpErrorStatusCodes.InternalServerError
        ) {
          const options = this._client.getOptions();
          const { server } = options;
          if (url && url.search(server) > -1) {
            // 数据上报服务出错,则不上报,防止死循环
            logger.warn(`服务地址【${server}】出错, 数据上报失败`);
            return;
          }

          const requestData = {
            method,
            url,
            body: requestBody,
          };
          // 上报数据
          const event = getCommonEventData({
            eventKey: compressString(url, JSON.stringify(requestData)),
            type: EventType.XhrError,
            message: getEventMessage('xhr请求出错', `请求的接口: ${url}`),
            level: EventLevel.Error,
          });
          event.request = requestData;
          event.response = {
            message: response,
            status,
          };

          // 异常信息上报
          this._client.captureEvent(event);
        }
      },
    });
  }
}
