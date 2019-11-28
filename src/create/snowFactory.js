import { Graphics, DEG_TO_RAD, Polygon, Point } from "pixi.js";
import Gibbon, { Factory, Geom, GameObject } from "../../../gibbon";

const { randInt, randRange} = Gibbon.Rand;

import * as PIXI from 'pixi.js';
import { setLerp, lerpPt } from "gibbon.js/utils/geom";
import Flake from "../components/flake";
import Comet from '../components/comet';
import ZMover from "../components/zmover";
import GloomFlake from "../components/gloomFlake";


/**
 * @const {number[]} CometColors - array of colors for comet particles.
 */
export const CometColors = [ 0xe8e5c1, 0xdeda68, 0xe6e4be, 0xf0e518 ];

/**
 * @const {number[]} FrostColors - array of colors for comet particles.
 */
export const FrostColors = [ 0x4287f5, 0x8bb2f0, 0xa2c4fa, 0xc1c3e8];

/**
 * @const {number} COMET_SIZE - base comet radius.
 */
const COMET_R = 5;

/**
 * @const {number} COMET_COLOR - Color of shooting stars.
 */
//const COMET_COLOR = 0xe8c21a;
const COMET_HIT = new PIXI.Rectangle( -42, -20, 64, 40 );


const FLAKE_COLOR = 0xffffff;

const DRAW_RADIUS = 64;

/**
 * @property {number} FLAKE_SIZE - base flake size.
 */
export const FLAKE_RADIUS = 32;

/**
 * @property {const} SPARK_SIZE - radius for spark particles.
 */
const SPARK_R = 2;



/**
 * @const {number} BASE_SCALE - base scale of snowflake sprite
 * before any depth scaling is applied.
 */
export const BASE_SCALE = FLAKE_RADIUS/DRAW_RADIUS;

/**
 * @const {number} MIN_SEGS - each segment is actually
 * half a snowflake arm.
 */
//const MIN_SEGS = 12;
const MAX_SEGS = 12;

/**
 * @const {Matrix} tempMat - reusable Matrix.
 */
const tempMat = new PIXI.Matrix();
/**
 * @const {Point} tempPt - reusable drawing point.
 */
const tempPt = new Point();


/**
 * @const {Graphics} tmpGraphics - graphics used for drawing.
 */
const tmpGraphics = new Graphics();

/**
 * @const {Container} tmpContainer - container used for drawing.
 */
const tmpContainer = new PIXI.Container();
tmpContainer.addChild( tmpGraphics);


/**
 * Get the length of an arc of angle theta
 * at distance r.
 * @param {number} theta
 * @param {number} r
 */
export const arcLen = ( theta, r ) => {
	return r*theta;
}

export default class SnowFactory extends Factory {

	constructor( game ){

		super(game);

		tmpGraphics.mask = this.fillArc( 0, 2*Math.PI/MAX_SEGS, DRAW_RADIUS );
		tmpContainer.addChild( tmpGraphics.mask );

		this.initTextures();

		this.addCreator( 'comet', this.mkComet );
		this.addCreator('flake', this.mkSnowflake);

	}


	/**
	 * @param {Point} pt
	 * @returns {GameObject}
	 */
	mkComet(pt) {

		let s = PIXI.Sprite.from(this.cometTex );
		s.alpha = 0.75;
		//s.cacheAsBitmap = true;

		//s.tint = randElm( CometColors );
		s.scale.set(1.4);
		s.anchor.set(0.5, 0.5);

		s.hitArea = COMET_HIT;

		let obj = new GameObject( s, pt );
		obj.setDestroyOpts(true,false,false);

		obj.add(ZMover);
		obj.add(Comet);

		return obj;

	}

	mkGloom( pt ){

		let s = this.flakeDisplay(pt);
		let g = new GameObject(s);
		g.setDestroyOpts(true,true,true);
		g.add(Flake);
		g.add(GloomFlake);

		return g;

	}

	/**
	 * @param {Point} pt
	 * @returns {GameObject}
	 */
	mkSnowflake( pt ){

		let s = this.flakeDisplay(pt);
		//s.cacheAsBitmap = true;
		let g = new GameObject(s);
		g.setDestroyOpts(true,true,true);

		g.add( Flake);

		return g;

	}

	flakeDisplay( loc ){

		let r = DRAW_RADIUS;
		const tex = this.mkFlakeTex( r, MAX_SEGS );

		const sprite = new PIXI.Sprite();
		sprite.interactive = false;

		sprite.position.set( loc.x, loc.y );

		sprite.texture = tex;
		sprite.anchor.set(0.5);
		//sprite.pivot = new Point( r, r );
		sprite.rotation = Math.PI*Math.random();

		sprite.scale.set( BASE_SCALE, BASE_SCALE );

		return sprite;

	}

	/**
	 * @param {number} r
	 * @param {number} segs
	 */
	mkFlakeTex( r, segs ){

		if ( (segs % 2) !== 0 ) segs++;

		let arc=2*Math.PI/segs;
		let tex = PIXI.RenderTexture.create( 2*r, 2*r );

		let g = this.drawArc( r );

		let mat = tempMat;
		mat.set( 1, 0, 0, 1, r, r );

		let theta = 0;
		this.renderer.render(g,tex,false, mat);

		for( let i = 1; i < segs; i++ ) {

			theta += arc;

			if ( i%2 === 0){
				g.rotation = theta;
				g.scale.set(1,1);
			} else {
				g.scale.set(1,-1);
				g.rotation = -(theta + arc);

			}

			this.renderer.render( g, tex, false, mat );

		}

		return tex;

	}

