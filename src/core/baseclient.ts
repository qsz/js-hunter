/**
 * 客户端基础功能
 */
import { IClient, ICapture, IOptions, TransportClass, ITransport, TransportOptions, IEvent } from '@/types';

export abstract class BaseClient<O extends IOptions> implements IClient<O> {
  /**
   * 配置信息
   */
  private readonly _options: O;

  private _transport: ITransport;

  constructor(options: O) {
    // 初始化配置
    this._options = options;
  }

  public captureEvent(event: IEvent): void {
    const transport = this._transport;
    transport.send(event);
  }

  public sendEvent(event: IEvent): void {
    const transport = this._transport;
    transport.send(event);
  }

  public setupTransport(transport: TransportClass<ITransport>, transportOptions: TransportOptions): void {
    this._transport = new transport(transportOptions);
  }

  public setupCaptures(): void {
    const defaultCaptures = this._options.defaultCaptures || [];
    const extensionCaptures = []; // TODO 当前只支持内置的异常捕获捕获
    const captures: ICapture[] = [...defaultCaptures, ...extensionCaptures];

    captures.forEach((capture) => {
      capture.setupOnce(this);
    });
  }

  public getOptions(): O {
    return this._options;
  }

  public getTransport(): ITransport {
    return this._transport;
  }
}
