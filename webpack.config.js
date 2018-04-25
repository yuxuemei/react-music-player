var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry:[
       'react-hot-loader/patch',
       'webpack/hot/only-dev-server',
       //'webpack-dev-server/click?http://localhost:3000',
       path.resolve(__dirname,'./app/index.js')
    ],
    output:{
    	path:path.resolve(__dirname,'./dist'),
    	filename:'[name].js',
      publicPath:'/'
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './index.tpl.html',
          inject: 'body',
          filename: './index.html'
        }),
        //new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module:{
    	rules:[{
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader",
              query:
                {
                  presets:['react','es2015']
                }
            },
            {
                test: /\.json?$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            },{
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
              }
            }]
    }
}