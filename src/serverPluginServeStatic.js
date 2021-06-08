/**
 * 目的是让当前目录下的文件和public目录下的文件
 * 都可以被访问
 */
const path = require('path');
function serveStaticPlugin({app, root}){
  // 以当前根目录作为静态目录
  app.use(require('koa-static')(root));
  // 以public目录作为根目录
  app.use(require('koa-static')(path.join(root, 'public')))
}

exports.serveStaticPlugin = serveStaticPlugin;