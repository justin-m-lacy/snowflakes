import Gibbon, { Game, Group, GameObject, Mover, Rand } from "gibbon.js";
import { Point, Container, System } from "pixi.js";
import BoundsDestroy from "gibbon.js/systems/boundsDestroy";

const { randInt, randRange } = Rand;

export const FOCUS = 40;
export const F_INV = 1/FOCUS;

/**
 * Projection factor at distance z.
 * @param {number} z
 */
export const projAt = (z)=>1/( F_INV*z + 1 );

export const setProj = ( mat,z )=>{
	mat.a = mat.c = 1/(F_INV*z+1);
	return mat;
}

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

		let s = this.factory.createFlake(pt);
		let g = new GameObject(s);
		g.setDestroyOpts(true,true,true);

		let mv = g.add( Mover);
		mv.set( randRange(-1,1), randRange(-1,1) );
		mv.vz = randRange(-0.001,0.001);

		this.add(g);

		this.count++;

	}

	update( delta ){

		let vx = delta*this.wind.x/4;
		let vy = delta*this.wind.y/4;

		for( let i = this.objects.length-1; i>=0; i-- ) {

			var f = this.objects[i];



			f.translate( vx, vy );

		}

		super.update(delta);
	}

}