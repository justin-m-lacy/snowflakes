import Gibbon, { Game, GameObject, Mover, Rand, Component } from "gibbon.js";
import Flake from "./flake";
import { Point } from "pixi.js";
import { projAt, MAX_OMEGA } from "../groups/snowGroup";

const { randRange } = Rand;

const FLAKE_COUNT = 512;

const MAX_WIND = 2.7;
const MIN_G = 0.4;
const MAX_G = 0.8;


export const MIN_SIZE = 6;
export const MIN_Z = 32;
export const MAX_Z = 200;

export const MIN_ALPHA = 0.2;
export const MAX_ALPHA = 1;

const MAX_V = 0.2;
const MAX_VZ = 0.001;

/**
 * Background snow.
 */
export default class BackSnow extends Component {

	init(){

		this.flakes = [];

		this.bounds = this.game.screen.clone().pad( 40 );
		this.wind = this.game.wind;

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

		for( let i = FLAKE_COUNT; i >= 0; i-- ) {

			var g = factory.makeSnowflake( new Point( Math.random()*bounds.width, Math.random()*bounds.height) );

			this.game.addObject(g);

			var f = g.get(Flake);
			f.setZ( randRange(MIN_Z,MAX_Z) );
			//f.position.set( randRange(-bounds.width/2,bounds.width/2), randRange(-bounds.height/2,bounds.height/2) );

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

			if ( f.z < MIN_Z ) f.vz = Math.abs(f.vz);

			if ( !bounds.contains( p.x, p.y ) ) {
				this.randomize(f);
			}

		}

	}

	/**
	 *
	 * @param {Flake} f
	 */
	randomize(f) {

		f.z = randRange(MIN_Z,MAX_Z);
		f.velocity.set( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );
		f.vz = randRange(-MAX_VZ, MAX_VZ );

		f.omega = randRange( -MAX_OMEGA, MAX_OMEGA );

		if ( Math.random() < 0.4 ){
			f.position.set( this.bounds.left + Math.random()*this.bounds.width, this.bounds.y+1 );
		} else if ( this.wind.x + f.velocity.x >= 0 ) {
			f.position.set( this.bounds.left+1, this.bounds.y + Math.random()*this.bounds.height );
		} else {
			f.position.set( this.bounds.right-1, this.bounds.y + Math.random()*this.bounds.height );
		}

	}

}