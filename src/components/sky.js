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
const skyColors = {

	0:new Gradient( [0x1308d2,0x4040da, 0xff6200 ], [0,0.55,1] ),
	100:new Gradient( [0x17109a,0x2020a6,0xba0e0e ], [0,0.55,1]  ),
	500:new Gradient( [0x000044,0x110088,0x771181 ], [0.2,0.8,1] ),
	1000:new Gradient( [0x000044,0x110088,0x771181 ], [0.2,0.8,1] ),
	5000:new Gradient( [0x020024,0x131378,0x4c00ff ], [0,0.45,1] ),

}

export default class Sky extends Component {

	get time() { return this._time; }
	set time(v) { this._time = v;}

	init(){

		this.skyGradient = skyColors[0];

		this.view = this.game.screen;

		//PIXI.RenderTexture.create( TEX_SIZE, TEX_SIZE );
		this.draw = new CanvasDraw( TEX_SIZE, TEX_SIZE );
		this.draw.gradFill( new PIXI.Point(0,0), new PIXI.Point( 0, TEX_SIZE ), this.skyGradient );

		let s = PIXI.Sprite.from( this.draw.canvas);
		s.width = this.view.width;
		s.height = this.view.height;

		this.clip.addChild(s);


		//this.clip.texture = this.texture;

	}

}