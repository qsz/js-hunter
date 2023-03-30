/**
 * 获取时间戳
 * 性能优于new Date().getTime()
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 获取页面路由地址
 */
export function getLocationHref(): string {
  if (!document || !document.location) {
    return '';
  }
  return document.location.href;
}

// 请求失败的httpCode
export enum HttpErrorStatusCodes {
  Unset = 0, // 未发送
  BadRequest = 400, // 客户端响应出错
  InternalServerError = 500, // 服务端响应出错
}

/**
 * 生成eventKey
 * @param str
 * @param key
 *
 * @example
 * ```
 * const eventKey = compressString(String(e.message), String(e.colno) + String(e.lineno));
 * ```
 */
export function compressString(str: any, key: any): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZ';
  if (!str || !key) {
    return 'null';
  }
  let n = 0,
    m = 0;
  for (let i = 0; i < str.length; i++) {
    n += str[i].charCodeAt();
  }
  for (let j = 0; j < key.length; j++) {
    m += key[j].charCodeAt();
  }
  let num = n + '' + key[key.length - 1].charCodeAt() + m + str[str.length - 1].charCodeAt();
  if (num) {
    num = num + chars[num[num.length - 1]];
  }
  return num;
}

/**
 * 获取全局对象
 */
export function getGlobalObject(): any {
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  return {};
}

/**
 * 判断sdk上报是否被禁止
 * 从localStorage中获取js_hunter_ban字段, 如果存在, 则禁止上报
 */
export function getSdkBan(): any {
  const globalObject = getGlobalObject();
  if (globalObject.localStorage) {
    const ban = localStorage.getItem('js_hunter_ban');
    if (ban !== undefined && ban !== null) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 域名过滤
 * @param allowUrls
 * @param filename
 * 是否是白名单下的文件
 */
export function urlFilter(allowUrls?: string[], filename?: string): any {
  if (!allowUrls) {
    return true;
  }
  // 域名过滤
  if (!filename) {
    return false;
  }

  return allowUrls.some((url) => {
    if (filename.search(url) > -1) {
      return true;
    }
    return false;
  });
}
