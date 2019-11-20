import Gibbon, { Game, Group, GameObject, Mover, Rand, System } from "gibbon.js";
import { Point, Container, Graphics } from "pixi.js";
import { TweenMax } from "gsap";

const { randInt, randRange } = Rand;

const STAR_COLOR = 0xffffff;
const STAR_ALPHA = 0.9;

const MIN_RADIUS = 2;
const MAX_RADIUS = 3;

export default class StarGroup extends System {


	constructor( game) {

		super( game, new Container() );
		this.start();

	}

	makeStar(){

		let screen = this.game.screen;

		let g = this.drawStar();
		g.position.set( Math.random()*screen.width, Math.random()*screen.height );

		TweenMax.to( g, randRange(1,3),
			{alpha:1, yoyo:true, onReverseCompleteParams:[g], onReverseComplete:this.killStar, onReverseCompleteScope:this } );

		this.clip.addChild(g);

	}

	killStar( s ){

		console.log('kill: ' + s );
		let ind = this.objects.indexOf(s);
		if ( ind ){
			this.objects.splice(ind, 1);
		}

	}

	/**
	 * @returns {Graphics}
	 */
	drawStar(){

		let g = new Graphics();

		g.beginFill(STAR_COLOR, STAR_ALPHA);

		let r = randRange(MIN_RADIUS, MAX_RADIUS);
		g.drawStar( 0, 0, 4, r, 0.5*r );
		g.alpha = 0;
		g.rotation = Math.random()*Math.PI;

		g.endFill();

		return g;

	}


	update(delta) {

		if ( Math.random() < 0.001) {
			this.makeStar();
		}

	}

}