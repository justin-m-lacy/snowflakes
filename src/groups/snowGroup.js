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

/**
 * @property {number} MIN_SPEC_RATE - special snowflake rate.
 */
const MIN_SPEC_RATE = 0.001;
const MAX_SPEC_RATE = 0.01;

const MIN_COMET_RATE = 0.001;
const MAX_COMET_RATE = 0.005;

/**
 * Snowflakes -> auto-spawners rate
 * Auto-Spawners -> comet rate
 * Comets -> Auto-spawner length
 */
/**
 * @property {number} MIN_COMET_TIME - minimum comet-effect length, in seconds.
 */
const MIN_COMET_TIME = 3;
const MAX_COMET_TIME = 7;

/**
 *  @const {number} MIN_SPAWNER_RATE - Base rate at which Spawn flakes spawn, in 100*pct per frame.
 */
const MIN_SPAWNER_RATE = 0.002;
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

		this.cometRate = MIN_COMET_RATE;

		this.specRate = MIN_SPEC_RATE;
		this.special = null;

		this.factory = game.factory;

		/**
		 * @property {Point} wind
	 	*/
		this.wind = game.wind;

		this.view = game.screen;
		this.bounds = game.screen.clone().pad(64);

		this.stats = game.stats;

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
		if ( Math.random() < this.cometRate ) {
			this.mkComet();
		}

	}

	mkComet(){

		let g = this.factory.makeComet( this.aleePos() );
		g.clip.interactive = true;

		this.engine.add(g);

		g.get(Comet).setVelocity( this.wind.x > 0 ? -3-3.5*Math.random() : 3+3.5*Math.random(), -0.4+0.8*Math.random() );

		g.on('click', (e)=>this.clickComet(e,g), this );

	}

	mkSpawner() {

		let g = this.factory.makeSnowflake( this.windPos() );
		g.clip.tint = SPAWNER_TINT;
		g.clip.interactive = true;

		let f = g.get(Flake);
		f.z = 100*Math.random();
		f.vz = -0.05-0.1*Math.random();

		g.on('click', (e)=>this.clickAuto(e,g), this );

		this.add(g);

	}

	/**
	 *
	 * @param {GameObject} g - object clicked.
	 */
	clickAuto(e,g){

		e.stopped = true;

		this.startAutoSpawn();
		this.stats.spawners++;
		g.Destroy();

	}

	startAutoSpawn(){

		let g = new GameObject();
		g.add( FlakeSpawner );
		let timer = g.add( TimeDestroy );
		timer.time = this.spawnerTime;

		let n = this.stats.spawners++;
		this.cometRate = expLerp( MIN_COMET_RATE, MAX_COMET_RATE, n );


		this.add(g);

	}

	clickComet(e,g){

		e.stopped = true;
		g.get(Comet).fadeOut();

		let n = this.stats.comets++;

		this.spawnerTime = expLerp( MIN_SPAWNER_TIME, MAX_SPAWNER_TIME, n );

	}

	/**
	 *
	 */
	pickSpecial(){

		let len = this.objects.length;
		let st = Math.floor(Math)
		for( let i = this.objects.length-1; i >= 0; i-- ) {

		}

		this.game.emitter.emit('new-special');

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