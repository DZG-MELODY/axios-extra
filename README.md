# axios-extra

extra supports for axios

<details>
  <summary>文档目录(展开查看)</summary>

- [megvii-http](#megvii-http)

  - [快速开始](#%e5%bf%ab%e9%80%9f%e5%bc%80%e5%a7%8b)
    - [安装组件](#%e5%ae%89%e8%a3%85%e7%bb%84%e4%bb%b6)
    - [按命名空间引用](#%e6%8c%89%e5%91%bd%e5%90%8d%e7%a9%ba%e9%97%b4%e5%bc%95%e7%94%a8)
    - [按需引用](#%e6%8c%89%e9%9c%80%e5%bc%95%e7%94%a8)
  - [API 说明](#api%e8%af%b4%e6%98%8e)
    - [httpGet(url [,params [,options]]) 发送 get 请求](#httpgeturl-params-options-%e5%8f%91%e9%80%81get%e8%af%b7%e6%b1%82)
    - [httpPost(url [,params [,options]]) 发送 post 请求](#httpposturl-params-options-%e5%8f%91%e9%80%81post%e8%af%b7%e6%b1%82)
    - [httpDelete(url [,params [,options]]) 发送 delete 请求](#httpdeleteurl-params-options-%e5%8f%91%e9%80%81delete%e8%af%b7%e6%b1%82)
    - [httpPut(url [,params [,options]]) 发送 put 请求](#httpputurl-params-options-%e5%8f%91%e9%80%81put%e8%af%b7%e6%b1%82)
    - [httpPatch(url [,params [,options]]) 发送 patch 请求](#httppatchurl-params-options-%e5%8f%91%e9%80%81patch%e8%af%b7%e6%b1%82)
    - [set(options) 设置全局配置](#setoptions-%e8%ae%be%e7%bd%ae%e5%85%a8%e5%b1%80%e9%85%8d%e7%bd%ae)
    - [reset() 重置全局配置](#reset-%e9%87%8d%e7%bd%ae%e5%85%a8%e5%b1%80%e9%85%8d%e7%bd%ae)
    - [HttpOptions 请求配置](#httpoptions-%e8%af%b7%e6%b1%82%e9%85%8d%e7%bd%ae)
    - [HttpResponse 与 AxiosResponse 请求响应](#httpresponse-%e4%b8%8e-axiosresponse-%e8%af%b7%e6%b1%82%e5%93%8d%e5%ba%94)
  - [配置详情](#%e9%85%8d%e7%bd%ae%e8%af%a6%e6%83%85)
    - [transformParams 参数转换器](#transformparams-%e5%8f%82%e6%95%b0%e8%bd%ac%e6%8d%a2%e5%99%a8)
      - [使用内置的参数转换器](#%e4%bd%bf%e7%94%a8%e5%86%85%e7%bd%ae%e7%9a%84%e5%8f%82%e6%95%b0%e8%bd%ac%e6%8d%a2%e5%99%a8)
      - [自定义过滤器](#%e8%87%aa%e5%ae%9a%e4%b9%89%e8%bf%87%e6%bb%a4%e5%99%a8)
      - [在请求方法中覆盖全局转换器](#%e5%9c%a8%e8%af%b7%e6%b1%82%e6%96%b9%e6%b3%95%e4%b8%ad%e8%a6%86%e7%9b%96%e5%85%a8%e5%b1%80%e8%bd%ac%e6%8d%a2%e5%99%a8)
    - [interceptors 拦截器](#interceptors-%e6%8b%a6%e6%88%aa%e5%99%a8)
      - [内置拦截器](#%e5%86%85%e7%bd%ae%e6%8b%a6%e6%88%aa%e5%99%a8)
    - [hooks 全局钩子](#hooks-%e5%85%a8%e5%b1%80%e9%92%a9%e5%ad%90)
      - [内置钩子](#%e5%86%85%e7%bd%ae%e9%92%a9%e5%ad%90)
      - [自定义钩子](#%e8%87%aa%e5%ae%9a%e4%b9%89%e9%92%a9%e5%ad%90)
    - [signature 自定义签名](#signature%e8%87%aa%e5%ae%9a%e4%b9%89%e7%ad%be%e5%90%8d)
    - [取消请求](#%e5%8f%96%e6%b6%88%e8%af%b7%e6%b1%82)
  - [issue](#issue)

</details>

---

基于 axios 扩展的前端 http 请求库,具有以下特点：

> 1.兼容 axios 所有原始配置，并扩展了更多灵活选项
>
> 2.统一所有 api 的调用参数，提供更友好的调用体验
>
> 3.提供开箱即用的实用配置，快速支持业务开发

megvii-http 提供了完善的单元测试，保证代码的质量

![img](./assets/coverage.png)

---

## 快速开始

确保可访问私服源：

```bash
--registry=http://10.199.1.20:8081/repository/npmmegvii/
or
--registry=http://10.199.1.17:7001/
```

### 安装组件

```bash
npm install megvii-http --save
```

### 按命名空间引用

```js
import megHttp from "megvii-http";

// 设置全局配置
megHttp.set({
  // config
});

megHttp.httpGet("http://example");
```

### 按需引用

```js
import { set as setConfig, httpGet } from "megvii-http";

// 设置全局配置
setConfig({
  // config
});

httpGet("http://example");
```

---

## API 说明

### httpGet(url [,params [,options]]) 发送 get 请求

[params] **url**: `string` 请求地址  
[params] **params**: `object` 请求参数(get 请求时为 query 参数)  
[params] **options**: `HttpOptions` 请求配置(见下)  
[return] `Promise<HttpResponse>`

### httpPost(url [,params [,options]]) 发送 post 请求

[params] **url**: `string` 请求地址  
[params] **params**: `object` 请求参数(post 请求时为 body 参数)  
[params] **options**: `HttpOptions` 请求配置(见下)  
[return] `Promise<HttpResponse>`

### httpDelete(url [,params [,options]]) 发送 delete 请求

[params] **url**: `string` 请求地址  
[params] **params**: `object` 请求参数(delete 请求时为 body 参数)  
[params] **options**: `HttpOptions` 请求配置(见下)  
[return] `Promise<HttpResponse>`

### httpPut(url [,params [,options]]) 发送 put 请求

[params] **url**: `string` 请求地址  
[params] **params**: `object` 请求参数(put 请求时为 body 参数)  
[params] **options**: `HttpOptions` 请求配置(见下)  
[return] `Promise<HttpResponse>`

### httpPatch(url [,params [,options]]) 发送 patch 请求

[params] **url**: `string` 请求地址  
[params] **params**: `object` 请求参数(patch 请求时为 body 参数)  
[params] **options**: `HttpOptions` 请求配置(见下)  
[return] `Promise<HttpResponse>`

### set(options) 设置全局配置

[params] **options**: `HttpOptions` 全局请求配置(见下)  
[return] `void`

### reset() 重置全局配置

[return] `void`

### HttpOptions 请求配置

HttpOptions 在经过处理后，最后传入到 axios 实例中的配置都将转换为`AxiosOptions`

因此请求配置默认支持全部 axios 的配置[AxiosOptions](https://github.com/axios/axios#request-config)

此外还扩展了以下属性：

```js
{
  // 自定义标签,可以透传到response过程中,可以为任何类型
  // 只在请求方法中配置有效
  signature:{},
  // 是否返回原始response,如果设置为true则会将AxiosResponse作为返回结果
  // 只在请求方法中配置有效
  isOriginResponse:false,
  // params参数转换器
  // params为统一参数，在get请求中将生成query参数，
  // 在其他请求中将作为request body。
  // 这不同于axios中的 transformRequest
  // 在方法中配置时，只能设置为数组
  transformParams:{
    // 所有http请求均做转换
    'common':[ trans1, trans2 ...],
    // 只对get请求做转换
    'get':[ trans...],
    // 只对post请求做转换
    'post':[ trans...],
    // 只对delete请求做转换
    'delete':[ trans...],
    // 只对put请求做转换
    'put':[ trans...],
    // 只对patch请求做转换
    'patch':[ trans...]
  },

  // 拦截器配置
  // axios中拦截器的设置是需要通过实例注册，
  // 在megvii-http中并不能直接获取到实例，
  // 而是在配置中设置，库自动完成注册过程
  interceptors:{
    // 请求阶段的拦截器
    request:[ interceptor1, ...],
    // 响应阶段的拦截器
    response:[ interceptor2, ...],
    // 是否合并全局拦截器，只在请求方法中生效
    // 如果设置为false，则使用方法配置中拦截器覆盖全局拦截器
    merge: true
  }

  // 全局钩子方法
  // 一些业务需要在请求的不同阶段或者不同条件下触发，
  // megvii-http提供了一些全局钩子用于处理这类情况
  // 钩子方法支持自定义
  // 钩子方法只能在全局设置，方法调用时配置不生效
  hooks:{
    // 请求阶段的钩子方法
    request:{
      hook1,
      ...
    },
    // 响应阶段的钩子方法
    response:{
      hook2,
      ...
    }
  },

  // 是否支持取消请求
  // 只在请求方法中配置有效，且只对该次请求有效
  canCancel:true
}
```

### HttpResponse 与 AxiosResponse 请求响应

axios 实例请求返回的结果（`AxiosResponse`）按照官方文档如下：

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},

  // `config` is the config that was provided to `axios` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}
```

megvii-http 的响应结果（`HttpResponse`）是在`AxiosResponse`的基础上进行过滤和处理后返回的，其只返回最终的数据。
**如果想要返回原始的响应结果，可以在发送时配置参数`isOriginResponse`为 true**

```js
{
  code: 0,
  data: {}
}
```

---

## 配置详情

### transformParams 参数转换器

参数转换器用于在向 axios 实例设置参数前，将请求参数做前置处理。
参数转换器是一个方法，megvii-http 在转换时会将传入数组中的所有转换器生成一个处理器。

**注意：参数转化器在方法中使用时不提供 merge 功能，一旦配置则会覆盖掉全局的配置**。

**注意：过滤器只对简单对象类型（`plainObject`）的参数进行过滤，如果直接赋值值类型或者数组类型，则过滤器不生效**

```js
// 一个转换器的定义
function transform(url, params) {
  // 处理url 和 params
  // 返回处理结果，注意一定要有返回值，且返回值是一个tuple
  return [url, params];
}
```

#### 使用内置的参数转换器

megvii-http 内置了多个可直接使用的参数转换器：

| 转换器                    | 功能                                    | 说明                                                                 |
| ------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| paramsClone               | 为传入参数生成一份拷贝                  | 使用 Object.assign,并非深拷贝                                        |
| addRandom                 | 为传入参数增加一个随机数字段 r          | 如果传入 params 含有 r 字段，则不添加                                |
| filters.filterEmptyArray  | 过滤器：过滤参数中所有空数组字段        |
| filters.filterEmptyString | 过滤器：过滤参数中所有空字符串字段      |
| filters.filterFalsy       | 过滤器：过滤参数中所有 Falsy 类型的字段 | 参考[Falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) |
| filters.filterEmptyAny    | 过滤器：过滤任何空值                    | 空值指：`null`，`undefined`，空字符串，空数组                        |

**【注意】**：

1. 所有内置参数转换器都在`transformParams`命名空间下
2. 过滤器因为使用递归遍历参数，因此不建议同时使用多个

下面是一个使用内置转换器的示例：

```js
import { set as setConfig, transformParams } from "megvii-http";

// 设置全局的参数转换器
setConfig({
  transformParams: {
    common: [
      transformParams.paramsClone,
      transformParams.filters.filterEmptyAny
    ],
    get: [transformParams.addRandom]
  }
});
```

#### 自定义过滤器

过滤器由于使用递归遍历，为了提高性能，应该在一个遍历过程中完成所有过滤操作，因此**不建议同时使用多个过滤器，如果内置过滤器不能满足条件，可以自定义过滤器**

megvii-http 提供了`createFilter`方法用于生成过滤器:

**createFilter( validators )**  
[params] **validators**: `Array<string|function>` 验证器队列  
[return] 过滤器

validators 传入字符串时，使用内置好的验证器：

| 验证器         | 功能                  | 备注                              |
| -------------- | --------------------- | --------------------------------- |
| 'null'         | 是否为 null           |
| 'undefined'    | 是否为 undefined      |
| 'NaN'          | 是否为 NaN            |
| 'infinite'     | 是否为无限大          | 是`number`类型                    |
| 'emptyString'  | 是否为空字符串        | 字符串的 length 为 0              |
| 'emptyContent' | 是否为空内容的字符串  | 字符串的 length 不为 0 譬如 `’ ‘` |
| 'emptyArray'   | 是否为空数组          |
| 'falsy'        | 是否为 Falsy 类型的值 | 注意包含 0                        |

validators 也可以传入自定义的验证方法，注意返回必须为一个 bool 值，譬如：

```js
// 验证一个值是否等于100
const customValidate1 = value => value === 100;
// 验证一个值是否为长度大于10的字符串
const customValidate2 = value => typeof value === "string" && value.length > 10;
```

下面是一个使用自定义过滤器的例子：

```js
import { set as setConfig, transformParams } from "megvii-http";
const { filters } = transformParams;

// 自定义验证器
const customValidate = value => value === 100;
// 创建一个自定义过滤器
const customFilter = filters.createFilters([
  "null",
  "emptyContent",
  customValidate
]);

// 设置全局的参数转换器
setConfig({
  transformParams: {
    common: [transformParams.paramsClone, customFilter]
  }
});
```

#### 在请求方法中覆盖全局转换器

在请求方法中可以设置自己的参数转换器用以覆盖全局，如果不想启用全局转化器，可以赋值为`false`  
**注意:** 在方法中设置转换器时，一定要设置为数组,因为它只是针对本方法的

```js
// 不使用全局转换器
megHttp.httpPost(
  "https://test/",
  { test: 1 },
  {
    transformParams: false
  }
);

// 使用自己的转换器覆盖全局
megHttp.httpPost(
  "https://test/",
  { test: 1 },
  {
    transformParams: [customTransform]
  }
);
```

---

### interceptors 拦截器

axios 的配置项中并没有对拦截器的设置，需要通过实例注册使用。[（使用参考）](https://github.com/axios/axios#interceptors)

megvii-http 中实现了对拦截器的配置，只要在 config 中添加 interceptors 选项，即可自动完成拦截器注册。

一个拦截器需要配置两个属性：resolve 和 reject 分别来对处理结果进行处置，如果设置为一个方法，则默认作为 resolve。**注意区分 request 阶段和 response 阶段的拦截器参数是不同的**。

示例如下：

```js
// 一个完整的请求拦截器
const interceptor1 = {
  resolve(config){
    // 此处的config为AxiosOptions
    ...
    return config;
  },
  reject(error){
    ...
    return Promise.reject(error)
  }
}

// 一个方法类型的请求拦截器
const interceptor2 = (config)=>{
  ...
  return config;
}

// 一个完整的响应拦截器
const interceptor3 = {
  resolve(response){
    // 此处的response为AxiosResponse
    ...
    return response;
  },
  reject(error){
    ...
    return Promise.reject(error)
  }
}

// 一个方法类型的响应拦截器
const interceptor2 = (response)=>{
  ...
  return response;
}

```

一个使用拦截器的示例：

```js
 import {set as setConfig, transformParams} from 'megvii-http';

 // 设置全局的参数转换器
 setConfig({
  interceptors:{
    request:[
      {
        resolve(config){},
        reject(error){}
      },
      interceptor(config){}
    ],
    response:[
      {
        resolve(response){},
        reject(error){}
      },
      interceptor(response){}
    ]
  }
 })
```

#### 内置拦截器

megvii-http 提供了几个内置拦截器，如下：

| 拦截器         | 功能                              | 阶段    | 备注                                     |
| -------------- | --------------------------------- | ------- | ---------------------------------------- |
| setClientAppId | 在请求头中增加 Client-App-Id 字段 | request | 目前是从`window.config.globalConfig`获取 |
| setToken       | 在请求头中增加 Authorization 字段 | request | 目前是从 localstorage 中 token 字段获取  |

使用内置拦截器示例：

```js
import { set as setConfig, interceptors } from "megvii-http";

// 设置全局的参数转换器
setConfig({
  interceptors: {
    // 目前提供的内置拦截器都在请求阶段
    request: [interceptors.setToken, interceptors.setClientAppId]
  }
});
```

---

### hooks 全局钩子

megvii-http 提供了一些全局钩子，用于在请求各阶段处理一些业务逻辑。

钩子方法只支持全局配置，因此一旦设置将会全局生效。

#### 内置钩子

megvii-http 在 request 阶段和 response 阶段提供了一些内置钩子，如下：

| 拦截器           | 功能                                  | 阶段     | 备注                      |
| ---------------- | ------------------------------------- | -------- | ------------------------- |
| beforeSend       | 请求配置在设置到 axios 实例发送前触发 | request  | 传入参数为`HttpConfig`    |
| requestCancel    | 请求在被取消时触发                    | response | 传入参数为`error`         |
| interfaceNoExist | 请求接口不存在时触发                  | response | 传入参数为`AxiosResponse` |
| tokenExpire      | token 过期时触发                      | response | 传入参数为`AxiosResponse` |

示例如下：

```js
import {set as setConfig, interceptors} from 'megvii-http';

// 设置全局的参数转换器
setConfig({
  hooks:{
    request:{
      beforeSend(config){
        ...
      }
    },
    response:{
      requestCancel(err){
        console.log(err.message);
      }
    }
  }
})
```

#### 自定义钩子

megvii-http 除了内置钩子外，还可以自定义钩子方法。

自定义钩子需要提供两个参数：trigger 和 callback 分别对应触发器和回调方法。如果设置为方法则默认设置为必定触发，设置方法则为默认回调。

示例如下：

```js
// 一个完整的请求钩子
const customHook1 = {
  trigger(config){
    // 此处的config为HttpOptions
    ...
    // 返回一个bool值
    return boolean;
  },
  callback(config){
    // 此处的config为HttpOptions
  }
}

// 一个方法类型的请求钩子
const customHook2 = (config)=>{
    // 此处的config为HttpOptions
}

// 一个完整的响应钩子
const customHook3 = {
  trigger(response){
    // 此处的response为AxiosResponse
    ...
    return boolean;
  },
  callback(response){
    // 此处的response为AxiosResponse
  }
}

// 一个方法类型的响应拦截器
const customHook4 = (response)=>{
    // 此处的response为AxiosResponse
}
```

---

### signature 自定义签名

axios 在配置时会过滤掉无关参数，因此在`response`过程中其`config`字段并不等于发送请求时传入的配置参数。

我们在使用时，会存在一种场景，对于某个请求我们希望在发送前设置一个特定的签名，当签名不同时，对于 response 的处理将会不一致。

megvii-http 提供了`signature`参数用于处理这种场景。发送请求时，设置的标签，会在 response 的 hooks 中获取到（如果使用了 originResponse,则可以直接在返回结果中获取）。

```js
// 响应响应钩子
setConfig({
  hooks: {
    response: {
      responseHook(response) {
        //处理自定义签名
        console.log(response.signature.isCustom);
      }
    }
  }
});

await megHttp.httpPost(
  "https://test/",
  { test: 1 },
  {
    // 设置自定义签名
    signature: {
      isCustom: true
    }
  }
);

// 直接获取原始response进行处理
const ret = await megHttp.httpPost(
  "https://test/",
  { test: 1 },
  {
    signature: {
      isCustom: true
    },
    // 获取原始响应值
    isOriginResponse: true
  }
);
// 处理结果中的签名
console.log(ret.signature.isCustom);
```

---

### 取消请求

megvii-http 对于请求取消做了良好的封装，使用时直接在配置中设置`canCancel:true`即支持取消功能。其触发器直接挂载在请求实例上。

取消请求后，如果在全局注册了回调，则会触发回调。也可以在`Promise.then`的 reject 中监听。

```js
import { httpGet } from "megvii-http";

const requestPromise = httpGet(
  "http://test",
  { test: true },
  { canCancel: true }
);

requestPromise.then(
  response => {
    // 正常处理请求
  },
  err => {
    // 通过判断err中是否有isCancel字段来判断是否取消触发
    if (err.isCancel) {
      // 处理取消逻辑
    } else {
      // 处理其他异常
    }
  }
);

// 触发取消请求，可以传入一个message
requestPromise.cancel("this is message");
```

## issue

使用中存在任何问题或者建议请提[issue](https://git-pd.megvii-inc.com/ai-guardians/sst-fe/base-library-group/megvii-http/issues)
