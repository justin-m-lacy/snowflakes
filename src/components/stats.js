import { Component } from "gibbon.js";

export const EVT_STAT = 'stat';
export const EVT_SNOW = 'snow';
export const EVT_COLD = 'cold';
export const EVT_FREEZE = 'freeze';

export const StatEvents = [
	EVT_SNOW,
	'magic',
	'comets',
	'specials'
];

const MAX_COLD = 100;

/**
 * Stats to share a values across multiple components/objects.
 */
export default class Stats extends Component {

	/**
	 * @property {number} snow - total snowflake count.
	 */
	get snow() { return this._snow;}
	set snow(v) {
		this._snow = v;
		this.emitter.emit( EVT_STAT, EVT_SNOW, v );
		this.emitter.emit( EVT_SNOW, v );
	}

	get cold() { return this._cold; }
	set cold(v) {

		if ( v < 0 ) v = 0;
		else if ( v >= MAX_COLD ) {
			v = MAX_COLD;
			this.emitter.emit( EVT_FREEZE, v );
		}
		this._cold=v;

		let f = Math.floor(v);
		if ( f !== this._lastCold ) {

			this._lastCold = f;
			this.emitter.emit( EVT_COLD, f );

		}

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
		this.emitter.emit( EVT_STAT, 'magic', v );
	}

	get comets() { return this._comets; }
	set comets(v) {
		this._comets = v;
		this.emitter.emit( EVT_STAT, 'comets', v );
	}

	get specials(){return this._specials; }
	set specials(v) {
		this._specials = v;
		this.emitter.emit( EVT_STAT, 'specials', v);
	}

	/**
	 * Reset stats.
	 */
	reset(){

		this._snow = 0;
		this._clicks = 0;
		this._spawners = 0;
		this._comets = 0;
		this._specials = 0;

		this._lastCold = 0;
		this._cold = 0;

	}

	init(){

		this.emitter = this.game.emitter;
		this.reset();

	}

}