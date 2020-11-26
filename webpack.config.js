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
		filename: "ata.js",
		library: "ata",
		libraryTarget: "var",
		libraryExport: "default",
	},
};

module.exports = config;
