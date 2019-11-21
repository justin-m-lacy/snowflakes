import Gibbon, { Game, GameObject, Mover, Rand, Component } from "gibbon.js";
import Flake from "./flake";
import { Point } from "pixi.js";
import { SNOW_SCALE, FLAKE_SIZE, TEX_SIZE } from "../create/snowFactory";

const { randInt, randRange } = Rand;

const MAX_WIND = 2;
const MIN_G = 0.3;
const MAX_G = 0.7;
const FLAKE_COUNT = 64;

const MIN_SIZE = 6;
const MAX_Z = 12;


const MIN_ALPHA = 0.4;
const MAX_ALPHA = 0.9;

const MAX_V = 1;


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

			var f = new Flake(s);
			this.randomize(f);
			s.position.set( bounds.x + Math.random()*bounds.width, bounds.y+Math.random()*bounds.height );

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

			if ( !bounds.contains( p.x, p.y ) ) {

				this.randomize(f);

			} else {

				p.set( p.x + (f.velocity.x + wind.x )*delta/f.z,
						p.y + (f.velocity.y + wind.y)*delta/f.z )
			}

		}

	}

	randomize(f) {

		f.velocity.set( randRange(-MAX_V, MAX_V), randRange(-MAX_V, MAX_V) );
		f.z = randRange(1,MAX_Z);

		let s = ( FLAKE_SIZE - ( FLAKE_SIZE - MIN_SIZE)*f.z/MAX_Z )/TEX_SIZE;

		f.clip.scale.set(s,s);
		f.clip.alpha = MIN_ALPHA + ( MAX_ALPHA - MIN_ALPHA )/f.z;

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