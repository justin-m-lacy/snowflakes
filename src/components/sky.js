import { Component } from "gibbon.js";
import CanvasDraw from "gibbon.js/utils/canvasDraw";
import * as PIXI from 'pixi.js';
import { Gradient } from "gibbon.js/data/gradient";
import { lerpColor, htmlStr } from "gibbon.js/utils/colorUtils";


const TEX_WIDTH = 16;
/**
 * @const {number} TEX_HEIGHT - sky texture size.
 */
const TEX_HEIGHT = 400;

/**
 * @const {object.<number,number[]>} skyColors - colors at different
 * snow counts.
 */
var SkyColors = [

	{ at:0, colors:[0x1308d2,0x4040da, 0xff6200 ], stops:[0.2,0.75,1] },
	{ at:250, colors:[0x17109a,0x2020a6,0xba0e0e ], stops:[0.2,0.75,1]  },
	{ at:700, colors:[0x000044,0x110088,0x771181 ], stops:[0.2,0.75,1] },
	{ at:1500, colors:[0x000044,0x110088,0x771181 ], stops:[0.2,0.75,1] },
	{ at:5000, colors:[0x020024,0x131378,0x4c00ff ], stops:[0.2,0.75,1] },

]

export default class Sky extends Component {

	get time() { return this._time; }
	set time(v) { this._time = v;}

	setSky(ind) {

		let info = SkyColors[ind];
		// slice in case future reset.
		this.skyGradient.colors = info.colors.slice(0);
		this.skyGradient.stops = info.stops;

		this.index = ind;
		if ( ind === SkyColors.length-1 ) {
			this.game.emitter.removeListener( 'snow-count', this.onCount, this );
		}

		this.redrawSky();

	}

	init(){

		this.view = this.game.screen;
		this.draw = new CanvasDraw( TEX_WIDTH, TEX_HEIGHT );

		let s = PIXI.Sprite.from( this.draw.canvas);
		s.width = this.view.width;
		s.height = this.view.height;
		this.sky = s;

		this.skyGradient = new Gradient();
		this.setSky(0);

		// count when sky last updated.
		this.lastCount = 0;

		this.clip.addChild(s);

		console.log('INIT SKY');
		this.game.emitter.on('snow-count', this.onCount, this );

		//this.clip.texture = this.texture;

	}

	redrawSky(){
		this.draw.gradFill( new PIXI.Point(0,0), new PIXI.Point( 0, TEX_HEIGHT ), this.skyGradient );
		this.sky.texture.update();
	}

	onCount( count ) {

		if ( count - this.lastCount < 4 ) return;
		this.lastCount = count;

		var nxt = SkyColors[this.index+1];
		if ( count >= nxt.at ) {
			this.setSky( this.index+1);
			return;
		}

		var prev = SkyColors[this.index];

		var curColors = this.skyGradient.colors;
		var prevColors = prev.colors;
		var nextColors = nxt.colors;

		let pct = ( count - prev.at ) / (nxt.at - prev.at);
		if ( pct < 0 || pct >1 ) console.log('INVALID PCT: ' + pct + ' prev.at: ' + prev.at + '  nxt.at: ' + nxt.at + ' count: '+ count );

		for( let i = curColors.length-1; i>=0; i-- ) {
			curColors[i] = lerpColor( prevColors[i], nextColors[i], pct );
			//console.log( htmlStr( curColors[i]) );
		}

		this.redrawSky();

	}

}