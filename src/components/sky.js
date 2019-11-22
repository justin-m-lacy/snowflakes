import { Component } from "gibbon.js";
import CanvasDraw from "gibbon.js/utils/canvasDraw";
import * as PIXI from 'pixi.js';
import { Gradient } from "gibbon.js/data/gradient";

/**
 * @const {number} TEX_SIZE - sky texture size.
 */
const TEX_SIZE = 200;

/**
 * @const {object.<number,number[]>} skyColors - colors at different
 * snow counts.
 */
const skyColors = [

	{ at:0, colors:[0x1308d2,0x4040da, 0xff6200 ], stops:[0,0.55,1] },
	{ at:300, colors:[0x17109a,0x2020a6,0xba0e0e ], stops:[0,0.55,1]  },
	{ at:750, colors:[0x000044,0x110088,0x771181 ], stops:[0.2,0.8,1] },
	{ at:2000, colors:[0x000044,0x110088,0x771181 ], stops:[0.2,0.8,1] },
	{ at:5000, colors:[0x020024,0x131378,0x4c00ff ], stops:[0,0.45,1] },

]

export default class Sky extends Component {

	get time() { return this._time; }
	set time(v) { this._time = v;}

	setSky(ind) {

		let info = this.skyColors[ind];
		// slice in case future reset.
		this.skyGradient.colors = info.colors.slice(0);
		this.skyGradient.stops = info.stops;

		this.index = ind;

	}

	init(){

		this.view = this.game.screen;

		this.skyGradient = new Gradient();
		this.setSky(0);

		// count when sky last updated.
		this.lastCount = 0;


		//PIXI.RenderTexture.create( TEX_SIZE, TEX_SIZE );
		this.draw = new CanvasDraw( TEX_SIZE, TEX_SIZE );
		this.draw.gradFill( new PIXI.Point(0,0), new PIXI.Point( 0, TEX_SIZE ), this.skyGradient );

		let s = PIXI.Sprite.from( this.draw.canvas);
		s.width = this.view.width;
		s.height = this.view.height;

		this.clip.addChild(s);


		//this.clip.texture = this.texture;

	}

	onCount( count ) {

		if ( count - this.lastCount < 25 ) return;

		const prev = this.info[this.index];
		const nxt = this.info[this.index+1];

		const curColors = this.skyGradient.colors;
		const nextColors = nxt.colors;

		for( let i = curColors.length-1; i>=0; i-- ) {
		}


		this.lastCount = 25;

	}

}