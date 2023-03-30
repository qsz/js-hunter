/**
 * 客户端类型
 */
import { IOptions } from './options';
import { TransportClass, ITransport, TransportOptions } from './transport';
import { IEvent } from './event';

export interface IClient<O extends IOptions> {
  /**
   * 将捕获到的信息,发送给服务端
   * @param event
   */
  captureEvent(event: IEvent): void;

  /**
   * 用户手动发送信息给服务端
   * @param event
   */
  sendEvent(event: IEvent): void;

  /**
   * 绑定数据传输对象
   * @param transport
   */
  setupTransport(transport: TransportClass<ITransport>, transportOptions: TransportOptions): void;

  /**
   * 客户端绑定捕获机制
   */
  setupCaptures(): void;

  /**
   * 获取配置项
   */
  getOptions(): O;

  /**
   * 获取数据传输对象实例
   */
  getTransport(): ITransport;
}

export type IClientClass = IClient<IOptions>;
