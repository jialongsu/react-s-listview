const path = require('path');
// const webpack = require('webpack');
// const glob = require('glob');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config/index')(merge);
const utils = require('./utils/utiles');
const devMode = process.env.NODE_ENV !== 'production';
const styleResources = utils.groupUrlAry(config.styleResources);
const alias = utils.groupUrlObj(config.alias);
const postcssPxtorem = config.designRootValue && require('postcss-pxtorem')({
  rootValue: config.designRootValue,
  propWhiteList: [],
  minPixelValue: 1,
});

module.exports = {
  entry: {
    'app': './src/index.js',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist/react-s-listview'),
    publicPath: config.publicPath
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules|plib/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          },
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     presets: [
          //       '@babel/preset-react',
          //       '@babel/preset-env',
          //     ],
          //     plugins: [
          //       'react-hot-loader/babel', // 热更新插件
          //       '@babel/plugin-syntax-dynamic-import',
          //       ['@babel/plugin-proposal-decorators', { 'legacy': true }],
          //       ['@babel/plugin-transform-runtime', {'regenerator': true}],
          //       ['@babel/plugin-proposal-class-properties', { 'loose': true }],
          //       // ['import', {
          //       //   'libraryName': 'antd',
          //       //   'libraryDirectory': 'es',
          //       //   'style': 'css' // `style: true` 会加载 less 文件
          //       // }]
          //     ],
          //     cacheDirectory: true,
          //   }
          // },
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(sa|sc|le)ss$/,
        loaders: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]-[hash:base64:5]'
            },
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                postcssPxtorem
              ]
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: styleResources
            },
          },
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|TTF|ttf|woff|woff2|svg|svgz|otf)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024*2,
              name: 'images/[name]_[hash:base64:5].[ext]',
            }
          }
        ]
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'index.html',
      filename: 'index.html',
      inject: true,
      hash: true,
      title: 'web-react',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true
      }
    })
  ],
};

