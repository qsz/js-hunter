/**
 * 用于事件订阅与派发
 * 中转站
 *  定义内置的异常监听机制
 *  客户端通过订阅事件, 接收异常发生时的信息
 *
 * 错误类型
 *  全局的异常收集
 *    window.onerror(addEvenetListener error)
 *      JavaScript运行时错误
 *      资源请求出错
 *    window.onunhandledrejection
 *  接口请求报错
 *    xhr
 *    TODO fetch
 *  跨域静态资源中事件报错
 */
import { logger, bind, getGlobalObject } from '@/utils';
import { EventType } from '@/types';

export type EventHandlerType = keyof typeof EventType;

export type EventHandlerCallback = (data: any) => void;
export interface IEventHandler {
  type: EventHandlerType;
  callback: EventHandlerCallback;
}

const globalObject = getGlobalObject();

const eventHandlers: { [key in EventHandlerType]?: EventHandlerCallback[] } = {};

/**
 * 注册事件处理器
 * @param handler
 */
export function registerHandler(handler: IEventHandler): void {
  if (!handler || typeof handler.type !== 'string' || typeof handler.callback !== 'function') {
    return;
  }
  eventHandlers[handler.type] = eventHandlers[handler.type] || [];
  eventHandlers[handler.type].push(handler.callback);
  subscribeHandler(handler.type);
}

/**
 * 已订阅的事件
 */
const subscribed: { [key in EventHandlerType]?: boolean } = {};
/**
 * 订阅事件, 触发事件处理器
 * @param type
 */
export function subscribeHandler(type: EventHandlerType): void {
  if (subscribed[type]) {
    return;
  }
  subscribed[type] = true;

  switch (type) {
    case EventType.Error:
      emitError();
      break;
    case EventType.PromiseError:
      emitPromiseError();
      break;
    case EventType.XhrError:
      emitXhrError();
      break;
    case EventType.FetchError:
      emitFetchError();
      break;
    case EventType.ScriptEventError:
      emitScriptEventError();
      break;
    default:
      logger.warn('未识别的事件类型', type);
  }
}

/**
 * 派发事件
 * @param type
 * @param data
 */
function emitHandler(type: EventHandlerType, data: any): void {
  if (!type || !eventHandlers[type]) {
    return;
  }
  eventHandlers[type].forEach((handler) => {
    try {
      handler(data);
    } catch (e) {
      logger.error(`派发${type}事件时出错\nError:`, e);
    }
  });
}

/**
 * TODO 是否需要移除事件处理器
 */

/**
 * window.addEventListener error
 * 1.监听JavaScript运行时未被处理的错误
 * 2.监听静态资源请求报错
 */
function emitError(): void {
  bind(
    globalObject,
    'error',
    (event: ErrorEvent) => {
      const { target, srcElement, message, filename, lineno, colno, error, type } = event;
      const sourceTarget = target || srcElement;
      emitHandler(EventType.Error, {
        sourceTarget,
        message,
        filename,
        lineno,
        colno,
        error,
        originType: type,
      });
    },
    // 先触发事件捕获, 再触发用户自定义绑定的事件
    true,
  );
}

/**
 * unhandledrejection
 * 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
 */
function emitPromiseError(): void {
  bind(
    globalObject,
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      const { reason, type } = event;

      emitHandler(EventType.PromiseError, {
        reason,
        originType: type,
      });
    },
    // 先触发事件捕获, 再触发用户自定义绑定的事件
    true,
  );
}

/**
 * xhr请求出错
 */
function emitXhrError(): void {
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  function openReplacement(...args) {
    const method = args[0];
    const url = args[1];
    // 传递请求相关数据
    this._requestInfo = {
      method, // 请求方法
      url, // 请求地址
    };
    return open.apply(this, args);
  }

  function sendReplacement(...args) {
    // 请求停止之后被触发 (例如，在已经触发“error”，“abort”或“load”事件之后)
    // TODO 还是选择readystatechange?
    bind(this, 'loadend', () => {
      const requestBody = args[0]; // 请求数据
      const { response, status, _requestInfo } = this;

      emitHandler(EventType.XhrError, {
        method: _requestInfo ? _requestInfo.method : '', // 请求方法
        url: _requestInfo ? _requestInfo.url : '', // 请求地址
        requestBody, // 请求体
        response: typeof response === 'object' ? JSON.stringify(response) : response, // 响应体,
        status, // 响应状态
      });

      this._requestInfo = {};
    });
    return send.apply(this, args);
  }

  XMLHttpRequest.prototype.open = openReplacement;
  XMLHttpRequest.prototype.send = sendReplacement;
}

/**
 * TODO
 * fetch请求出错
 */
function emitFetchError(): void {
  // TODO 重写fetch
}

/**
 * 跨域静态资源中事件报错
 * 重写事件监听
 * 侵入性较强
 */
function emitScriptEventError(): void {
  const originAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener: any, options) {
    const wrappedListener = function (...args) {
      try {
        return listener.apply(this, args);
      } catch (error) {
        emitHandler(EventType.ScriptEventError, {
          error,
          target: EventTarget, // 事件对象
          type, // 事件名称
          handlerName: listener && listener.name ? listener.name : '<anonymous>', // 方法名
        });
      }
    };
    return originAddEventListener.call(this, type, wrappedListener, options);
  };
}
