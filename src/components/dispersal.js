import { Component } from "gibbon.js";
import SnowGroup, { expLerp } from "../groups/snowGroup";
import ZMover from "./zmover";
import ZBound from "./zbound";

/**
 * @property {number} MAX_BURSTS - max bursts per frame.
 */
const MAX_BURSTS = 1;

export default class Dispersal extends Component {

	/**
	 *
	 * @param {SnowGroup} group
	 */
	constructor( group ){

		super();

		this.flakes = group.objects;

		// max count of flakes to destroy.
		this.count = this.flakes.length;

		this.snowGroup = group;

		// frame between flake bursts.
		this.wait = 2;
		this.t = 0;

		/**
		 * @property {number} flakesPer - flakes awarded per burst.
		 */
		this.flakesPer = Math.min( Math.ceil( this.count / 9 ), 8 );

	}

	init() {
		//console.log('INIT COUNT: ' + this.flakes.length );
		this.factory = this.game.factory;
		this.stats = this.game.stats;
		this.coldRate = -expLerp( 0.2, 2, this.stats.specials, 0.001 );
	}

	burst(p) {

		// constant visual per burst.
		for( let i = 3; i > 0; i-- ) {

			var go = this.factory.mkSnowflake( p.position );
			this.engine.add(go);
			var mv = go.get(ZMover);
			go.addExisting( new ZBound(mv, 1 + 2*Math.random()), ZBound );
			mv.velocity.set( -2.5+5*Math.random(), -1.75+3*Math.random() );

		}

		p.Destroy();

	}

	update(){

		if ( this.t-- > 0 ) return;
		this.t = this.wait;

		// total added to stat.
		let snowTot = 0;

		let len = Math.min(MAX_BURSTS, this.flakes.length, this.count );

		for( let i = 0; i < len; i++ ) {

			var go = this.flakes[i];
			if (!go ){
				console.warn('invalid obj: ' + go );
			} else if ( go.destroyed ) {
				console.log('obj destroyed: ' + go );
				//len++;
				//if ( len > this.flakes.length ) break;
			} else {

				//console.log('BURST AT: ' + i );
				this.burst(go);
				snowTot += this.flakesPer;
				this.count--;
			}


		}

		this.stats.snow += snowTot;
		this.stats.cold += this.coldRate*snowTot;
		if ( this.count <= 0 ) {
			this.burst(this.gameObject);
		}

	}

	destroy(){
		this.snowGroup = null;
		this.flakes = null;
	}

}