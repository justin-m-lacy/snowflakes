import Gibbon, { Game, GameObject, Mover, Rand, Component } from "gibbon.js";
import Flake from "./flake";
import { Point } from "pixi.js";

const { randInt, randRange } = Rand;

const MAX_WIND = 2;
const MIN_G = 0.3;
const MAX_G = 0.7;
const FLAKE_COUNT = 64;

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

			var s = factory.createFlake( new Point( Math.random()*bounds.width, Math.random()*bounds.height ) );
			clip.addChild(s);

			this.flakes.push( new Flake(s) );

		}

	}

	update(delta){

		let bounds = this.bounds;
		let wind = this.wind;
		let a = this.flakes;

		for( let i = a.length-1; i >= 0; i-- ) {

			var f = a[i];
			var p = f.clip.position;

			if ( !bounds.contains( p.x, p.y ) ) {

				p.set( Math.random()*bounds.width, bounds.y );

			} else {

				p.set( p.x + (f.velocity.x + wind.x )*delta/f.z,
						p.y + (f.velocity.y + wind.y)*delta/f.z )
			}

		}

	}

}