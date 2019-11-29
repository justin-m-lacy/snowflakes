import { Component } from "gibbon.js";
import ZWorld from "../data/zworld";
import { Point } from "pixi.js";

/*export const setProj = ( mat,z )=>{
	mat.a = mat.d = 1/(F_INV*z+1);
	return mat;
}*/

export default class ZMover extends Component {

	get minAlpha(){return this._minAlpha;}
	set minAlpha(v){ this._minAlpha = v;}

	get maxAlpha() { return this._maxAlpha;}
	set maxAlpha(v){ this._maxAlpha = v;}

	get z(){return this._z; }
	set z(z){
		this._z = z;
		this._k = this.zworld.projAt(z);
		this.rescale();
	}

	/**
	 * @property {}
	 */
	get velocity(){return this._vel;}
	set velocity(v){this._vel = v;}

	get baseScale(){ return this._baseScale; }
	set baseScale(v) { this._baseScale = v; }

	get vz(){return this._vz; }
	set vz(v){this._vz = v;}

	get k(){return this._k;}
	set k(v){this._k = v;}

	get omega(){ return this._omega; }
	set omega(v){this._omega = v;}

	/**
	 * @property {Point} position - reference to clip position.
	 */
	get position(){ return this._position; }
	set position(v) { this._position = v; }

	/**
	 * @property {ZWorld} world - world mover is moving in.
	 */
	get world() { return this.zworld; }

	constructor() {

		super();

		this._minAlpha = 0;
		this._maxAlpha = 1;
		this._vz = 0;

		this._z=0;

		this._omega = 0;
		this._vel = new Point();

	}

	init(){

		this.zworld = this.game.root.get( ZWorld );
		this.maxAlpha = this.clip.alpha;
		this.baseScale = this.clip.scale.x;

		this._position = this.clip.position;


	}

	update(){

		this._z += this._vz;
		this.clip.zIndex = -this._z;

		this.clip.rotation += this._omega;
		this._k = this.zworld.projAt( this._z);

		this._position.set( this._position.x + (this._vel.x )*this._k,
		this._position.y + (this._vel.y )*this._k )

		this.rescale();

	}

	/**
	 * Apply a motion of dx,dy with parallax applied.
	 * @param {number} dx
	 * @param {number} dy
	 */
	move( dx, dy ) {
		this._position.set( this._position.x + dx*this._k, this._position.y + dy*this._k );
	}

	/**
	 * Update scale and alpha based on z.
	*/
	rescale(){

		this.clip.scale.set( this._k*this._baseScale );
		this.clip.alpha = this._minAlpha + ( this._maxAlpha - this._minAlpha )*( this.zworld.zmax - this.z)/(this.zworld.zmax - this.zworld.zmin);

	}

}