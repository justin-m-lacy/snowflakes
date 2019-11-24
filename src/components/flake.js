import { Point } from "pixi.js";
import { Component, Rand } from "gibbon.js";
import ZMover from "./zmover";

const { randRange } = Rand;

export const MAX_OMEGA = Math.PI/800;

const MIN_ALPHA = 0.2;
const MAX_ALPHA = 1;

const MAX_V = 0.32;
const MAX_VZ = 0.02;

/**
 * Container for holding flake/clip/velocity information.
 */
export default class Flake extends Component {

	/*get color(){return this._color;}
	set color(v){this._color=v;}*/

	init(){

		var mover = this.mover = this.add( ZMover );
		mover.velocity = new Point( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );

		// base scaling before effects.
		mover.minAlpha = MIN_ALPHA;
		mover.maxAlpha = MAX_ALPHA;
		mover.z = 10*Math.random();
		mover.vz = randRange(-MAX_VZ, MAX_VZ );
		mover.omega = randRange( -MAX_OMEGA, MAX_OMEGA );

		//this._position =new Point();

		this.wind = this.game.wind;

	}

	update(){

		if ( this.mover.z < 0 ) {

			this.mover.z = 0;
			this.mover.vz = 0.1*Math.abs( this.mover.vz);
		}

		this.mover.move( this.wind.x, this.wind.y );

	}

}