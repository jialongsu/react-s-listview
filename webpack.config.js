// var BUILD_DIR = path.resolve(__dirname, 'build');
// var APP_DIR = path.resolve(__dirname, 'app');
const glob = require('glob');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV;

let scssLoader;
const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: true,
            modules: true,
            // localIdentName: '[name]-[local]-[hash:base64:5]'
            localIdentName: '[local]-[hash:base64:5]'
        }
    };

if(NODE_ENV === 'production'){
    scssLoader =
        ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                cssLoader,
                'sass-loader',
                'postcss-loader'
            ]
        });
}else {
    scssLoader = [
        'style-loader',
        cssLoader,
        'sass-loader',
        'postcss-loader'
    ];
}

var config = {
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        }
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.scss/,
                use: scssLoader
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    cssLoader,
                    'postcss-loader'
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|TTF|ttf|woff|woff2|svg|svgz|otf)(\?.+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024*2,
                            // limit: 1,
                            name: 'images/[name].[ext]',
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        alias: {
            'img': path.resolve(__dirname, 'app/img'),
            'common': path.resolve(__dirname, 'app/common'),
            'components': path.resolve(__dirname, 'app/components'),
        },
        extensions: ['.js', '.jsx']
    },
};


module.exports = {
    "config": config
};