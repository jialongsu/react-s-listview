// const glob = require('glob');
const path = require('path');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');
// const config = require('./config/index')(merge);
const buildType = process.env.npm_config_build; //编辑正式环境or测试环境

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    // usedExports: true,
    sideEffects: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          minSize: 0,
          priority: -20,
          chunks: 'initial',
          // reuseExistingChunk: true
        },
        // styles: {
        //   name: 'styles',
        //   test: /\.(css|scss|less)$/,
        //   chunks: 'all',
        //   enforce: true
        // }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        // sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
        canPrint: true
      })
    ]
  },
  plugins: [
    new ProgressBarPlugin(), // 为编译添加进度条
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './dist/dll/vendor.dll.js',
        to: path.resolve(__dirname, '../dist/treasureCenter')
      },
    ]),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dist/dll/vendor-manifest.json'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      // chunkFilename: '[id].[hash].css',
    }),
    new CompressionPlugin({//将指定文件类型打成压缩包
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'BUILD_TYPE': JSON.stringify(buildType),
      }
    }),
    new BundleAnalyzerPlugin({  // 生成编译结果分析报告
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    }),

  ],
});