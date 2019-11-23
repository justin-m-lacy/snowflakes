import * as PIXI from 'pixi.js';
import SnowGame from './snowGame';

/*window.addEventListener( 'load', ()=>{

	console.log('DOC LOAD: ' + document.body.clientWidth + ', ' + document.body.clientHeight );

	document.body.addEventListener( 'load', ()=>{
		console.log('BODY LOAD: ' + document.body.clientWidth + ', ' + document.body.clientHeight )});

});*/

const app = new PIXI.Application({

	width:window.innerWidth,
	height:window.innerHeight,
	autoResize:true,
	transparent:false,
	antialias:true,
	backgroundColor:0x000055
});

WebFont.load({
	google: {
		families: ['Snowburst One','Mountains+of+Christmas', 'Delius+Swash+Caps']
	},
	active:e=>{

		document.body.appendChild( app.view );
		let g = new SnowGame( app );

		g.init();
		g.start();

	}

});