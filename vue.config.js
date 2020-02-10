module.exports = {
  // 样式配置
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // 这个config参数就是当前  vue-cli项目的所有的webpack的配置信息
    // 想要改动  直接改这个信息的就可以
    // 判断下当前 的环境 是否是  生产环境
    if (process.env.NODE_ENV === 'production') {
      // webpack 会在生产模式下运行
      // 把所有的console 都删除  然后打包
      // 这里的删除 不是删除源代码  的console 而是删除打包出来的console
      // drop_console  这个意思是删除所有的 sonsole true => 表示删除所有的console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './' // 默认是 /  改成./
}
