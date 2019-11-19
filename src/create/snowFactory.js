import { Graphics, RAD_TO_DEG, DEG_TO_RAD, Polygon, Point } from "pixi.js";
import { Factory } from "../../../gibbon";
import * as PIXI from 'pixi.js';

/**
 * @const {number} HOLE_COLOR - Pixi holes have a lot of limitations.
 * Should be easier to draw regular colors and transform on copy.
 */
const HOLE_COLOR = 0xFF0000;

export default class SnowFactory extends Factory {

	constructor( game ){

		super(game);
	}

	createFlake( fill, alpha ){

		const sprite = new PIXI.Sprite();
		sprite.interactive = true;
		sprite.buttonMode = true;


		const tex = this.flakeTex();
		sprite.texture = tex;

	//	sprite.addChild(g);

		return sprite;

	}

	flakeTex( r=100, arc=DEG_TO_RAD*(360/16) ){

		let tex = PIXI.RenderTexture.create( 2*r, 2*r );

		let g = this.makeSnowArc( r, 0, arc );
		g.position.set(r,r);

		for( let theta = 0; theta < 2*Math.PI; theta += arc ) {

			g.rotation = theta;

			this.renderer.render( g, tex, false );

		}

		return tex;

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

		g.arc(0,0, radius, minArc, maxArc );
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

}