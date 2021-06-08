const { Readable } = require('stream')
const path = require('path')

/**
 * 读取文件内容
 * @param {*} stream 
 * @returns 
 */
async function readBody(stream) {
  if (stream instanceof Readable) {
    return new Promise((resolve, reject) => {
      let res = '';
      stream
        .on('data', (chunk) => {res += chunk})
        .on('end', () => {resolve(res)})
    })
  }else{
    return stream.toString()
  }
}

/**
 * 将/@modules开头的路径解析成对应的真实文件，并返回给浏览器
 * 编译的模块使用commonjs规范，其他文件均使用es6
 * @param {} root 
 */
function resolveVue(root){
  const compilerPkgPath = path.resolve(root, 'node_modules', '@vue/compiler-sfc/package.json');
  const compilerPkg = require(compilerPkgPath);
  // 编译模块的路径  node中编译
  const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main);
  const resolvePath = (name) => {
    path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`);
    // dom运行
    const runtimeDomPath = resolvePath('runtime-dom')
    // 核心运行
    const runtimeCorePath = resolvePath('runtime-core')
    // 响应式模块
    const reactivityPath = resolvePath('reactivity')
    // 共享模块
    const sharedPath = resolvePath('shared')

    return {
      vue: runtimeDomPath,
      '@vue/runtime-dom':  runtimeDomPath,
      '@vue/runtime-core': runtimeCorePath,
      '@vue/reactivity': reactivityPath,
      '@vue/shared': sharedPath,
      compiler: compilerPath
    }
  }
}

/**
 * 处理process的问题
 * 浏览器中并没有process变量，所以我们需要在html中注入process变量
 * 在html的head标签中注入脚本
 * @param {*} param0 
 */
function htmlRewritePlugin({app, root}){
  const devInjection = `
  <script>
    window.process = {env: {NODE_ENV: 'development'}}
  </script>
  `

  app.use(async(ctx, next) => {
    await next();
    if(ctx.response.is('html')){
      const html = await readBody(ctx.body);
      ctx.body = html.replace(/<head>/, `$&$${devInjection}`)
    }
  })
}

exports.readBody = readBody
exports.resolveVue = resolveVue
exports.htmlRewritePlugin = htmlRewritePlugin 