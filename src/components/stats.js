import { Component } from "gibbon.js";

export const EVT_STAT = 'stat';
export const EVT_SNOW = 'snow';
export const EVT_CHEER = 'cheer';
export const EVT_LOSE = 'freeze';

export const EVT_PLAY = 'play';
export const EVT_WIN = 'win';
export const EVT_MENU = 'menu';

/**
 * report stats.
 */
export const EVT_REPORT = 'report';

export const EVT_PAUSE = 'pause';

export const EVT_HELP = 'help';

/**
 * Resume game in progress.
 */
export const EVT_RESUME = 'resume';

export const StatEvents = [
	EVT_SNOW,
	'magic',
	'stars',
	'specials'
];

export const ReportStats = [ 'snow', 'magics', 'stars', 'specials', 'clicks', 'glooms' ]
export const WIN_SNOW = 30000;

export const MAX_CHEER = 100.5;

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

	get cheer() { return this._cheer; }
	set cheer(v) {

		if ( v <= 0 ) {

			this.emitter.emit( EVT_LOSE, v );
			v = 0;

		} else if ( v > MAX_CHEER ) {
			v = MAX_CHEER;

		}
		this._cheer=v;

		let f = Math.floor(v);
		if ( f !== this._lastCheer ) {

			this._lastCheer = f;
			this.emitter.emit( EVT_CHEER, f );

		}

	}

	get won(){return this._won;}
	set won(v) { this._won = v;}

	get glooms(){return this._glooms;}
	set glooms(v){this._glooms=v}

	/**
	 * @property {number} clicks - user clicks.
	 */
	get clicks(){return this._clicks;}
	set clicks(v){this._clicks=v;}

	/**
	 * @property {number} magics - spawners clicked.
	 */
	get magics(){return this._magics;}
	set magics(v) {
		this._magics = v;
		this.emitter.emit( EVT_STAT, 'magics', v );
	}

	/**
	 * @property {number} stars - Number of shooting stars clicked.
	 */
	get stars() { return this._stars; }
	set stars(v) {
		this._stars = v;
		this.emitter.emit( EVT_STAT, 'stars', v );
	}

	get specials(){return this._specials; }
	set specials(v) {
		this._specials = v;
		this.emitter.emit( EVT_STAT, 'specials', v);

		if ( this._snow >= WIN_SNOW ) {
			this.emitter.emit( EVT_WIN );
		}

	}

	/**
	 * Reset stats.
	 */
	reset(){

		this._snow = 0;
		this._clicks = 0;
		this._magics = 0;
		this._stars = 0;
		this._specials = 0;
		this._glooms = 0;

		this._won = 0;

		this._lastCheer = 0;
		this._cheer = MAX_CHEER;

	}

	init(){

		this.emitter = this.game.emitter;
		this.reset();

	}

}