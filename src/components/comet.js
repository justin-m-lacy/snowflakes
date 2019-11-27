import { Component } from "gibbon.js";
import { quickSplice } from "gibbon.js/utils/arrayUtils";
import Particle from "../data/particle";
import ZMover from "./zmover";
import { ParticleContainer } from "pixi.js";
import { TYP_COMET } from "../groups/snowGroup";

/**
 * spark alpha fade per frame.
 */
const FADE_RATE = 0.01;

export default class Comet extends Component {

	init(){

		/**
		 * @property {Particle[]} parts - particles.
		 */
		this.parts = [];

		/**
		 * @note clip must have parent at this point.
		 */
		this.parent = this.clip.parent.addChild( new ParticleContainer() );

		this.view = this.game.screen;

		this.gameObject.flags = TYP_COMET;
		this.clip.interactive = true;
		/**
		 * @property {SnowFactory}
		 */
		this.factory = this.game.factory;

		var mover = this.mover = this.require( ZMover );
		mover.z = 12*Math.random();

		this.parent.zIndex = this.clip.zIndex;
		this._fading = false;


	}

	setVelocity( vx, vy ){
		this.mover.velocity.set( vx, vy );
		this.mover.omega = this.mover.velocity.x/14;
		if ( vx < 0) this.mover.baseScale = -this.mover.baseScale;
	}

	fadeOut(){
		this._clip.visible = false;
		this.clip.interactive = false;
		this._fading = true;
	}

	update(){

		if ( !this._fading ) {

			if ( this.clip.x + 20 < 0 || this.clip.x -20 > this.view.right ) this._fading = true;

			var p = new Particle( this.factory.makeSpark(),
				this.clip.position.x+ (0.5-1*Math.random())*this.clip.width, this.clip.position.y + (0.5-1*Math.random())*this.clip.height,
				-0.5+1*Math.random(), -.5+0.5*Math.random(), 0.005 );

			p.da = -FADE_RATE;
			this.parts.push(p);
			this.parent.addChild(p.clip);

		}

		var a = this.parts;
		for( let i = a.length-1; i>= 0; i-- ) {

			p = a[i];
			p.update();

			if ( p.clip.alpha <= 0) {
				quickSplice( a, i );
				p.destroy();
				if ( this._fading && a.length === 0 ) this.gameObject.Destroy();
			}

		}

	}

	destroy(){

		this.parent.destroy();

		for( let i = this.parts.length-1; i>=0; i--){
			this.parts[i].destroy();
		}
		this.parts = null;

	}

}