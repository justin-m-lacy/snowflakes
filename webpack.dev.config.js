const path = require( 'path' );

module.exports = {

	mode:"development",
	entry:{
		snowflakes:"./src/index.js"
	},
	output:{

		path:path.resolve( __dirname, "dev"),
		publicPath:"dev/",
		filename:"[name].dev.bundle.js",
		chunkFilename:"dev/[name].bundle.js",
		library:"snowflakes"
	},
	resolve:{
		modules:[
			path.resolve( __dirname, "src"),
			"node_modules"
		],

		alias:{
			'config':'config_dev',
			'view':'ui/view',
			'data':'data'
		}
	}

};