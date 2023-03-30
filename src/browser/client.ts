/**
 * 浏览器客户端
 */
import { IBrowserOptions, IEvent, EventLevel, EventType } from '@/types';
import { BaseClient } from '@/core';
import { compressString, getLocationHref, getTimestamp } from '@/utils';
import { Transport } from './transport';

export class BrowserClient extends BaseClient<IBrowserOptions> {
  constructor(options: IBrowserOptions) {
    super(options);
    this.setupTransport(Transport, {
      server: options.server,
    });
  }

  public captureEvent(event: IEvent): void {
    // TODO 可执行一些提交前的功能: 比如记录用户行为

    super.captureEvent(event);
  }

  public sendEvent(event: IEvent): void {
    // 补充一些信息
    if (!event.eventKey) {
      event.eventKey = compressString(event.message || '', event.customInfo || '');
    }
    if (!event.type) {
      event.type = EventType.UserError;
    }
    if (!event.timestamp) {
      event.timestamp = getTimestamp();
    }
    if (!event.level) {
      event.level = EventLevel.Info;
    }
    if (!event.userAgent) {
      event.userAgent = navigator.userAgent;
    }
    if (!event.pageUrl) {
      event.pageUrl = getLocationHref();
    }
    if (event.message && event.message.length > 1000) {
      // message长度限制
      event.message = event.message.slice(0, 1000);
    }
    super.captureEvent(event);
  }
}
