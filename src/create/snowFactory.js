import { Graphics, DEG_TO_RAD, Polygon, Point } from "pixi.js";
import { Factory, Geom } from "../../../gibbon";
import * as PIXI from 'pixi.js';

const randInt = (min,max)=>{ return min + Math.ceil( Math.random()*(max-min)) }
const randRange = (min,max)=>{ return min + ( Math.random()*(max-min)) }

/**
 * @const {number} HOLE_COLOR - Pixi holes have a lot of limitations.
 * Should be easier to draw regular colors and transform on copy.
 */
const HOLE_COLOR = 0xFF0000;

const MIN_RADIUS = 50;
const MAX_RADIUS = 100;

/**
 * Min/max arc gap as percent of arc.
 */
const MIN_GAP = 0.2;
const MAX_GAP = 0.5;

const MIN_SEGS = 8;
const MAX_SEGS = 20;

const MIN_CUTS = 8;
const MAX_CUTS = 16;

export default class SnowFactory extends Factory {

	constructor( game ){

		super(game);

		this.drawTex = PIXI.RenderTexture.create()
		this.baseArc = this.makeArc( 2*Math.PI/MAX_SEGS );
		this.maskArc = this.baseArc.clone();

	}

	createFlake( loc ){

		const sprite = new PIXI.Sprite();
		sprite.interactive = true;
		//sprite.buttonMode = true;

		if (!loc) loc = new Point();
		sprite.position.set( loc.x, loc.y );

		const tex = this.flakeTex( 100, randInt( MIN_SEGS, MAX_SEGS ) );
		sprite.texture = tex;

	//	sprite.addChild(g);

		return sprite;

	}

	flakeTex( r=100, segs=16 ){

		let arc=DEG_TO_RAD*(360/segs)
		let tex = PIXI.RenderTexture.create( 2*r, 2*r );

		let gap = Math.random() < 0.5 ? 0 : randRange( MIN_GAP, MAX_GAP );
		let g = this.makeSnowArc( r, arc*(1-gap) );

		let mat = new PIXI.Matrix();
		mat.translate(r,r);
		let theta = 0;
		for( let i = 0; i < segs; i++ ) {

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
	 * @returns {PIXI.DisplayObject}
	 */
	makeSnowArc( radius=100, maxArc=360/16, fill=0xffffff ) {

		const clip = new PIXI.Container();

		const base = this.makeArc( maxArc, radius, fill );
		const mask = base.clone();

		const cut = new Graphics();
		cut.blendMode = PIXI.BLEND_MODES.ERASE;
		cut.mask = mask;

		let cuts = randInt( MIN_CUTS, MAX_CUTS );
		for( let i = 0; i < cuts; i++ ) {
			this.cutPoly(cut, radius, 0, maxArc);
		}

		clip.addChild( mask );
		clip.addChild( base );
		clip.addChild(cut);

		return clip;

	}

	makeArc( arc, radius=100, fill=0xffffff ){

		const g = new Graphics();
		g.interactive = false;
		g.buttonMode = false;

		g.moveTo(0,0);
		g.beginFill( fill );
		g.arc(0,0, radius, 0, arc );
		g.endFill();

		return g;

	}

	cutPoly( g, r=100, minArc=0, maxArc=2*Math.PI ){

		let p = this.randPoly();

		let t = minArc + Math.random()*(maxArc-minArc);
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
	randPoly( minPoints=3, maxPoints=4, minRadius=4, maxRadius=10 ){

		const len = randInt(minPoints, maxPoints );
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