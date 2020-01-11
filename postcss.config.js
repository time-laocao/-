module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 因为我们做的是手机 手机已苹果6为主要适配器 375 的十分之一
      propList: ['*']
    }
  }
}
