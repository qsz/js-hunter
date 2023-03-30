import { ICapture, IClient, IOptions } from '@/types';

export abstract class BaseCapture implements ICapture {
  public type = 'BaseCapture';

  protected _client: IClient<IOptions>;

  /**
   * 是否已经注册事件处理器
   */
  private _registered: boolean;

  constructor() {
    this._registered = false;
  }

  public setupOnce(client: IClient<IOptions>): void {
    this._client = client;
    this._register();
  }

  /**
   * 注册事件处理器
   */
  private _register(): void {
    if (this._registered) {
      return;
    }
    this.register();
    this._registered = true;
  }

  /**
   * 注册的事件
   */
  protected register(): void {
    //
  }
}
