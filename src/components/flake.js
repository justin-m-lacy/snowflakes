import { Point, Matrix } from "pixi.js";
import { SNOW_SCALE, FLAKE_RADIUS, TEX_SIZE } from "../create/snowFactory";
import { MAX_ALPHA, MIN_SIZE, MAX_Z, MIN_ALPHA } from "./backSnow";
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

	get position(){ return this._position}

	constructor( clip ){

		this.clip = clip;
		this.velocity = new Point();

		this._position = this.clip.position;
		//this._position =new Point();

		this.proj = new Matrix(1,0,0,1);

	}

	/**
	 * Update scale and alpha based on z.
	 */
	update(){

		let s = ( FLAKE_RADIUS - ( FLAKE_RADIUS - MIN_SIZE)*this.z/MAX_Z )/TEX_SIZE;
		this.clip.scale.set(s,s);
		this.clip.alpha = MIN_ALPHA + ( MAX_ALPHA - MIN_ALPHA )/this.z;

		//this.clip.position.set( this.position.x/this.z, this.position.y/this.z);
	}

}