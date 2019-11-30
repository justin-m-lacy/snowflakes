import * as PIXI from 'pixi.js';
import SnowGame from './snowGame';

if ( window.hasOwnProperty('kongregateAPI') ) {

	kongregateAPI.loadAPI( function(){

		window.kong = kongregateAPI.getAPI();
		// You can now access the Kongregate API with:
		// kongregate.services.getUsername()

	});
}

/*window.addEventListener( 'load', ()=>{

	console.log('DOC LOAD: ' + document.body.clientWidth + ', ' + document.body.clientHeight );

	document.body.addEventListener( 'load', ()=>{
		console.log('BODY LOAD: ' + document.body.clientWidth + ', ' + document.body.clientHeight )});

});*/

const app = new PIXI.Application({

	width:window.innerWidth,
	height:window.innerHeight,
	transparent:false,
	sharedLoader:true,
	antialias:true,
	resizeTo:window,
	backgroundColor:0x000055
});

WebFont.load({
	google: {
		families: ['Snowburst One']
	},
	active:e=>{

		document.body.appendChild( app.view );
		let g = new SnowGame( app );

		g.init();

	}

});