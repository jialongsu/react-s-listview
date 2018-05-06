/**
 * Created by sujialong on 2017/6/6.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// const SpritesmithPlugin = require('webpack-spritesmith');
const commonConfig = require('./webpack.config');
const npm_config_env = process.env.npm_config_env;

module.exports = Object.assign(commonConfig.config, {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build/dev'),
        sourceMapFilename: '[file].map'
    },
    devtool: 'eval-source-map', //配置生成Source Maps，选择合适的选项
    devServer: {
        port: 8100,
        historyApiFallback: true, //配置为true, 当访问的文件不存在时, 返回根目录下的index.html文件
        compress: true, //启用gzip 压缩
        disableHostCheck: true,
        host: '0.0.0.0',
        open: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev'),
                "BUILD_TYPE": JSON.stringify('dev'),
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            title: "web-react",
        }),
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            // cache: true,
            verbose: true
        }),
        // new webpack.ProvidePlugin({
        //     $: "zepto",
        // }),
        // new SpritesmithPlugin({//生成图片雪碧图(需要使用时解开)
        //     src: {
        //         cwd: path.resolve(__dirname, './app/img/calendarSprite'), //需要合并的图片目录
        //         glob: '*.png'//合并的图片类型
        //     },
        //     target: {
        //         image: path.resolve(__dirname, './app/img/sprites/calendar-sprite.png'),//合并后的图片存放位置
        //         css: path.resolve(__dirname, './app/common/sprites/calendar-sprite.scss')//合并后产生的scss文件存放位置
        //     },
        //     apiOptions: {
        //         cssImageRef: 'img/sprites/calendar-sprite.png'//合并后sccs中引用合并后的图片路径
        //     },
        //     spritesmithOptions: {
        //         algorithm: 'top-down'//合并后图片的排列顺序
        //     }
        // })
    ]
});