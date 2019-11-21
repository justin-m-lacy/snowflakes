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

		this.texture = PIXI.RenderTexture.create( TEX_SIZE, TEX_SIZE );
		this.canvas = new CanvasDraw( TEX_SIZE, TEX_SIZE );
		this.canvas.fill( '444444');

	}

}