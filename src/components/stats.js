import { Component } from "gibbon.js";

/**
 * Stats to share a values across multiple components/objects.
 */
export default class Stats extends Component {

	/**
	 * @property {number} count - total snowflake count.
	 */
	get count() { return this._count;}
	set count(v) {

		this._count = v;
		this.game.emitter.emit('snow-count', v );

	}

	/**
	 * @property {number} clicks - user clicks.
	 */
	get clicks(){return this._clicks;}
	set clicks(v){this._clicks=v;}

	/**
	 * @property {number} spawners - spawners clicked.
	 */
	get spawners(){return this._spawners;}
	set spawners(v) { this._spawners = v; }

	init(){

		this._count = 0;
		this._clicks = 0;
		this._spawners = 0;

	}

}