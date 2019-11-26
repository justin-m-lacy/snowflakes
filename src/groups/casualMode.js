import { System } from "gibbon.js";
import { Container } from "pixi.js";
import SnowGroup from "./snowGroup";

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

		this.stats = game.stats;

		this.uiView = game.ui.showGameView();
		this.uiView.hideCold();

	}

	start() {

		super.start();

		this.game.stage.interactive=true;
		this.game.stage.on( 'click', this.clickBg, this );

	}

	stop() {
		super.stop();
		this.game.stage.removeListener( 'click', this.clickBg, this );
	}


	clickBg(e){
		this.stats.clicks++;
		this.flakes.mkFlake( e.data.global );
	}

	update(){
	}

}