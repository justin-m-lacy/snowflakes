import { Component } from "gibbon.js";
import CanvasDraw from "gibbon.js/utils/canvasDraw";
import * as PIXI from 'pixi.js';

/**
 * @const {number} TEX_SIZE - sky texture size.
 */
const TEX_SIZE = 200;

export default class Sky extends Component {

	get time() { return this._time; }
	set time(v) { this._time = v;}

	init(){

		this.view = this.game.screen;

		//PIXI.RenderTexture.create( TEX_SIZE, TEX_SIZE );
		this.draw = new CanvasDraw( TEX_SIZE, TEX_SIZE );
		this.draw.fill( 0x444444 );

		let s = PIXI.Sprite.from( this.draw.canvas);
		s.width = this.view.width;
		s.height = this.view.height;

		this.clip.addChild(s);

		//this.clip.texture = this.texture;

	}

}