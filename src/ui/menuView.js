import { Container } from "pixi.js";
import { TextButton, MakeSubText, MakeBg } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_PLAY } from "../components/stats";

export default class MenuView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, this.width, this.height );

		let centerView = new Container();

		this.btnGame = TextButton( 'Game Mode', this.playGame, this );
		this.addContentY( this.btnGame, 0, 0, centerView );

		this.subGame = MakeSubText( 'get specials and stars to keep from freezing.');
		this.addContentY( this.subGame, padding, padding, centerView );

		this.btnCasual = TextButton( 'Casual Mode', this.playCasual, this );
		this.addContentY( this.btnCasual, 0, padding, centerView );

		this.subCasual = MakeSubText( 'relax and make snowflake' );
		this.addContentY( this.subCasual, padding, padding, centerView );

		this.center( centerView, 0.5, 0.3 );
		this.addChild( centerView );

	}

	playGame() {

		this.emitter.emit( EVT_PLAY, 'game');
	}

	playCasual() {

		this.emitter.emit( EVT_PLAY, 'casual' );

	}

}