import { System } from "gibbon.js";

/**
 * Play game as win/lose game.
 */
export default class CasualMode extends System {

	/**
	 * @property {string} mode
	 */
	get mode(){ return 'casual';}

	constructor( game ){

		super( game, clip );

		this.stats = game.stats;

	}

	start() {

		super.start();

	}

	update(){
	}

}