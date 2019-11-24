import Gibbon, { Game, Group, GameObject, Rand } from "gibbon.js";
import { Point, Container, System } from "pixi.js";
import BoundsDestroy from "gibbon.js/systems/boundsDestroy";
import Flake from "../components/flake";
import { Components } from 'gibbon.js';
import FlakeSpawner from "../components/flakeSpawner";
import ZMover from "../components/zmover";
import Comet from "../components/comet";

const {TimeDestroy} = Components;

const { randInt, randRange } = Rand;

const SPAWNER_TINT = 0xff11bb;

const MIN_COMET_RATE = 0.002;
const MAX_COMET_RATE = 0.01;

const COMET_TIME = 3;
const MAX_COMET_TIME = 7;

/**
 *  @const {number} MIN_SPAWNER_RATE - Base rate at which Spawn flakes spawn, in 100*pct per frame.
 */
const MIN_SPAWNER_RATE = 0.001;
const MAX_SPAWNER_RATE = 0.01;


/**
 * @const {number} MIN_SPAWNER_TIME - Min. spawner flake effect length, in seconds.
 */
const MIN_SPAWNER_TIME = 1.5;
const MAX_SPAWNER_TIME = 7;

/**
 * Function that starts at min and exponentially approaches max
 * but never reaches.
 * v is the current input value, which should start at 0.
 * Higher k makes the function approach max faster.
 * Lower k slows the approach to max.
 * 1/e = 0.367 => 37% min + 63% max
 * @param {number} min
 * @param {number} max
 * @param {number} v
 * @param {number} k
 */
export const expLerp = ( min, max, v, k=0.001 ) => {

	let t = Math.exp( -k*v );
	return t*min + (1-t)*max;

}

export default class SnowGroup extends BoundsDestroy {

	/**
	 *
	 * @param {Game} game
	 */
	constructor( game ) {

		super(game, new Container() );

		/**
		 * Default spawner time.
		 */
		this.spawnerTime = MIN_SPAWNER_TIME;
		this.spawnerRate = MIN_SPAWNER_RATE;

		this.factory = game.factory;

		/**
		 * @property {Point} wind
	 	*/
		this.wind = game.wind;

		this.view = game.screen;
		this.bounds = game.screen.clone().pad(64);

		this.stats = game.stats;
		this.count = 0;

		this.start();

	}

	/**
	 * Get spawn position on the same side as the wind.
	 * @returns {Point}
	*/
	windPos(){
		return new Point( this.wind.x > 0 ? this.bounds.x : this.bounds.right, 0.8*Math.random()*this.bounds.height );
	}

	/**
	 * Get spawn position opposite wind-side, and within 80% of screen top.
	 * @returns {Point}
	*/
	aleePos() {
		return new Point( this.wind.x > 0 ? this.view.right : this.view.x, 0.8*Math.random()*this.bounds.height );
	}

	update(){

		super.update();
		if ( Math.random() < this.spawnerRate ) {
			this.mkSpawner();
		}
		if ( Math.random() < MIN_COMET_RATE ) {
			this.mkComet();
		}

	}

	mkComet(){

		let g = this.factory.makeComet( this.aleePos() );
		g.clip.interactive = true;

		this.add(g);

		g.get(Comet).setVelocity( this.wind.x > 0 ? -1.5-1.75*Math.random() : 1.5+1.75*Math.random(), -0.4*Math.random() );

		g.on('click', ()=>this.clickComet(g), this );

	}

	mkSpawner() {

		let g = this.factory.makeSnowflake( this.windPos() );
		g.clip.tint = SPAWNER_TINT;
		g.clip.interactive = true;

		let f = g.get(Flake);
		f.z = 100*Math.random();
		f.vz = -0.05-0.1*Math.random();

		g.on('click', ()=>this.clickAuto(g), this );

		this.add(g);

	}

	startAutoSpawn(){

		let g = new GameObject();
		g.add( FlakeSpawner );
		let timer = g.add( TimeDestroy );
		timer.time = this.spawnerTime;

		let n = this.stats.spawners++;
		this.spawnerTime = expLerp( MIN_SPAWNER_TIME, MAX_SPAWNER_TIME, n );


		this.add(g);

	}

	clickComet(g){

		g.get(Comet).fadeOut();

	}

	/**
	 *
	 * @param {GameObject} g - object clicked.
	 */
	clickAuto(g){

		this.startAutoSpawn();
		g.Destroy();

	}

	/**
	 *
	 * @param {Point} pt
	 */
	createFlake( pt ){

		let g = this.factory.makeSnowflake(pt);

		this.add(g);

		let n = this.stats.count++;
		this.spawnerRate = expLerp( MIN_SPAWNER_RATE, MAX_SPAWNER_RATE, n, 0.00001 );

	}

}