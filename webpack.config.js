const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
	entry: APP_DIR + '/index.js',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.min.js'
	},
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			},
			{
				test : /\.scss?/,
				include : APP_DIR,
				use : ExtractTextPlugin.extract([
					{loader : "css-loader"},
					{loader : "sass-loader"}
				])
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
	    	loader:'url-loader',
				query: {
					limit: 1024,
					name: 'images/[name].[ext]'
				}
			},
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: false,
          collapseWhitespace: false
        }
      }
		],
	},
	plugins: [
		new ExtractTextPlugin('bundle.min.css'),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Portfolio',
      minify: false,
      template: PUBLIC_DIR+'/index.html',
			favicon: PUBLIC_DIR+'/favicon.ico'
    })
	]
};

module.exports = config;
