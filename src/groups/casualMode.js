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

		super( game );

		this.flakes = game.flakes;
		this.stats = game.stats;

		this.uiView = game.ui.showGameView();

	}

	destroy(){
		super.destroy();
		this.game.stage.removeListener( 'click', this.clickBg, this );
	}

	start() {

		super.start();

		this.flakes.start();
		this.game.stage.interactive=true;
		this.game.stage.on( 'click', this.clickBg, this );

	}


	clickBg(e){
		this.stats.clicks++;
		this.stats.cold -= 0.05;
		this.flakes.mkFlake( e.data.global );
	}

	update(){
	}

}