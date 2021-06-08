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