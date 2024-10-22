import Gibbon, { Game, GameObject, Rand, Component } from "gibbon.js";
import Flake, { MIN_ALPHA } from "./flake";
import { Point } from "pixi.js";
import { MAX_OMEGA } from './flake';
import ZWorld from "../data/zworld";
import ZMover from "./zmover";

const { randRange } = Rand;

const FLAKE_COUNT = 148;

const MIN_WIND = 0.25;
const MAX_WIND = 3.4;

const MIN_G = 0.5;
const MAX_G = 0.7;

const MAX_V = 0.24;
const MAX_VZ = 0.001;

/**
 * Background snow.
 */
export default class BackSnow extends Component {

	init(){

		this.flakes = [];

		this.bounds = this.game.screen.clone().pad( 40 );
		this.wind = this.game.wind;

		this.world = this.get( ZWorld );

		this.wind.set( randRange(-MAX_WIND, MAX_WIND ), randRange( MIN_G, MAX_G ) );

		/**
		 * @property {SnowFactory} factory
		 */
		this.factory = this.game.factory;

		console.time('CREATE FLAKES');
		this.fillView();
		console.timeEnd('CREATE FLAKES');

	}

	fillView() {

		let factory = this.factory;
		let bounds = this.bounds;
		let clip = this.clip;
		clip.visible = false;

		var p = new Point();

		for( let i = FLAKE_COUNT; i >= 0; i-- ) {

			p.set( Math.random()*bounds.width, Math.random()*bounds.height );
			var g = factory.mkSnowflake( p );

			this.game.addObject(g);

			var f = g.get( ZMover );
			f.maxAlpha = 0.8;
			f.z = this.world.randZ();

			clip.addChild(g.clip);
			this.flakes.push( f );


		}
		clip.visible = true;


	}

	update(){

		let bounds = this.bounds;
		let a = this.flakes;

		for( let i = a.length-1; i >= 0; i-- ) {

			var f = a[i];
			var p = f.position;

			if ( !bounds.contains( p.x, p.y ) || f.clip.alpha <= MIN_ALPHA ) {

				this.randomize(f);

				if ( Math.random() < 0.4 ){
					f.position.set( this.bounds.left + Math.random()*this.bounds.width, this.bounds.y+1 );
				} else if ( this.wind.x + f.velocity.x >= 0 ) {
					f.position.set( this.bounds.left+1, this.bounds.y + Math.random()*this.bounds.height );
				} else {
					f.position.set( this.bounds.right-1, this.bounds.y + Math.random()*this.bounds.height );
				}

			}

		}

	}

	/**
	 *
	 * @param {Flake} f
	 */
	randomize(f) {

		f.z = this.world.randZ();
		f.velocity.set( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );
		f.vz = randRange(-MAX_VZ, MAX_VZ );

		f.omega = randRange( -MAX_OMEGA, MAX_OMEGA );


	}

}