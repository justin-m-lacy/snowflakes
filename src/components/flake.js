import { Point } from "pixi.js";
import { BASE_SCALE } from "../create/snowFactory";
import { MAX_OMEGA } from "../groups/snowGroup";
import { Component, Rand } from "gibbon.js";
import ZMover from "./zmover";

const { randRange } = Rand;

const MIN_ALPHA = 0.2;
const MAX_ALPHA = 1;

const MAX_V = 0.2;
const MAX_VZ = 0.01;

/**
 * Container for holding flake/clip/velocity information.
 */
export default class Flake extends Component {

	get color(){return this._color;}
	set color(v){this._color=v;}

	init(){

		var mover = this.mover = this.add( ZMover );
		this.mover.velocity = new Point( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );

		// base scaling before effects.
		mover.minAlpha = MIN_ALPHA;
		mover.maxAlpha = MAX_ALPHA;
		mover.vz = randRange(-MAX_VZ, MAX_VZ );

		//this._position =new Point();

		this.wind = this.game.wind;

		mover.z = 10*Math.random();
		this.omega = randRange( -MAX_OMEGA, MAX_OMEGA );

	}

	update(){

		if ( this.z < 0 ) {
			this.z = 0;
			this.vz = 0.1*Math.abs(this.vz);
		}

		this._position.set( this._position.x + (this.velocity.x+this.wind.x )*this.k,
		this._position.y + (this.velocity.y + this.wind.y )*this.k )

	}

}