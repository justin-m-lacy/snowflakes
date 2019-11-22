import Gibbon, { Game, Group, GameObject, Rand } from "gibbon.js";
import { Point, Container, System } from "pixi.js";
import BoundsDestroy from "gibbon.js/systems/boundsDestroy";
import Flake from "../components/flake";

const { randInt, randRange } = Rand;

export const FOCUS = 64;
export const F_INV = 1/FOCUS;

export const MAX_OMEGA = Math.PI/800;

/**
 * Projection factor at distance z.
 * @param {number} z
 */
export const projAt = (z)=>FOCUS/( z + FOCUS );

/*export const setProj = ( mat,z )=>{
	mat.a = mat.d = 1/(F_INV*z+1);
	return mat;
}*/

export default class SnowGroup extends BoundsDestroy {

	/**
	 *
	 * @param {Game} game
	 */
	constructor( game ) {

		super(game, new Container() );

		this.factory = game.factory;

		/**
		 * @property {Point} wind
	 	*/
		this.wind = game.wind;

		this.bounds = game.screen.clone().pad(64);

		this.count = 0;

		this.start();

	}

	/**
	 *
	 * @param {Point} pt
	 */
	createFlake( pt ){

		let g = this.factory.makeSnowflake(pt);

		this.add(g);
		this.count++;

	}

}