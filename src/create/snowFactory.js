import { Graphics, DEG_TO_RAD, Polygon, Point } from "pixi.js";
import Gibbon, { Factory, Geom } from "../../../gibbon";

const { randInt, randRange} = Gibbon.Rand;
const { move, setReflect, reflection, interPt } = Gibbon.Geom;

import * as PIXI from 'pixi.js';


/**
 * @const {number} HOLE_COLOR - Pixi holes have a lot of limitations.
 * Should be easier to draw regular colors and transform on copy.
 */
const HOLE_COLOR = 0xFF0000;

const FLAKE_COLOR = 0xffffff;

const MIN_RADIUS = 50;
export const MAX_RADIUS = 80;


/**
 * @property {number} FLAKE_SIZE - base flake size.
 */
export const FLAKE_RADIUS = 32;

/**
 * Min/max arc gap as percent of arc.
 */
const MIN_GAP = 0.08;
const MAX_GAP = 0.3;

const MIN_SEGS = 6;
const MAX_SEGS = 6;

/**
 * Minimum/maximum cuts to make in flake arc.
 */
const MIN_CUTS = 2;
const MAX_CUTS = 4;

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

		//this.drawTex = PIXI.RenderTexture.create()
		//this.baseArc = this.makeArc( 2*Math.PI/MAX_SEGS );
		this.maskArc = this.fillArc( 0, 2*Math.PI/MAX_SEGS, MAX_RADIUS );

	}

	createFlake( loc ){

		const sprite = new PIXI.Sprite();
		sprite.interactive = true;
		//sprite.buttonMode = true;

		if (!loc) loc = new Point();
		sprite.position.set( loc.x, loc.y );

		let r = MAX_RADIUS;
		const tex = this.makeFlakeTex( r, randInt( MIN_SEGS, MAX_SEGS ) );
		sprite.texture = tex;
		sprite.pivot = new Point( r, r);
		sprite.rotation = Math.PI*Math.random();

		sprite.scale = new Point( FLAKE_RADIUS/r, FLAKE_RADIUS/r );

	//	sprite.addChild(g);

		return sprite;

	}

		/**
	 * @param {*} r
	 * @param {*} segs
	 */
	makeFlakeTex( r, segs ){

		if ( (segs % 2) !== 0 ) segs++;

		let arc=2*Math.PI/segs;
		let tex = PIXI.RenderTexture.create( 2*r, 2*r );

		let g = this.drawArc( r, arc );

		let mat = new PIXI.Matrix();
		mat.translate(r,r);

		var theta = 0;
		for( let i = 0; i < segs; i++ ) {

			if ( i%2 === 0){
				g.rotation = theta;
				g.scale = new Point(1,1);
			} else {
				g.scale = new Point(1,-1);
				g.rotation = -(theta + arc);

			}

			this.renderer.render( g, tex, false, mat );
			theta += arc;

		}

		return tex;

	}

	drawArc( r, arc ){

		const c = new PIXI.Container();
		let g = new Graphics();
		g.mask = this.maskArc;

		this.branch( g, new Point(0,0), arc/2, r, Math.random() < 0.5 ? -1 : 1 );
		//this.arcItems(g, r, arc );

		c.addChild(this.maskArc );
		c.addChild(g);


		return c;

	}

	branch( g, p0, angle, maxR, parity=0 ) {

		g.moveTo( p0.x, p0.y );

		var subR = ( 0.2 + 0.2*Math.random() )*maxR;
		var p1 = new Point( p0.x + subR*Math.cos(angle), p0.y + subR*Math.sin(angle) );

		g.lineStyle( (0.02 + 0.1*Math.random())*MAX_RADIUS, FLAKE_COLOR );

		this.drawShape(g, p1, subR/2 );

		//g.lineTo( p1.x, p1.y );
		if ( subR <= 8 ) return;

		var a2 = angle + ( 20 + 20*Math.random()*DEG_TO_RAD );
		if ( parity < 0 ) a2 = -a2;

		let t = 0.4 + 0.8*Math.random();
		//this.branch( g, interPt( p0, p1, t ), angle, (1-t)*maxR );
		this.branch( g, interPt( p0, p1, t ), a2, maxR -subR, Math.random() < 0.5 ? -1 : 1  );
		//this.branch( g, interPt( p0, p1, t ), -a2, maxR - subR );

		if ( maxR - subR > 4 ) {
			this.branch(g, p1, angle, maxR-subR, -parity );
		}


	}

	drawShape( g, p, size ) {
		g.lineTo(p.x,p.y);
		return;
		var n = Math.random();
		if ( n < 0.2 ) {

			g.drawShape( new PIXI.Ellipse(p.x,p.y,size, size ) );

		} else if ( n < 0.4 ) {

			g.drawShape( new PIXI.RoundedRectangle(p.x,p.y, size, 1.5*size, Math.random()*size/4 ) );

		} else if ( n < 0.5 ) {

			g.drawCircle( p.x, p.y, size );

		} else if ( n < 0.6 ) {

			g.drawRect( new PIXI.Rectangle( p.x, p.y, size, size ) );
		} else {

			g.lineTo(p.x,p.y);
		}

	}

	/**
	 *
	 * @param {*} g
	 * @param {*} p0
	 * @param {*} p1
	 * @param {number} rem - radius remaining.
	 */
	drawBranch( g, p0, p1, rem ) {

		g.lineStyle( 0.1*rem, FLAKE_COLOR );
		g.lineTo(p1.x, p1.y);

		if ( rem <= 0 ) return;

		var dx = p1.x - p0.x;
		var dy = p1.y - p0.y;

		const p2 = interPt( p0, p1, 0.4 + 0.6*Math.random() );


	}

		/**
	 * Result: flakes look overly circular.
	 * @param {*} g
	 * @param {*} radius
	 * @param {*} arc
	 */
	arcItems( g, radius, arc ) {

		let r = 0;

		var p = new Point(0,0);

		do {

			var a = arc/2;
			var s = 1 + r*arc;
			var len = s;

			g.moveTo(r*Math.cos(arc/2), r*Math.sin(arc/2) );

			do {

				g.lineStyle( 0.02 + 0.1*Math.random()*radius, FLAKE_COLOR );

				var size = 1 + Math.random()*0.8*len;

				p.set( r*Math.cos(a), r*Math.sin(a) );

				this.drawShape(g,p,size);

				a += 0.2*arc;
				s -= 0.2*radius;

			} while ( s >= 0 );

			r += 0.01 + (0.5 + 0.5*Math.random() )*len;

		} while ( r < radius );

	}

	/**
	 * Form arc by cutout methods.
	 * @param {number} fill
	 * @param {number} alpha
	 * @returns {PIXI.DisplayObject}
	 */
	cutoutArc( radius=100, maxArc=360/16, fill=0xffffff ) {

		const clip = new PIXI.Container();

		let gap = randRange( MIN_GAP, MAX_GAP );
		let minArc = gap*maxArc;
		maxArc -= minArc;

		const base = this.fillArc( minArc, maxArc, radius, fill );

		const cut = new Graphics();
		cut.blendMode = PIXI.BLEND_MODES.ERASE;

		//this.randArcCuts( cut, minArc, maxArc, radius );
		this.randArcCuts( cut, minArc, maxArc, radius );
		this.randArcCuts( cut, minArc, maxArc, radius );
		//this.cutArc(cut, minArc, maxArc, radius );
		//this.cutArc(cut, maxArc, minArc, radius );

		clip.addChild( base );
		clip.addChild(cut);

		return clip;

	}

	/**
	 * Fill an arc of a circle.
	 * @param {*} minArc
	 * @param {*} arc
	 * @param {*} radius
	 * @param {*} fill
	 */
	fillArc( minArc, arc, radius=100, fill=0xffffff ){

		const g = new Graphics();
		g.interactive = false;
		g.buttonMode = false;

		g.moveTo(0,0);
		g.beginFill( fill );
		g.arc(0,0, radius, minArc, arc );
		g.endFill();

		return g;

	}

	/**
	 * Make cuts anywhere along the interior of an arc.
	 * @param {*} g
	 * @param {*} minArc
	 * @param {*} maxArc
	 * @param {*} radius
	 */
	randArcCuts( g, minArc, maxArc, radius ) {

		let r = 0.01;
		let halfArc = (maxArc+minArc)/2;

		while ( r <= 1.4 ) {

			var s = r;

			while ( s >= 0 ) {

				var a = randRange( minArc, halfArc );
				g.moveTo( r*Math.cos(a)*radius, r*Math.sin(a)*radius );

				g.beginFill( HOLE_COLOR );

				a = randRange( halfArc, maxArc);
				var r2 = r + 0.4*Math.random();
				g.lineTo( r2*Math.cos(a)*radius, r2*Math.sin(a)*radius );

				a = randRange(minArc, maxArc);
				r2 = r + 0.2 + 0.2*Math.random();
				g.lineTo( r2*Math.cos(a)*radius, r2*Math.sin(a)*radius);

				if ( Math.random() < 0.7 ) {
					a = randRange(minArc, maxArc);
					r2 = r + 0.05 + 0.2*Math.random();
					g.lineTo( r2*Math.cos(a)*radius, r2*Math.sin(a)*radius);
				}

				g.closePath();
				g.endFill();

				s -= 0.12;

			}

			// next r.
			r += r2;

		}

	}

	/**
	 * Make cuts along the edge of an arc.
	 * @param {Graphics} g
	 * @param {number} minArc
	 * @param {number} maxArc
	 * @param {*} radius
	 */
	cutArc( g, minArc, maxArc, radius ) {

		let r = 0.025;

		// premultiply radius
		var cos1 = radius*Math.cos(minArc);
		var sin1 = radius*Math.sin(minArc);

		while ( r <= 1.2 ) {

			var dr = r + 0.1 + 0.4*Math.random();

			var a = randRange( minArc, maxArc );
			var rmid = radius * ( r + 0.3*Math.random() );	// premultiply.

			g.beginFill( HOLE_COLOR );
			g.drawPolygon( [r*cos1, r*sin1,
						(dr)*cos1, (dr)*sin1,
						rmid*Math.cos(a), rmid*Math.sin(a)] );
			g.endFill();

			r = dr;

		}

	}

	/**
	 * Cut (draw) a random polygon from a graphic.
	 * @param {*} g
	 * @param {*} r
	 * @param {*} minArc
	 * @param {*} maxArc
	 */
	cutPoly( g, r=100, minArc=0, maxArc=2*Math.PI ){

		let p = this.randPoly();

		let t = minArc + Math.random()*(maxArc-minArc);
		r = Math.random()*r;

		move( p, r*Math.cos(t), r*Math.sin(t) );

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

	// sprite swap reflect.
	/*flakeTex( r=100, segs=16 ){

		if ( segs % 2 !== 0 ) segs++;

		let arc=DEG_TO_RAD*(360/segs)
		let tex1 = PIXI.RenderTexture.create( 2*r, 2*r );
		let tex2 = PIXI.RenderTexture.create( 2*r, 2*r );

		let s1 = new PIXI.Sprite(tex1);
		let s2 = new PIXI.Sprite(tex2);

		let gap = Math.random() < 0.5 ? 0 : randRange( MIN_GAP, MAX_GAP );
		let g = this.makeSnowArc( r, arc*(1-gap) );

		let mat = new PIXI.Matrix();
		mat.translate(r,r);
		this.renderer.render(g, tex1, false,mat );

		var s3, tex3;
		for( let i = 1; i <4; i *=2 ) {

			var a = Math.cos(arc);
			var b = Math.sin(arc);
			setReflect(mat, a, b );
			arc*=2;

			this.renderer.render( s1, tex2, false, mat );
			tex3 = tex2;
			s3 = s1;

			s1 = s2;
			tex2 = tex1;

			s2 = s3;
			tex1 = tex3;


		}
		return tex1;

	}*/

}