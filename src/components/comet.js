import { Component } from "gibbon.js";
import { quickSplice } from "gibbon.js/utils/arrayUtils";
import Particle from "../data/particle";
import ZMover from "./zmover";

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
		this.parent = this.clip.parent;

		/**
		 * @property {SnowFactory}
		 */
		this.factory = this.game.factory;

		var mover = this.mover = this.get( ZMover );
		mover.z = mover.world.randZ();

	}

	update(){

		// create spark.
		var p = new Particle( this.factory.makeSpark(), this.clip.position, -0.5+1*Math.random(), -.75+1*Math.random(), 0.01 );
		p.da = -FADE_RATE;
		this.parts.push(p);
		this.parent.addChild(p.clip);

		var a = this.parts;
		for( let i = a.length-1; i>= 0; i-- ) {

			p = this.parts[i];
			p.update();

			if ( p.clip.alpha <= 0) {
				quickSplice( this.parts, i );
				p.destroy();
			}

		}

	}

	destroy(){

		for( let i = this.parts.length-1; i>=0; i--){
			this.parts[i].destroy();
		}
		this.parts = null;

	}

}