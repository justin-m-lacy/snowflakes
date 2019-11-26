import { Container } from "pixi.js";
import { TextButton } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_PLAY } from "../components/stats";

export default class MenuView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		this.btnGame = TextButton( 'Game Mode', this.playGame, this );
		this.addContentY( this.btnGame, padding, padding );

		this.subGame = MakeSubText( 'get specials and stars to keep from freezing.');
		this.addContentY( this.btnGame, padding, padding );


		this.btnCasual = TextButton( 'Casual Mode', this.playCasual, this );
		this.addContentY( this.btnGame, padding, padding );

		this.subCasual = MakeSubText( 'relax and make snowflake' );
		this.addContentY( this.btnGame, padding, padding );


	}

	playGame() {

		this.emitter.emit( EVT_PLAY, 'game');
	}

	playCasual() {

		this.emitter.emit( EVT_PLAY, 'casual' );

	}

}