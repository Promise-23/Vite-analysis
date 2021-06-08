/**
 * 总结下Vite的实现原理：

    Vite在浏览器端使用的是 export import 方式导入和导出的模块；

    vite同时实现了按需加载；

    Vite高度依赖module script特性。

    实现过程如下:

    在 koa 中间件中获取请求 body；

    通过 es-module-lexer 解析资源 ast 并拿到 import 内容；

    判断 import 的资源是否是 npm 模块；

    返回处理后的资源路径："vue" => "/@modules/vue"
    ————————————————
    版权声明：本文为CSDN博主「前端优选」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
    原文链接：https://blog.csdn.net/webyouxuan/article/details/107551758
*/
/**
 * 首先 npm install es-module-lexer koa koa-static magic-string
 *  koa、koa-static 是vite内部使用的服务框架；

    es-module-lexer 用于分析ES6import语法；

    magic-string 用来实现重写字符串内容。
 * 通过Koa服务，实现了按需读取文件，省掉了打包步骤，以此来提升项目启动速度，
 * 这中间包含了一系列的处理，诸如解析代码内容、静态文件读取、浏览器新特性实践等等
 */
const Koa = require('koa');
const { ModuleResolvePlugin } = require('./serverPluginModuleResolve');
const { moduleRewritePlugin } = require('./serverPluginModuleRewrite');
const {serveStaticPlugin} = require('./serverPluginServeStatic')
const { vuePlugin } = require('./serverPluginVue')
const { htmlRewritePlugin } = require('./utils')
const resolvePlugins = [
  htmlRewritePlugin,
  moduleRewritePlugin,
  ModuleResolvePlugin,
  vuePlugin,
  serveStaticPlugin
]
function createServer(){
  const app = new Koa();
  const root = process.cwd();
  // 构建上下文对象
  const context = { app, root }
  app.use((ctx, next) => {
    // 扩展ctx属性
    Object.assign(ctx, context);
    return next();
  })
  // const resolvePlugins = [];
  //依次注册所有组件
  resolvePlugins.forEach(plugin => plugin(context));
  return app;
}
createServer().listen(4000)