import { Component } from "gibbon.js";
import SnowGroup from "../groups/snowGroup";
import ZMover from "./zmover";

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

		/**
		 * @property {number} flakesPer - flakes per burst.
		 */
		this.flakesPer = Math.min( Math.ceil( this.count / 5 ), 8 );

	}

	init() {
		console.log('INIT COUNT: ' + this.flakes.length );
		this.factory = this.game.factory;
		this.stats = this.game.stats;
	}

	burst(p) {

		for( let i = this.flakesPer; i > 0; i-- ) {

			var go = this.factory.mkSnowflake( p.position );
			this.engine.add(go);
			var mv = go.get(ZMover);

			mv.vz = 0.1 + 2*Math.random();
			mv.velocity.set( -2.5+5*Math.random(), -1.75+3*Math.random() );

		}

		p.Destroy();

	}

	update(){

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

				console.log('BURST AT: ' + i );
				this.burst(go);
				snowTot += this.flakesPer;
				this.count--;
			}


		}

		this.stats.count += snowTot;
		if ( this.count <= 0 ) {
			this.burst(this.gameObject);
		}

	}

	destroy(){
		this.snowGroup = null;
		this.flakes = null;
	}

}