import Gibbon, { Game, System, Group, GameObject, Rand } from "gibbon.js";
import { Point } from "pixi.js";
import Flake from "../components/flake";
import { Components } from 'gibbon.js';
import FlakeSpawner from "../components/flakeSpawner";

import Comet from "../components/comet";
import { EVT_SNOW, EVT_STAT } from "../components/stats";
import Dispersal from "../components/dispersal";
import { FLAKE_RADIUS } from "../create/snowFactory";
import ZBound from "../components/zbound";
import ZMover from "../components/zmover";

const {TimeDestroy} = Components;

const SPAWNER_TINT = 0xff11bb;

/**
 * @property {number} MIN_SPEC_RATE - special snowflake rate.
 */
const MIN_SPEC_RATE = 0.009;
const MAX_SPEC_RATE = 0.01;

const MIN_COMET_RATE = 0.001;
const MAX_COMET_RATE = 0.005;

/**
 * Snowflakes -> auto-spawners rate
 * Auto-Spawners -> comet rate
 * Comets -> Auto-spawner length
 */
/**
 * @property {number} MIN_COMET_COLD - minimum comet-cold reduction.
 */
const MIN_COMET_COLD = -5;
const MAX_COMET_COLD = -30;

/**
 *  @const {number} MIN_SPAWNER_RATE - Base rate at which Spawn flakes spawn, in 100*pct per frame.
 */
const MIN_SPAWNER_RATE = 0.002;
const MAX_SPAWNER_RATE = 0.01;


/**
 * @const {number} MIN_SPAWNER_TIME - Min. spawner flake effect length, in seconds.
 */
const MIN_SPAWNER_TIME = 1;
const MAX_SPAWNER_TIME = 8;

/**
 * Object flags.
 */
const TYP_FLAKE = 1;
const TYP_SPAWNER = 2;
const TYP_COMET = 3;


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

/**
 * Group for interactive Snow elements.
 */
export default class SnowGroup extends System {

	/**
	 * @property {Rectangle} bounds - objects in system outside the bounds
	 * will automatically be destroyed unless an onExit() function is specified.
	 * If so, the onExit function will be called instead.
	 */
	get bounds(){ return this._bounds; }
	set bounds(v){ this._bounds=v; }

	/**
	 *
	 * @param {Game} game
	 */
	constructor( game, mc ) {

		super(game, mc );

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
		this.bounds = game.screen.clone().pad( FLAKE_RADIUS+2 );
		this.innerBounds = game.screen.clone().pad(-(FLAKE_RADIUS+2));

		this.stats = game.stats;
		this.game.on( EVT_STAT, this.onStat );

		/**
		 * @property {number} lastSpecial - clicks since last special.
		 */
		this.lastSpecial = 0;

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

		this.wrapSnow();

		if ( Math.random() < this.spawnerRate ) {
			this.mkSpawner();
		}
		if ( Math.random() < this.cometRate ) {
			this.mkComet();
		}
		if ( this.special === null &&
			(this.lastSpecial > (this.stats.specials+5)) && Math.random() < this.specRate ) {
			this.mkSpecial();
		}

	}

	wrapSnow() {

		var bnds = this.bounds;

		for( let i = this.objects.length-1; i >= 0; i-- ) {

			var go = this.objects[i];
			if ( go.destroyed ) { continue; }
			else if ( (go.flags & TYP_FLAKE) === 0) {
				go.Destroy();
				continue;
			}

			var pos = go.position;
			if ( pos.y > bnds.bottom || pos.y < bnds.top ) {

				if ( go.passes > 0 ) go.Destroy();
				else {
					go.passes++;
					pos.y = pos.y > bnds.bottom ? bnds.top+1 : bnds.bottom-1;
				}

			} else if ( pos.x < bnds.left || pos.x > bnds.right ) {

				if ( go.passes === 1 && !go.has(ZBound ) ) go.addExisting( new ZBound( go.get(ZMover), 0.15+0.2*Math.random() ), ZBound );
				pos.x = pos.x < bnds.left ? bnds.right-1 : bnds.left+1;
				go.passes++;

			}

		}

		/*
			if ( !go.has(SnowTimer ) ){
				go.addExisting( new SnowTimer() );
				go.addExisting( new ZBound() );
			}
		}*/

	}

