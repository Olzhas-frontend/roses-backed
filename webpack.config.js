module.exports = {
	mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
	devtool: 'source-map',
	output: {
		filename: 'main.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};
