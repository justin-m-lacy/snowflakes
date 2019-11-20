import Gibbon, { Game, Group, GameObject, Mover, Rand } from "gibbon.js";
import { Point, Container } from "pixi.js";

const { randInt, randRange } = Rand;

export default class SnowGroup extends Group {

	/**
	 * @property {Point} wind
	 */
	get wind(){return this._wind;}
	set wind(v){this._wind=v;}

	/**
	 *
	 * @param {Game} game
	 */
	constructor( game ) {

		super(game, new Container() );

		this.factory = game.factory;

		this.wind = new Point( randRange(-2, 2), 1 );

		this.count = 0;

	}

		/**
	 *
	 * @param {Point} pt
	 */
	createFlake( pt ){

		let s = this.factory.createFlake(pt);
		let g = new GameObject(s);

		let mv = g.add( Mover);
		mv.set( randRange(-1,1), randRange(-1,1) );

		this.add(g);

		this.count++;

	}

	start(){
		this.game.addUpdater(this.update)
	};

	unpause(){
		this.game.addUpdater(this.update );
	}

	pause(){
		this.game.removeUpdater(this.update);
	}

	update( delta ){

		let vx = delta*this._wind.x;
		let vy = delta*this._wind.y;

		for( let i = this.objects.length-1; i>=0; i-- ) {

			var f = this.objects[i];
			f.translate( vx, vy );

		}

	}

}