	/**
	 * Flake created.
	 */
	onStat( stat, n ) {

		if ( stat === EVT_SNOW ) {
			this.spawnerRate = expLerp( MIN_SPAWNER_RATE, MAX_SPAWNER_RATE, n, 0.00001 );
		}
	}

	/**
	 *
	 * @param {InteractionEvent} evt
	 */
	mkFlake( pt ){

		this.stats.snow++;
		let g = this.factory.mkSnowflake( pt );
		g.passes = 0;
		g.flags = TYP_FLAKE;

		this.lastSpecial++;

		this.add( g );

	}

	mkComet(){

		let g = this.factory.mkComet( this.aleePos() );
		g.clip.interactive = true;
		g.flags = TYP_COMET;

		this.engine.add(g);

		g.get(Comet).setVelocity( this.wind.x > 0 ? -3-3.5*Math.random() : 3+3.5*Math.random(), -0.4+0.8*Math.random() );

		g.on('click', (e)=>this.clickComet(e,g), this );

	}

	mkSpawner() {

		let g = this.factory.mkSnowflake( this.windPos() );
		g.clip.tint = SPAWNER_TINT;
		g.clip.interactive = true;
		g.flags = TYP_SPAWNER;

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

		e.stopPropagation();

		let n = this.stats.spawners++;
		this.cometRate = expLerp( MIN_COMET_RATE, MAX_COMET_RATE, n );

		this.startAutoSpawn();

		g.Destroy();

	}

	startAutoSpawn(){

		let g = new GameObject();
		g.addExisting( new FlakeSpawner(this), FlakeSpawner );
		let timer = g.add( TimeDestroy );
		timer.time = this.spawnerTime;

		this.add(g);

	}

	clickComet(e,g){

		e.stopPropagation();
		g.get(Comet).fadeOut();

		this.stats.cold += expLerp( MIN_COMET_COLD, MAX_COMET_COLD, this.stats.specials, 0.01 );

		let n = this.stats.comets++;
		this.spawnerTime = expLerp( MIN_SPAWNER_TIME, MAX_SPAWNER_TIME, n );

	}

	/**
	 *
	 */
	mkSpecial() {

		let len = this.objects.length;
		if ( len === 0 ) return;

		let st = Math.floor(Math.random()*len );
		let i = st-1;

		let spec = null;

		do {

			if ( --i < 0 ) i = len-1;

			var g = this.objects[i];
			if ( g.clip && this.innerBounds.contains( g.clip.x, g.clip.y ) ) {
				spec = g;
				break;
			}

		} while ( i !== st );

		if ( !spec) return;

		this.special = spec;
		if ( !spec.has(ZBound)) spec.addExisting( new ZBound( spec.get(ZMover) ), ZBound );
		spec.passes = 0;		// reset passes to prevent instant-fade.
		spec.clip.interactive = true;
		spec.on('click', this.specClicked, this );

		this.game.emitter.emit('new-special', spec );

	}

	/**
	 *
	 * @param {InteractionEvent} e
	 */
	specClicked( e ){

		e.stopPropagation();

		if ( this.special ) {

			this.lastSpecial = 0;

			this.stats.specials++;

			//console.log('Flake Count: ' + this.objects );
			//this.special.Destroy();
			this.game.emitter.emit('new-special', null );

			var s = this.special;
			super.remove( s );
			s.addExisting( new Dispersal( this ) );
			this.special = null;

		}

	}

	remove(go, removeClip=true) {

		super.remove( go, removeClip );
		if ( go === this.special ) {

			this.game.emitter.emit('new-special', null );
			this.special = null;
		}

	}

}