var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var APP_FILE = path.resolve(APP_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');


module.exports = {
    entry: {
      app: ['babel-polyfill', APP_FILE],
      common: [
        'react',
        'react-dom',
        'react-router',
        'redux',
        'react-redux',
        'redux-thunk',
        'immutable',
        'isomorphic-fetch',
        'moment',
        'lodash',
        'js-cookie'
      ]
    },
    output: {
      publicPath: '/',
      path: BUILD_PATH,
      filename: '[name].[chunkhash:5].js',
      chunkFilename: '[name].[chunkhash:5].min.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            include: /node_modules/,
            loader: ExtractTextPlugin.extract('style', ['css'])
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'less'])
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'sass'])
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx', 'babel']
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/template/index.html',
            inject: 'body',
            hash: true,
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin("common", "common.bundle.[chunkhash:5].js"),
        new webpack.optimize.UglifyJsPlugin({
            output: {
              comments: false
            },
            compress: {
              warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.scss', '.css']
    }
};
