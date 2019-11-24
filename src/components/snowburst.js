import { Component } from "gibbon.js";
import ZMover from "./zmover";

/**
 * @const {number} PER_FRAME - maximum flakes to proc per frame.
 */
const PER_FRAME = 4;

export default class Snowburst extends Component {

	/**
	 *
	 * @param {Point} at
	 * @param {number} count - number of flakes to spawn.
	 */
	constructor( at, count ) {

		super();

		this.at = at;
		//this.group = group;
		this.count = count;


	}

	init() {
		this.factory = this.game.factory;
		this.stats = this.game.stats;
	}

	update(){

		let i = this.count < PER_FRAME ? this.count : PER_FRAME;
		this.count -= i;
		this.stats.count += i;

		while ( i-- > 0 ){

			var go = this.factory.mkSnowflake( this.at );
			this.engine.add(go);
			var mv = go.get(ZMover);

			mv.vz = 0.1 + 2*Math.random();
			mv.velocity.set( -2+4*Math.random(), -1.5+2*Math.random() );

		}

		if ( this.count <= 0 ) this.gameObject.Destroy();

	}

}