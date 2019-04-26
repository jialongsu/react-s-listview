const config = {
  designRootValue: 37.5, //pxTrem的基值
  publicPath: '/',
  styleResources: [
    'src/styles/base/theme.scss'
  ], //引入公共样式文件
  alias: {
    styles: 'src/styles',
    components: 'src/components',
    image: 'src/image',
    pages: 'src/pages',
  }, //文件别名
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};