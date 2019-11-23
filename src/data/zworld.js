import { Component } from "gibbon.js";

/**
 * Information about 3d bounds and camera.
 */
export default class ZWorld extends Component {

	get zmin(){return this._zmin;}
	set zmin(v){this._zmin = v;}

	get zmax(){return this._zmax;}
	set zmax(v){this._zmax = v;}

	get focus(){return this._f; }
	set focus(v){this._f = v;}

	constructor( zmin, zmax, focus ){

		super();

		this.zmin = zmin;
		this.zmax = zmax;
		this.focus = focus;

	}

	/**
 	* Projection factor at distance z.
 	* @param {number} z
 	*/
	projAt(z){ return this._f/( z + this._f ) };

}