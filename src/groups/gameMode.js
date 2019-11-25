import { System } from "gibbon.js";
import { expLerp } from "./snowGroup";

const MIN_COLD_RATE = 0.009;
const MAX_COLD_RATE = 0.1;

/**
 * Play game as win/lose game.
 */
export default class GameMode extends System {

	/**
	 * @property {string} mode
	 */
	get mode(){ return 'game';}

	constructor( game ){

		super( game );

		this.stats = game.stats;
		this.coldRate = MIN_COLD_RATE;

	}

	start() {

		super.start();

		console.log('GAME MODE START');
	}

	update() {

		console.log('UPDATE');
		this.coldRate = expLerp( MIN_COLD_RATE, MAX_COLD_RATE, this.stats.snow );
		this.stats.cold += this.coldRate;

	}

}