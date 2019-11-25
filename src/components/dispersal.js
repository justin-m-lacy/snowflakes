import { Component } from "gibbon.js";
import SnowGroup from "../groups/snowGroup";
import ZMover from "./zmover";

/**
 * @property {number} MAX_BURSTS - max bursts per frame.
 */
const MAX_BURSTS = 3;

export default class Dispersal extends Component {

	/**
	 *
	 * @param {SnowGroup} group
	 */
	constructor( group ){

		super();

		this.flakes = group.objects;
		this.bursts = burst;

		// max index at time of dispersal.
		this.max = this.flakes.length;
		this.index = 0;

		this.group = group;

		/**
		 * @property {number} flakesPer - flakes per burst.
		 */
		this.flakesPer = 3;

	}

	init() {
		this.factory = this.game.factory;
		this.stats = this.game.stats;

		/**
		 * @property {number} burstId
		 */
		this.burstId = burst;

		this.burstId = this.stats.specials;
		this.markFlakes( this.flakes, this.burstId );

	}

	markFlakes( flakes, id ) {

		for( let i = flakes.length-1; i>= 0; i-- ) {
			flakes[i].burst = id;
		}

	}

	burst(p) {

		for( let i = this.flakesPer; i > 0; i-- ) {

			var go = this.factory.mkSnowflake( p.position );
			this.engine.add(go);
			var mv = go.get(ZMover);

			mv.vz = 0.1 + 2*Math.random();
			mv.velocity.set( -2.5+5*Math.random(), -1.75+3*Math.random() );

		}

	}

	update(){

		let max = Math.min( this.max, this.flakes.length, this.index+MAX_BURSTS );
		for( let i = this.index; i < max; i++ ) {

			var go = this.flakes[i];
			if ( go.burst == this.burstId ) {
				this.burst(go);
			}

		}

		this.index += MAX_BURSTS
		if ( this.index >= this.max || this.index >= this.flakes.length ) {
			this.gameObject.Destroy();
		}

	}

}