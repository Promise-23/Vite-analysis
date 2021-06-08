# Vite-analysis
手写简易Vite源代码，Vite原理分析

总结下Vite的实现原理：

Vite在浏览器端使用的是 export import 方式导入和导出的模块；

vite同时实现了按需加载；

Vite高度依赖module script特性。

实现过程如下:

在 koa 中间件中获取请求 body；

通过 es-module-lexer 解析资源 ast 并拿到 import 内容；

判断 import 的资源是否是 npm 模块；

返回处理后的资源路径："vue" => "/@modules/vue"
