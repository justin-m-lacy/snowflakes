import { expLerp } from "./snowGroup";
import { EVT_LOSE, EVT_WIN, EVT_END, EVT_RESUME } from "../components/stats";
import CasualMode from "./casualMode";

const MIN_CHEER_RATE = -0.007;
const MAX_CHEER_RATE = -0.25;

/**
 * Lerp clamped below max.
 * @param {number} v0
 * @param {number} v1
 * @param {number} t
 */
export const maxLerp = (v0, v1, t ) => {

	t = t > 1 ? 1 : t;
	return (1-t)*v0 + t*v1;

}

const STATE_PLAY=1;
const STATE_WON=2;
const STATE_LOST=3;

/**
 * Play game as win/lose game.
 */
export default class GameMode extends CasualMode {

	/**
	 * @property {string} mode
	 */
	get mode(){ return 'game';}

	constructor( game ){

		super( game );

		this.cheerRate = MIN_CHEER_RATE;

		this.uiView.showCheer();

		game.on( EVT_RESUME, this.start, this );
		game.on( EVT_WIN, this.onWin, this );
		game.on( EVT_LOSE, this.onLose, this );

	}

	start() {
		super.start();
	}

	stop(){
		this.removeListeners();
		super.stop();
	}

	removeListeners(){
		this.game.removeListener( EVT_LOSE, this.onLose, this );
		this.game.removeListener( EVT_WIN, this.onWin, this );
	}

	clickBg(e){
		this.stats.clicks++;
		this.stats.cheer += 0.05;
		this.flakes.mkFlake( e.data.global );
	}

	onLose(){

		this.stop();
		this.game.ui.showLose();

	}

	onWin(){

		this.stop();

		this.game.emitter.emit( EVT_END );
		this.game.ui.showWin();

	}

	update() {

		this.cheerRate = expLerp( MIN_CHEER_RATE, MAX_CHEER_RATE, this.stats.snow, 0.00001 );
		this.stats.cheer += this.cheerRate;

	}

	destroy(){

		this.game.removeListener( EVT_RESUME, this.start, this );

		this.removeListeners();
		super.destroy();
	}

}