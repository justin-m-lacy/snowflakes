import Gibbon, { Game, Group, GameObject, Mover, Rand, System } from "gibbon.js";
import { Point, Container, Graphics } from "pixi.js";
import { gsap } from "gsap";

const { randInt, randRange } = Rand;

const STAR_COLOR = 0xffffff;
const STAR_ALPHA = 0.8;

const MIN_RADIUS = 3;
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

		gsap.to( g, randRange(1,3),
			{alpha:1, yoyo:true, repeat:1, repeatDelay:randRange(2,4),
					onCompleteParams:[g], onComplete:(g)=>this.killStar(g) } );

		this.clip.addChild(g);

	}

	killStar( s ){

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

		g.drawStar( 0, 0, 4, MAX_RADIUS, 0.5*MAX_RADIUS );
		g.alpha = 0;
		g.rotation = Math.random()*Math.PI;

		g.endFill();

		return g;

	}


	update(delta) {

		if ( Math.random() < 0.01) {
			this.makeStar();
		}

	}

}