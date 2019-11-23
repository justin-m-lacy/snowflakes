import Gibbon, { Game, Group, GameObject, Rand } from "gibbon.js";
import { Point, Container, System } from "pixi.js";
import BoundsDestroy from "gibbon.js/systems/boundsDestroy";
import Flake from "../components/flake";
import { Components } from 'gibbon.js';
import FlakeSpawner from "../components/flakeSpawner";

const {TimeDestroy} = Components;

const { randInt, randRange } = Rand;

/**
 * Default spawner time.
 */
var SPAWNER_TIME = 3;

export const SPECIAL_TINT = 0x4455bb;

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

		this.stats = game.stats;
		this.count = 0;

		this.start();

	}

	update(){

		super.update();
		if ( Math.random() <0.1 ) {
			this.makeAutoFlake();
		}

	}

	makeAutoFlake() {

		let g = this.factory.makeSnowflake( Rand.inRect( this.bounds ) );
		let s = g.clip;
		s.tint = SPECIAL_TINT;

		let timer = g.add( TimeDestroy );
		timer.time = SPAWNER_TIME;

		s.interactive = true;
		g.on('click', ()=>this.clickAuto(g), this );

		this.add(g);

	}

	makeSpawner(){

		let g = new GameObject();
		g.add( FlakeSpawner );
		let timer = g.add( TimeDestroy );
		timer.time = SPAWNER_TIME;


		this.add(g);

	}

	/**
	 *
	 * @param {GameObject} g - object clicked.
	 */
	clickAuto(g){

		this.makeSpawner();
		g.Destroy();

	}

	/**
	 *
	 * @param {Point} pt
	 */
	createFlake( pt ){

		let g = this.factory.makeSnowflake(pt);

		this.add(g);

		this.stats.count++;

	}

}