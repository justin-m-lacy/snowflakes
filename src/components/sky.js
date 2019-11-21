import { Component } from "gibbon.js";
import CanvasDraw from "gibbon.js/utils/canvasDraw";
import * as PIXI from 'pixi.js';
import { Gradient } from "gibbon.js/data/gradient";

/**
 * @const {number} TEX_SIZE - sky texture size.
 */
const TEX_SIZE = 200;

export default class Sky extends Component {

	get time() { return this._time; }
	set time(v) { this._time = v;}

	init(){

		this.skyGradient = new Gradient( [0x000077,0x1100cc,0xaa1181 ], [0,0.5,1] );

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