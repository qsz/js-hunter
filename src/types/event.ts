/**
 * 上报的数据格式
 */
import { IBreadcrumb } from '@/types';

export interface IEvent {
  eventKey?: string; // 用于过滤相同的数据 建议上传
  type?: EventType; // 上报类型 建议上传
  message?: string; // 异常信息文字描述 建议上传
  timestamp?: number; // 异常上报时间戳 建议上传
  level?: EventLevel; // 上报级别 建议上传
  pageUrl?: string; // 页面地址
  userAgent?: string; // 浏览器信息
  request?: {
    // 请求数据
    method?: string;
    url?: string;
    body?: any;
  };
  response?: {
    // 响应数据
    message?: string;
    status?: number;
  };
  originType?: string; // 原生事件类型类型 Event.type
  start_timestamp?: number; // 异常开始时间戳
  customInfo?: string; // 用户自定义的信息

  // TODO List
  breadcrumbs?: IBreadcrumb[]; // 用户行为
  SDKversion?: string; // sdk版本
  env?: 'production' | 'development'; // 执行环境
  system?: string; // 系统信息
  user?: string; // 用户信息
}

// 上报类型
export enum EventType {
  Error = 'Error', // 运行时错误 JavascriptError + LoadError
  JavascriptError = 'JavascriptError', // JavaScript运行时错误
  LoadError = 'LoadError', // 资源请求出错
  PromiseError = 'PromiseError', // Promise reject时未被处理的错误(unhandledrejection)
  XhrError = 'XhrError', // xhr请求异常
  UserError = 'UserError', // 用户自定义上传的错误类型
  ScriptEventError = 'ScriptEventError', // 跨域静态资源中事件报错
  ScriptError = 'ScriptError', // 跨域静态资源中js执行报错
  FetchError = 'FetchError', // TODO fetch请求异常
  ReactError = 'ReactError', // TODO react错误边界
  IframeError = 'IframeError', //  TODO iframe错误
}

// 上报级别
export enum EventLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
}
