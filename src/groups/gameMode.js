import { expLerp } from "./snowGroup";
import { EVT_LOSE, EVT_WIN, EVT_REPORT } from "../components/stats";
import CasualMode from "./casualMode";

const MIN_CHEER_RATE = -0.009;
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

		game.on( EVT_WIN, this.onWin, this );
		game.on( EVT_LOSE, this.onLose, this );

	}

	start() {
		super.start();
	}

	stop(){
		super.stop();
	}

	removeListeners(){
		this.game.removeListener( EVT_LOSE, this.onLose, this );
		this.game.removeListener( EVT_WIN, this.onWin, this );
	}

	onWin(){

		this.stop();

		this.stats.won = true;
		this.game.removeListener( EVT_WIN, this.onWin, this );

		this.game.emitter.emit( EVT_REPORT, this.mode );
		this.game.ui.showWin();

	}

	clickBg(e){
		this.stats.clicks++;
		this.stats.cheer += 0.05;
		this.flakes.mkFlake( e.data.global );
	}

	onLose(){

		this.stop();
		this.removeListeners();
		this.game.emitter.emit( EVT_REPORT, this.mode );
		this.game.ui.showLose();

	}

	update() {

		this.cheerRate = expLerp( MIN_CHEER_RATE, MAX_CHEER_RATE, this.stats.snow, 0.00001 );
		this.stats.cheer += this.cheerRate;

	}

	destroy(){

		this.removeListeners();
		super.destroy();
	}

}