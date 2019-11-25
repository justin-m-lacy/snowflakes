import { Container } from "pixi.js";
import { TextButton } from "./uiGroup";

export default class MenuView extends Container {

	constructor( game ){

		super();

		this.emitter = game.emitter;

		this.btnGame = TextButton( 'Game Mode', this.playGame, this );
		this.subGame = MakeSubText( 'get specials and stars to keep from freezing.')

		this.btnCasual = TextButton( 'Casual Mode', this.playCasual, this );
		this.subCasual = MakeSubText( 'relax and make snowflake' );


	}

	playGame() {

		this.emitter.emit( 'play', 'game');
	}

	playCasual() {

		this.emitter.emit( 'play', 'casual' );

	}

}