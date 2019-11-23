import { Point } from "pixi.js";
import { BASE_SCALE } from "../create/snowFactory";
import { MAX_ALPHA, MIN_ALPHA } from "./backSnow";
import { projAt, MAX_OMEGA } from "../groups/snowGroup";
import { Component, Rand } from "gibbon.js";

const { randInt, randRange } = Rand;

const MAX_V = 0.2;
const MAX_VZ = 0.01;

/**
 * Container for holding flake/clip/velocity information.
 */
export default class Flake extends Component {

	get color(){return this._color;}
	set color(v){this._color=v;}



	/**
	 * @property {number} proj - current projection constant based on z.
	 */
	get proj(){return this.k; }

	init(){

		this.velocity = new Point( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );

		// base scaling before effects.
		this._baseScale = this.clip.scale.x;
		this._minAlpha = MIN_ALPHA;

		//this._position =new Point();

		this.wind = this.game.wind;

		this.z = 10*Math.random();
		this.omega = randRange( -MAX_OMEGA, MAX_OMEGA );
		this.vz = randRange(-MAX_VZ, MAX_VZ );

	}

	update(){

		this.z += this.vz;
		if ( this.z < 0 ) {
			this.z = 0;
			this.vz = 0.1*Math.abs(this.vz);
		}
		//f.vz += (-0.0001 + 0.0002*Math.random())*delta;

		this.clip.rotation += this.omega;
		this.k = projAt( this.z);
		this._position.set( this._position.x + (this.velocity.x+this.wind.x )*this.k,
		this._position.y + (this.velocity.y + this.wind.y )*this.k )

	}

}