import { System } from "gibbon.js";
import { Container } from "pixi.js";
import SnowGroup from "./snowGroup";
import { EVT_PAUSE, EVT_RESUME } from "../components/stats";

/**
 * Play game as win/lose game.
 */
export default class CasualMode extends System {

	/**
	 * @property {SnowGroup} flakes
	 */
	get flakes() {return this._flakes; }
	set flakes(v) { this._flakes =v;}

	/**
	 * @property {string} mode
	 */
	get mode(){ return 'casual';}

	constructor( game ){

		super( game );

		this.flakes = new SnowGroup( game, new Container() );
		this.addGroup( this.flakes );

		this.game.objectLayer.addChild( this.flakes.clip );

		this.game.sky.reset();

		this.stats = game.stats;
		this.stats.reset();

		this.uiView = game.ui.showGameView();
		this.uiView.reset( game.stats );
		this.uiView.hideCheer();

		game.on( EVT_RESUME, this.start, this );
		game.on( EVT_PAUSE, this.onpause, this );

	}

	start() {

		super.start();

		this.game.stage.interactive=true;
		this.game.stage.on( 'click', this.clickBg, this );

	}

	onpause() {

		this.game.ui.showPause();
		this.stop();

	}

	stop() {
		super.stop();
		this.game.stage.removeListener( 'click', this.clickBg, this );
	}


	clickBg(e){
		this.stats.clicks++;
		this.flakes.mkFlake( e.data.global );
	}

	destroy(){
		this.game.removeListener( EVT_RESUME, this.start, this );
		this.game.removeListener( EVT_PAUSE, this.onpause, this );
		super.destroy();
	}

}