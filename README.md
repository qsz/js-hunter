# 前端异常捕获 sdk(js-hunter)

## 目录结构

```
├── examples                       // 一些示例
│   └── example.ts
├── src
│   ├── browser                   // 客户端
│   │   ├── sdk.ts
│   ├── core                      // 核心接口
│   │   ├── index.ts
│   ├── types                     // 所有类型
│   │   └── index.ts
│   ├── utils                     // 工具类
│   │   └── index.ts
│   └── README.md
├── test                          // 单元测试
│   └── index.ts
├── .babelrc
├── .eslintrc
├── rollup.config.ts
├── tsconfig.json
└── README.md
```

## 功能

### 捕获的错误类型

- Javascript 运行时发生的错误
- 资源加载出错
- Promise reject 时未被处理的错误
- xhr 请求出错
- 跨域 JS 资源中事件报错

### 收集的信息

- eventKey: 用于过滤相同的数据
- type: 上报类型
- message: 异常信息文字描述
- timestamp: 异常上报时间戳
- level: 上报级别
- pageUrl: 页面地址
- userAgent: 浏览器信息
- request: 请求数据
- response: 响应数据
- originType: 原生事件类型类型
- start_timestamp: 异常开始时间戳
- customInfo: 自定义信息

## 安装 sdk

### npm 安装

```
npm i js-hunter
```

### script 引入

```html
<script src="js-hunter.umd.js"></script>
```

## 如何使用

### API

- init: (options) => void
  初始化 sdk
  Parameters
  - server {string} 数据上报的服务地址
  - scriptCapture {boolean} 是否需要开启跨域 JS 资源中事件报错, 开启后, 将会上报第三方 js 中的详细信息; 会重写事件机制, 谨慎开启
  - allowUrls {array} 白名单:'script error'不会上报 TODO:域名过滤, 只上报域名下的 Error(该功能暂不完整)
- sendEvent: (event) => void
  手动发送信息给服务端
  Parameters
  - message {string} 信息文字描述
  - customInfo {string} 可自定义一些补充信息
- wrapFnError: (fn) => void
  包裹跨域静态 js 中的方法, 当 fn 执行报错时, 可获取详细的报错信息
  Parameters
  - fn {function}

### JS 项目

```html
<script src="js-hunter.umd.js"></script>
<script src="other.js"></script>
<script>
  jsHunter.init({
    server: 'http://__server__', // 上报的服务器地址
  });

  // 包裹跨域js中的方法, 当方法报错时, 会上报详细信息
  const wrapFn = jsHunter.wrapFnError(otherFn);
  wrapFn();
</script>
```

### React 项目

#### 项目的入口文件

```js
import * as jsHunter from '@supbd/js-hunter';

jsMonitor.init({
  server: 'http://__server__', // 上报的服务器地址
});
```

#### ErrorBoundary 错误边界

```js
import React from 'react';
import * as jsHunter from 'js-hunter';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 手动上报信息
    jsHunter.sendEvent({
      message: '上报自定义的数据',
      customInfo: '自定义的其他信息',
      timestamp: Date.now(),
      level: 'info', // error | warn | info
    });
  }

  render() {
    if (this.state.hasError) {
      // 自定义降级后的UI
      return <div>加载失败</div>;
    }

    return React.Children.toArray(this.props.children);
  }
}
```

## TODO LIST

- 插件系统
- 性能监控
- 收集用户行为
