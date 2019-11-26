import { Container } from "pixi.js";
import { TextButton } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_PLAY } from "../components/stats";

export default class MenuView extends Pane {

	constructor( game ){

		super();

		this.emitter = game.emitter;

		this.btnGame = TextButton( 'Game Mode', this.playGame, this );
		this.subGame = MakeSubText( 'get specials and stars to keep from freezing.')

		this.btnCasual = TextButton( 'Casual Mode', this.playCasual, this );
		this.subCasual = MakeSubText( 'relax and make snowflake' );


	}

	playGame() {

		this.emitter.emit( EVT_PLAY, 'game');
	}

	playCasual() {

		this.emitter.emit( EVT_PLAY, 'casual' );

	}

}