/**
 * 事件方法
 */
import { IEvent, EventLevel, EventType } from '@/types';
import { getTimestamp, getLocationHref } from './common';

/**
 * 原生addEventListener
 * @param target
 * @param eventType
 * @param listener
 * @param useCapture
 */
export function bind(target: EventTarget, eventType: string, listener: EventListener, useCapture?: boolean): void {
  if (target.addEventListener) {
    target.addEventListener(eventType, listener, useCapture);
  }
}

/**
 * 生成上报信息
 * @param title
 * @param content
 */
export function getEventMessage(title: string, content?: string): string {
  return `【${title}】\n${content}`;
}

/**
 * 生成基础的上报数据
 * 一些建议上传的数据
 */
export function getCommonEventData(data: {
  eventKey: string;
  type: EventType;
  message: string;
  level?: EventLevel;
}): IEvent {
  const { eventKey, type, message, level } = data;
  return {
    eventKey,
    type,
    message,
    timestamp: getTimestamp(),
    level: level || EventLevel.Info,
    pageUrl: getLocationHref(),
    userAgent: navigator.userAgent,
  };
}

// error.name
//  SyntaxError 语法错误
//  TypeError 类型错误
//  ReferenceError 引用错误(对象代表当一个不存在的变量被引用时发生的错误)
//  RangeError 当一个值不在其所允许的范围或者集合中
//  URIError 使用全局URI处理函数而产生的错误
//  Error 除了上述外的错误
export const errorNameMap = {
  SyntaxError: '语法错误',
  TypeError: '类型错误',
  ReferenceError: '引用错误',
  RangeError: '不在所允许的范围中',
  URIError: 'URI处理错误',
};

/**
 * 格式化Error中stack的信息
 * @param error
 */
export function processStackMsg(error: Error): string {
  if (error && error.stack) {
    let stack = error.stack
      .replace(/\n/gi, '') // 去掉换行，节省传输内容大小
      .replace(/\bat\b/gi, '@') // chrome中是at，ff中是@
      .split('@') // 以@分割信息
      .slice(0, 10) // 最大堆栈长度（Error.stackTraceLimit = 10），所以只取前10条
      .map((v) => v.replace(/^\s*|\s*$/g, '')) //去除多余空格
      .join('~') // 手动添加分隔符，便于后期展示
      .replace(/\?[^:]+/gi, ''); // 去除js文件链接的多余参数(?x=1之类)
    const msg = error.toString();
    if (stack.indexOf(msg) < 0) {
      stack = `${msg}~${stack}`;
    }
    return `STACK:${stack}`;
  }
  return '';
}
