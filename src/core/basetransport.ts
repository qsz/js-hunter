/**
 * 上报数据给服务端
 * TODO 请求池
 */
import { PoolRequest, getGlobalObject } from '@/utils';
import { ITransport, TransportOptions, IEvent } from '@/types';

export abstract class BaseTransport implements ITransport {
  /**
   * 请求池
   */
  private _pool: PoolRequest;

  /**
   * 配置信息
   */
  private _options: TransportOptions;

  constructor(options: TransportOptions) {
    // 初始化配置
    this._options = options;
    this._pool = new PoolRequest();
  }

  public send(event: IEvent): void {
    // this._sendImage(event);
    this._sendRequest(event);
  }

  /**
   * 向服务端GET一个1 X 1的gif, 用于上报数据
   * new Image() 不会触发error事件
   */
  private _sendImage(event: IEvent): void {
    let img = new Image();
    const server = this._options ? this._options.server : '';
    img.src = `${server}/request.gif?event=${encodeURIComponent(JSON.stringify(event))}`;
    img = null;
  }

  /**
   * TODO 以xhr形式上报数据
   * 跨域的处理
   */
  private _sendRequest(event: IEvent): void {
    const globalObject = getGlobalObject();
    if (globalObject.XMLHttpRequest) {
      const xhr = new XMLHttpRequest();
      const server = this._options ? this._options.server : '';

      // ----------GET----------
      // const dataString = encodeURIComponent(JSON.stringify(event))
      // xhr.open('GET', `${server}/request?event=${dataString}`);
      // xhr.send();

      // ----------POST json----------
      // 复杂跨域请求(带预检的跨域请求)
      // 会发送两次请求:第一次204(预检请求，查询是否支持跨域), 第二次200
      // xhr.open('POST', `${server}/request`);
      // xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      // xhr.send(JSON.stringify(event));

      // ----------POST x-www-form-urlencoded----------
      // 简单跨域请求(不会触发CORS预检)
      xhr.open('POST', `${server}/request`);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      let body = '';
      Object.keys(event).forEach(function (key) {
        let value = event[key];
        if (typeof value === 'function') {
          return;
        }
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        body += `${key}=${value}&`;
      });
      xhr.send(body);
    }
  }
}
