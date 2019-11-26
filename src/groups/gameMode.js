import { System } from "gibbon.js";
import { expLerp } from "./snowGroup";
import { EVT_FREEZE, EVT_WIN } from "../components/stats";

/**
 * Amount of snow which represents winning the game.
 */
const MAX_SNOW = 30000;
const MIN_COLD_RATE = 0.007;
const MAX_COLD_RATE = 0.25;

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
export default class GameMode extends System {

	/**
	 * @property {SnowGroup} flakes
	 */
	get flakes() {return this._flakes; }
	set flakes(v) { this._flakes =v;}

	/**
	 * @property {string} mode
	 */
	get mode(){ return 'game';}

	constructor( game ){

		super( game );

		this.stats = game.stats;
		this.coldRate = MIN_COLD_RATE;

		this.flakes = new SnowGroup( this, this.objectLayer );
		this.addGroup( this.flakes );

		game.emitter.on(EVT_FREEZE, this.onLose, this );
		game.emitter.on(EVT_WIN, this.onWin, this );

		this.uiView = game.ui.showGameView();


	}

	start() {

		super.start();

		this.flakes.start();
		this.game.stage.interactive=true;
		this.game.stage.on( 'click', this.clickBg, this );

	}

	destroy(){
		super.destroy();
		this.game.stage.removeListener( 'click', this.clickBg, this );
	}

	clickBg(e){
		this.stats.clicks++;
		this.stats.cold -= 0.05;
		this.flakes.mkFlake( e.data.global );
	}

	onLose(){

		this.removeListeners();
		this.game.ui.showLose();

	}

	onWin(){
		this.removeListeners();
		this.game.ui.showWin();
	}

	removeListeners(){
		this.game.emitter.removeListener( EVT_FREEZE, this.onLose, this );
		this.game.emitter.removeListener( EVT_WIN, this.onWin, this );
	}

	update() {

		this.coldRate = expLerp( MIN_COLD_RATE, MAX_COLD_RATE, this.stats.snow, 0.00001 );
		this.stats.cold += this.coldRate;

	}

}