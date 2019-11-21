import { Point } from "pixi.js";

/**
 * Container for holding flake/clip/velocity information.
 */
export default class Flake {

	/**
	 * @property {DisplayObject} clip
	 */
	get clip(){return this._clip;}
	set clip(v){this._clip = v}

	get color(){return this._color;}
	set color(v){this._color=v;}

	get velocity(){return this._vel;}
	set velocity(v){this._vel = v;}

	get position(){ return this.clip.position}

	constructor( clip ){

		this.clip = clip;
		this.velocity = new Point();

	}


}