var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var APP_FILE = path.resolve(APP_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
      app: ['babel-polyfill', APP_FILE]
    },
    output: {
      publicPath: '/',
      path: BUILD_PATH,
      filename: '[name].js',
      chunkFilename: '[name].[chunkhash:5].min.js',
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /^node_modules$/,
        loader: 'babel',
        include: [APP_PATH]
      }, {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract('style', ['css'])
      }, {
        test: /\.less$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract('style', ['css', 'less'])
      }, {
        test: /\.scss$/,
        exclude: /^node_modules$/,
        loader: ExtractTextPlugin.extract('style', ['css', 'sass']),
        include: [APP_PATH]
      }, {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        loader: 'file-loader?name=[name].[ext]',
        include: [APP_PATH]
      }, {
        test: /\.(png|jpg|gif)$/,
        exclude: /^node_modules$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
        include: [APP_PATH]
      }, {
        test: /\.jsx$/,
        exclude: /^node_modules$/,
        loaders: ['jsx', 'babel'],
        include: [APP_PATH]
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('development')
          }
      }),
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/template/index.html',
          inject: 'body',
          hash: false,
      }),
      new ExtractTextPlugin('[name].css', {
        allChunks: true
      })
    ],
    resolve: {
      extensions: ['', '.js', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
    }
};
