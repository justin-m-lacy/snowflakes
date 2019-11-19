const path = require( 'path' );

module.exports = {

	mode:"production",
	entry:{
		snowflakes:"./src/index.js"
	},
	output:{

		path:path.resolve( __dirname, "dist"),
		publicPath:"dist/",
		filename:"[name].dist.bundle.js",
		chunkFilename:"dist/[name].bundle.js",
		library:"snowflakes"
	},
	resolve:{
		modules:[
			path.resolve( __dirname, "src"),
			"node_modules"
		],

		alias:{
			'config':'config',
			"view":'ui/view',
			"data":"data"
		}
	}

};