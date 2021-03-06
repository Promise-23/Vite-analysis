/**
 * 对js文件中的import语法进行路径的重写
 * 改写后的路径会再次向服务器发送拦截请求
 */
const {readBody} = require('./utils');
const {parse} = require('es-module-lexer');
const MagicString = require('magic-string');

function rewriteImports(source){
  let imports = parse(source)[0];
  const magicString = new MagicString(source);
  if(imports.length) {
    for(let i = 0; i < imports.length; i++ ){
      const {s, e} = imports[i];
      let id = source.substring(s, e);
      if(/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`;
        // 修改路径增加 /@modules 前缀
        magicString.overwrite(s, e, id);
      }
    }
  }
  return magicString.toString();
}

function moduleRewritePlugin({ app, root}) {
  app.use(async (ctx, next) => {
    await next();
    // 对类型是js的文件进行拦截
    if(ctx.body && ctx.response.is('js')){
      // 读取文件中的内容
      const content = await readBody(ctx.body);
      // 重写import中无法识别的路径
      const r = rewriteImports(content);
      ctx.body = r;
    }
  })
}
exports.moduleRewritePlugin = moduleRewritePlugin 