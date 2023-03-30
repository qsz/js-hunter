/**
 * 暴露给调用者的接口
 */
import { getCurrentCarrier } from '@/core';
import { IEvent, EventType, EventLevel, IBrowserOptions } from '@/types';
import { getCommonEventData, getEventMessage, compressString, errorNameMap, processStackMsg } from '@/utils';
import { GlobalExceptionCapture, UnhandledrejectionCapture, HttpCapture, ScriptCapture } from './captures';
import { BrowserClient } from './client';

/**
 * 默认的捕获机制
 * 现支持的捕获
 *  GlobalExceptionCapture
 *    JavaScript运行时错误
 *    资源请求出错
 *  UnhandledrejectionCapture
 *    Promise reject时未被处理的错误
 *  HttpCapture
 *    XMLHttpRequest请求错误
 *  ScriptCapture
 *    跨域静态资源中事件报错
 */
const defaultCaptures = [
  new GlobalExceptionCapture(),
  new UnhandledrejectionCapture(),
  new HttpCapture(),
  new ScriptCapture(),
];

/**
 * 初始化sdk
 * @param options
 */
export function init(options: IBrowserOptions = {}): void {
  // 用户不能配置默认捕获
  options.defaultCaptures = [...defaultCaptures];
  const browserClient = new BrowserClient(options);

  const carrier = getCurrentCarrier();
  carrier.bindClient(browserClient);
}

/**
 * 用户手动发送信息给服务端
 * @param event
 */
export function sendEvent(event: IEvent): void {
  const carrier = getCurrentCarrier();
  if (carrier) {
    return carrier.callOnClient('sendEvent', event);
  }
}

/**
 * 包裹跨域静态 js 中的方法, 当 fn 执行报错时, 可获取详细的报错信息
 * @param fn
 */
export function wrapFnError(fn: any): void {
  if (!fn.__JSHUNTERWRAPPED__) {
    fn.__JSHUNTERWRAPPED__ = function (...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        const fnName = fn && fn.name ? fn.name : '<anonymous>';
        const errorName = errorNameMap[(error && error.name) || ''] || 'Error';
        const stack = processStackMsg(error);
        const eventMsg = stack ? `跨域js中运行报错 ${stack}` : `跨域js中运行报错 方法名称:${fnName}`;
        const event: IEvent = getCommonEventData({
          eventKey: compressString('script', `${eventMsg}`),
          type: EventType.ScriptEventError,
          message: getEventMessage(errorName, eventMsg),
          level: EventLevel.Error,
        });
        sendEvent(event);
      }
    };
  }

  return fn.__JSHUNTERWRAPPED__;
}
