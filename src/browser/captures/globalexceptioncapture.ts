/**
 * 全局异常捕获
 * JavaScript运行时错误
 * 资源请求出错
 */
import { IEvent, EventType, EventLevel } from '@/types';
import { registerHandler, BaseCapture } from '@/core';
import { getCommonEventData, getEventMessage, compressString, errorNameMap, urlFilter } from '@/utils';

export class GlobalExceptionCapture extends BaseCapture {
  public type = 'GlobalExceptionCapture';

  protected register(): void {
    registerHandler({
      type: EventType.Error,
      callback: (data: {
        sourceTarget?: any;
        message: string;
        filename: string;
        lineno: number;
        colno: number;
        error: any;
        originType: string;
      }) => {
        const { sourceTarget, message, filename, lineno, colno, error, originType } = data;

        // 是否是静态资源请求
        const isSourceTarget =
          sourceTarget instanceof HTMLScriptElement ||
          sourceTarget instanceof HTMLLinkElement ||
          sourceTarget instanceof HTMLImageElement;

        // 上报数据
        let event: IEvent = {};

        if (isSourceTarget) {
          // 整理资源请求错误
          const sourceUrl = sourceTarget.src || sourceTarget.href;
          event = getCommonEventData({
            eventKey: compressString('资源地址', sourceUrl),
            type: EventType.LoadError,
            message: getEventMessage('资源请求失败', `资源地址: ${sourceUrl}`),
            level: EventLevel.Warn,
          });
        } else {
          const options = this._client.getOptions();
          if (!urlFilter(options.allowUrls, filename)) {
            // 域名过滤
            return;
          }

          const errorName = errorNameMap[(error && error.name) || ''] || 'Error';
          // TODO 是否需要用 stack 替换 message + filename + lineno + colno
          //  优点: 包含详细的堆栈信息
          //  缺点: 过长, 是否有必要展示这么多信息?
          // const stack = processStackMsg(error);
          const stack = null;
          const eventMsg = stack || `文件${filename} ${lineno}行 ${colno}列 ${message}`;
          event = getCommonEventData({
            eventKey: compressString(message, `${String(filename)}${String(lineno)}${String(colno)}`),
            type: EventType.JavascriptError,
            message: getEventMessage(errorName, eventMsg),
            level: EventLevel.Error,
          });
        }

        event.originType = originType;
        // 异常信息上报
        this._client.captureEvent(event);
      },
    });
  }
}
