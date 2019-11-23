
export const FOCUS = 64;
export const F_INV = 1/FOCUS;

/**
 * Information about 3d bounds and camera.
 */
export default class ZWorld {

	get zmin(){return this._zmin;}
	get zmax(){return this._zmax;}

	get focus(){return this._f; }

	constructor(vars){

		Object.assign( this, vars );

	}

	/**
 	* Projection factor at distance z.
 	* @param {number} z
 	*/
	projAt(z){ return this._f/( z + this._f ) };

}