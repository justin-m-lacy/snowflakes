import { Rand } from "gibbon.js";
import { Point } from "pixi.js";
import { SNOW_SCALE } from "../create/snowFactory";
const { randInt, randRange } = Rand;

const MAX_Z = 8;

const MIN_SCALE = 0.8;
const MAX_SCALE = 1;

const MIN_ALPHA = 0.4;
const MAX_ALPHA = 0.9;

const MAX_V = 1;

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

	constructor( clip ){

		this.clip = clip;
		this.velocity = new Point();

		this.randomize();

	}

	randomize(){

		this.velocity.set( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );
		this.z = randRange(1,MAX_Z);

		this.velocity.x;
		this.velocity.y;

		let s = (SNOW_SCALE/this.z)*( MIN_SCALE + ( MAX_SCALE - MIN_SCALE ) );
		this.clip.scale.set(s,s);
		this.clip.alpha = MIN_ALPHA + ( MAX_ALPHA - MIN_ALPHA )/this.z;

	}



}