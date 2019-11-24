import { Component } from "gibbon.js";

export const StatEvents = [
	'snowflakes',
	'spawners',
	'comets',
	'specials'
];

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
		this.emitter.emit('mk-flake', v );
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
	set spawners(v) {
		this._spawners = v;
		this.emitter.emit('spawner', v );
	}

	get comets() { return this._comets; }
	set comets(v) {
		this._comets = v;
		this.emitter.emit('comet', v );
	}

	get specials(){return this._specials; }
	set specials(v) {
		this._specials = v;
		this.emitter.emit('special', v);
	}

	init(){

		this.emitter = this.game.emitter;

		this._count = 0;
		this._clicks = 0;
		this._spawners = 0;
		this._comets = 0;
		this._specials = 0;

	}

}