	drawArc( r ){

		tmpContainer.rotation = 0;
		tmpContainer.scale.set(1,1);

		let g = tmpGraphics;

		//let s = randRange(0.7,1);
		//this.maskArc.scale.set( s,s )

		tempPt.set(0,0);
		g.clear();

		// central shape.
		this.drawSolid( g, tempPt, (0.01 + 0.09*Math.random())*r );

		this.branch( g, tempPt, 0, 1.4*r );
		//this.arcItems(g, r, arc );

		return tmpContainer;

	}

	branch( g, p0, angle, maxR ) {

		g.moveTo( p0.x, p0.y );

		let subR = ( 0.12 + 0.09*Math.random() )*maxR;
		/*if ( subR <= 8 ) { subR = maxR; }*/

		let p1 = new Point( p0.x + subR*Math.cos(angle), p0.y + subR*Math.sin(angle) );

		g.lineStyle( (0.02 + 0.05*Math.random())*DRAW_RADIUS, FLAKE_COLOR );
		this.drawShape(g, p1, subR );

		if ( maxR < DRAW_RADIUS && subR <= 8 ) return;

		setLerp( p0, p1, 0.4 + 0.8*Math.random() );

		this.branch( g, p0,
			angle + ( Math.random() < 0.5 ? -1 : 1 ) *(33 + 33*Math.random()*DEG_TO_RAD ),
			(0.8+0.2*Math.random())*(maxR -subR)  );

		if ( maxR - subR > 8 ) {
			this.branch(g, p1, angle, maxR-subR );
		}


	}

	drawSolid( g, p, size ) {

		g.beginFill(FLAKE_COLOR);

		var n = Math.random();
		if ( n < 0.25 ) {

			g.drawShape( new PIXI.Ellipse(p.x,p.y, (0.5 + Math.random())*size, (0.5 + Math.random())*size ) );

		} else if ( n < 0.5 ) {

			g.drawShape( new PIXI.RoundedRectangle(p.x,p.y,
				(0.5 + Math.random())*size, (0.5 + Math.random())*size, Math.random()*size/8 ) );

		} else if ( n < 0.75 ) {

			g.drawStar( p.x, p.y, MAX_SEGS, size, size/2 );
		} else {

			g.drawRect( new PIXI.Rectangle( p.x, p.y, (0.5 + Math.random())*size, (0.5 + Math.random())*size ) );
		}
		g.endFill();

	}

	drawShape( g, p, size ) {

		//if ( size < 4 ) size = 4;
		var n = Math.random();
		if ( n < 0.09 ) {

			g.drawShape( new PIXI.Ellipse(p.x,p.y, (0.5 +0.3* Math.random())*size,(0.5 + 0.3*Math.random())*size ) );

		} else if ( n < 0.23 ) {

			g.drawShape( new PIXI.RoundedRectangle(p.x,p.y, (0.5 +1* Math.random())*size, (0.5 +1*Math.random())*size, Math.random()*size/8 ) );

		} else if ( n < 0.27 ) {

			g.drawCircle( p.x, p.y, (0.7+0.3*Math.random())*size );

		} else if ( n < 0.33 ) {

			g.drawRect( new PIXI.Rectangle( p.x, p.y, (0.7 +1* Math.random())*size,(0.7 + 1*Math.random())*size ) );
		}else {
			g.lineTo( p.x, p.y );

		}

	}

	initTextures(){

		this.makeCometTex();
		this.makeSparkTex();

	}

	makeCometTex(){

		let g = tmpGraphics;

		g.clear();
		g.beginFill( 0xffffff );
		g.drawStar( COMET_R, COMET_R, 5, COMET_R );
		g.endFill();
		//g.cacheAsBitmap=true;

		this.cometTex = this.makeTex(g);

	}


	makeSparkTex() {

		const g = tmpGraphics;

		g.clear();

		g.beginFill( 0xffffff );
		g.drawStar( SPARK_R, SPARK_R, 3, SPARK_R, SPARK_R/2 );
		g.endFill();

		this.sparkTex = this.makeTex(g);


	}

	makeTex( g ){

		let bm = PIXI.RenderTexture.create( {width:g.width, height:g.height });

		this.renderer.render( g, bm );

		return bm;

	}

	makeSpark() {

		let s = new PIXI.Sprite( this.sparkTex );
		s.tint = CometColors[ randInt(0, CometColors.length-1 ) ];
		return s;

	}

	/**
	 * Fill an arc of a circle.
	 * @param {number} minArc
	 * @param {number} arc - total angle of arc
	 * @param {number} radius
	 * @param {number} fill
	 */
	fillArc( minArc, arc, radius=100, fill=0xffffff ){

		const g = new Graphics();

		g.moveTo(0,0);
		g.beginFill( fill );
		g.arc(0,0, radius, minArc, arc );
		g.endFill();

		return g;

	}

}