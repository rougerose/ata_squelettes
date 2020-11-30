const path = require('path');
let config = {
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						// plugins: ["@babel/plugin-proposal-class-properties"],
					},
				},
			},
		],
	},
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: "ata.js",
		library: "ata",
		libraryTarget: "var",
		libraryExport: "ata",
	},
};

module.exports = config;
