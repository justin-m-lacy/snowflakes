import { Graphics, RAD_TO_DEG, DEG_TO_RAD, Polygon, Point } from "pixi.js";

/**
 * @const {number} HOLE_COLOR - Pixi holes have a lot of limitations.
 * Should be easier to draw regular colors and transform on copy.
 */
const HOLE_COLOR = 0xFF0000;

export default class SnowFactory {

	constructor(){

	}

	/**
	 * Create the base snowflake subarc.
	 * @param {number} fill
	 * @param {number} alpha
	 */
	makeSnowArc( radius=100, minArc=0, maxArc=360/16, fill=0xffffff, alpha=1 ) {

		const g = new Graphics();
		g.interactive = false;
		g.buttonMode = false;

		g.beginFill( fill, alpha );

		g.moveTo(0,0);

		g.arc(0,0, radius, minArc, maxArc, true );
		/*g.lineTo( radius*Math.cos(minArc ), radius*Math.PI( minArc ) );
		g.arcTo();
		g.lineTo(0,0);*/

		g.endFill();

		return g;

	}

	/**
	 * Create random polygon centered on 0,0.
	 * @param {number} minPoints
	 * @param {number} maxPoints
	 * @param {number} minRadius
	 * @param {number} maxRadius
	 * @returns {PIXI.Polygon}
	 */
	randPoly( minPoints=3, maxPoints=5, minRadius=5, maxRadius=10 ){

		const len = minPoints + Math.floor( Math.random()*(1+maxPoints-minPoints) );
		const step = 2*Math.PI/maxPoints;

		let pts = new Array(len);
		let r, theta = 0;
		for( let i = 0; i < len; i++ ) {

			r = minRadius + Math.random()*(maxRadius-minRadius);
			pts[i] = new Point( r*Math.cos(theta), r*Math.sin(theta) );

			theta += step;

		}

		return new Polygon( pts );

	}

	createFlake( fill, alpha ){

		const sprite = new PIXI.Sprite();
		sprite.interactive = true;
		sprite.buttonMode = true;


		const g = new Graphics();
		g.beginFill( fill, alpha );


		g.endFill();

		sprite.addChild(g);

		return sprite;

	}

}