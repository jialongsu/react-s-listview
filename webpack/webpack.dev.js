const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const config = require('./config/index')(merge);

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    open: config.open,
    port: config.port,
    historyApiFallback: true,
    host: config.host,
    hot: true,
    https: config.https,
    proxy: config.proxy
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'BUILD_TYPE': JSON.stringify('development'),
      }
    }),
  ],
});