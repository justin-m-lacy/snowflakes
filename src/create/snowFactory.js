import { Graphics, RAD_TO_DEG, DEG_TO_RAD, Polygon, Point } from "pixi.js";
import { Factory, Geom } from "../../../gibbon";
import * as PIXI from 'pixi.js';
import { Linear } from "gsap";

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


		const tex = this.flakeTex( 100, 16 );
		sprite.texture = tex;

	//	sprite.addChild(g);

		return sprite;

	}

	flakeTex( r=100, segs=16 ){

		let arc=DEG_TO_RAD*(360/segs)
		let tex = PIXI.RenderTexture.create( 2*r, 2*r );

		let g = this.makeSnowArc( r, 0, arc );

		let base = this.renderer.generateTexture(g, Linear,2);
		let s = PIXI.Sprite.from(base);
		//g.position.set(r,r);

		let mat = new PIXI.Matrix();
		mat.translate(r,r);
		let theta = 0;
		for( let i = 0; i < 1; i++ ) {

			s.rotation = theta;
			g.rotation = theta;
			theta += arc;
			this.renderer.render(g, tex, false,mat );

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

		/*g.beginFill( HOLE_COLOR );
		g.drawPolygon( new Polygon( new Point(10,10), new Point(20,20), new Point(80,0)))
		g.endFill();*/

		this.cutPoly(g, radius, minArc, maxArc);
		this.cutPoly(g, radius, minArc, maxArc);

		return g;

	}

	cutPoly( g, r=100, minTheta=0, maxTheta=2*Math.PI ){

		let p = this.randPoly();

		let t = minTheta + Math.random()*(maxTheta-minTheta);
		r = Math.random()*r;

		Geom.move( p, r*Math.cos(t), r*Math.sin(t) );

		g.beginFill( HOLE_COLOR,1);
		g.drawPolygon( p );
		g.endFill();

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

			theta = Math.random()*Math.PI;

		}

		return new Polygon( pts );

	}

}