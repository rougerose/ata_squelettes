let config = {
	module: {
		rules: [
			{
				test: /\.js$/,
				// exclude: /node_modules/,
				loader: "babel-loader",
			},
		],
	},
	output: {
		filename: "ata.js",
	},
	externals: {
		jquery: "jQuery",
	},
};

module.exports = config;
