import { Component } from "gibbon.js";
import ZWorld from "../data/zworld";

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
		this.z = z;
		this.k = this.zworld.projAt(z);
		this.rescale();
	}

	/**
	 * @property {}
	 */
	get velocity(){return this._vel;}
	set velocity(v){this._vel = v;}

	get baseScale(){ return this._baseScale; }
	set baseScale(v) { this._baseScale = v; }

	get minAlpha(){return this._minAlpha;}
	set minAlpha(v) { this._minAlpha=v;}

	get vz(){return this._vz; }
	set vz(v){this._vz = v;}

	get k(){return this._k;}
	set k(v){this._k = v;}

	init(){

		this.zworld = this.get( ZWorld );
		this.baseScale = 1;

	}

	update(){

		this._z += this._vz;
		if ( this._z < 0 ) {
			this._z = 0;
			this._vz = 0.1*Math.abs(this._vz);
		}
		//f.vz += (-0.0001 + 0.0002*Math.random())*delta;

		this._minAlpha = 0;
		this._maxAlpha = 1;

		this.clip.rotation += this.omega;
		this._k = this.zworld.projAt( this._z);

		this._position.set( this._position.x + (this.velocity.x+this.wind.x )*this._k,
		this._position.y + (this.velocity.y + this.wind.y )*this._k )

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

		this.clip.scale.set( this.k*this.baseScale );
		this.clip.alpha = this.minAlpha + ( this._maxAlpha - this.minAlpha )*this.k;

	}

}