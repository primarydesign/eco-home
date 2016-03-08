var webpack = require('webpack');
var path = require('path');

module.exports = {
	devtool: 'source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		}),
		new webpack.ProvidePlugin({
			jQuery: 'jquery'
	    })
	],
	resolve: {
		root: [path.join(__dirname, 'node_modules')],
	},
	output: {
		filename: '[name].js',
		sourceMapFilename: '[name].map'
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.json$/, exclude: /node_modules/, loader: "json-loader" }
		]
	}
}