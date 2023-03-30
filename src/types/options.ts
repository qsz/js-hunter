/**
 * 配置类型
 */
import { ICapture } from './capture';

// 基础配置信息
export interface IOptions {
  server?: string; // 后端服务地址
  allowUrls?: string[]; // 白名单:'script error'不会上报 TODO:域名过滤, 只上报域名下的Error(该功能暂不完整)
  defaultCaptures?: ICapture[]; // 内置的捕获机制

  // TODO
  extensionCaptures?: ICapture[]; // 用户自定义的扩展捕获机制
  debug?: boolean; // 是否开启debug模式
}

// 客户端配置信息
export interface IBrowserOptions extends IOptions {
  scriptCapture?: boolean; // 是否需要开启跨域 JS 资源中事件报错
}
