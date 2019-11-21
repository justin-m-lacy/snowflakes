import Gibbon, { Game, GameObject, Mover, Rand, Component } from "gibbon.js";
import Flake from "./flake";
import { Point } from "pixi.js";
import { projAt } from "../groups/snowGroup";

const { randInt, randRange } = Rand;

const MAX_WIND = 2;
const MIN_G = 0.3;
const MAX_G = 0.7;
const FLAKE_COUNT = 64;

export const MIN_SIZE = 6;
export const MIN_Z = 10;
export const MAX_Z = 200;

const MIN_ALPHA = 0.7;
const MAX_ALPHA = 1;
export { MIN_ALPHA, MAX_ALPHA };

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

		this.fillView();

	}

	fillView() {

		let factory = this.factory;
		let bounds = this.bounds;
		let clip = this.clip;

		for( let i = FLAKE_COUNT; i >= 0; i-- ) {

			var s = factory.createFlake( new Point() );
			clip.addChild(s);

			var f = new Flake(s);
			this.randomize(f);
			f.position.set(Math.random()*bounds.width, Math.random()*bounds.height);
			//f.position.set( randRange(-bounds.width/2,bounds.width/2), randRange(-bounds.height/2,bounds.height/2) );

			this.flakes.push( f );

		}

	}

	update(delta){

		let bounds = this.bounds;
		let wind = this.wind;
		let a = this.flakes;

		for( let i = a.length-1; i >= 0; i-- ) {

			var f = a[i];
			var p = f.clip.position;

			if ( f.z < MIN_Z ) f.vz = Math.abs(f.vz);

			if ( !bounds.contains( p.x, p.y ) ) {

				this.randomize(f);

			} else {

				p = f.position;
				f.z += f.vz;
				//f.vz += (-0.0001 + 0.0002*Math.random())*delta;


				var k = projAt( f.z);
				p.set( p.x + (f.velocity.x + wind.x )*k,
						p.y + (f.velocity.y + wind.y)*k )


				f.update();
			}

		}

	}

	/**
	 *
	 * @param {Flake} f
	 */
	randomize(f) {

		f.z = randRange(1,MAX_Z);
		f.velocity.set( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );
		f.vz = randRange(-MAX_VZ, MAX_VZ );

		// update scale and alpha.
		f.update();

		if ( Math.random() < 0.5 ){
			f.position.set( this.bounds.left + Math.random()*this.bounds.width, this.bounds.y+1 );
		} else if ( this.wind.x + f.velocity.x >= 0 ) {
			f.position.set( this.bounds.left+1, this.bounds.y + Math.random()*this.bounds.height );
		} else {
			f.position.set( this.bounds.right-1, this.bounds.y + Math.random()*this.bounds.height );
		}

	}

	placeTop(f){

		f.position.set( Math.random()*bounds.width, bounds.y );

	}

	placeSide(f){
	}

}