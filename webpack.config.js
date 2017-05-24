const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	entry: {
    app: APP_DIR + '/index.js',
  },
	output: {
		path: BUILD_DIR,
    filename: '[name].[chunkHash].js',
    chunkFilename: '[name].[chunkHash].js',
	},
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			},
			{
        test: /\.json$/,
        use: 'json-loader'
      },
			{
				test : /\.scss?/,
				include : APP_DIR,
				use : ExtractTextPlugin.extract([
					{
						loader : "css-loader",
						options: {
							removeComments: true,
							minimize: true,
						}
					},
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
				'NODE_ENV': JSON.stringify('production'),
				'PUBLIC_URL': JSON.stringify('')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor"],
      minChunks: function (module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
		new webpack.optimize.CommonsChunkPlugin({
      name: ["manifest"],
    }),
    new HtmlWebpackPlugin({
      title: 'Portfolio',
      minify: false,
      template: PUBLIC_DIR+'/index.html',
			favicon: PUBLIC_DIR+'/favicon.ico',
			extraFiles: 'manifest.json'
    }),
		new SWPrecacheWebpackPlugin(
      {
        cacheId: 'social-app',
        filename: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        runtimeCaching: [{
          handler: 'cacheFirst',
          urlPattern: /[.]jpe?g$/,
        }],
      }
    ),
		new CleanWebpackPlugin([BUILD_DIR], {
      root: '/home/figgynewts/Projects/social-app',
    })
	]
};

module.exports = config;
