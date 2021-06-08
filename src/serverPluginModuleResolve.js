const fs = require('fs').promises;
const path = require('path');
const {resolve} = require('path');
const moduleRe = /^\/@modules\//;
const {resolveVue} = require('./utils');

function ModuleResolvePlugin({app, root}){
  const vueResolved = resolveVue(root)
  app.use(async (ctx, next) => {
    // 对 /@modules 开头的路径进行映射
    if(!moduleRe.test(ctx.path)){
      return next()
    }
    // 去除/@modules开头
    const id = ctx.path.replace(moduleRe, '')
    ctx.type = 'js'
    const content = await fs.readFile(vueResolved[id], 'utf8');
    ctx.body = content
  })
}
exports.ModuleResolvePlugin = ModuleResolvePlugin