import { Container } from "pixi.js";
import { TextButton, MakeSmText, MakeBg, MakeLgText } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_PLAY, EVT_HELP } from "../components/stats";

export default class MenuView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, this.width, this.height );

		let centerView = new Container();

		let it = MakeLgText( 'Special of Snowflakes' );
		this.center(it, 0.5, 0.2 );
		this.addChild(it);

		it = TextButton( 'Game Mode', this.playGame, this );
		this.addContentY( it, it.width/2, 2*padding, centerView );

		it = MakeSmText( 'Create snowflakes and find the special ones to fight the winter gloom.',
			{wordWrap:true, wordWrapWidth:400 });
		this.addContentY( it, padding, padding, centerView );

		it = TextButton( 'Casual Mode', this.playCasual, this );
		this.addContentY( it, it.width/2, padding, centerView );

		it = MakeSmText( 'Relax and make snowflake' );
		this.addContentY( it, padding, padding, centerView );

		it = TextButton( 'Help', this.onHelp, this );
		this.addContentY( it,  it.width/2, padding, centerView );

		this.center( centerView, 0.5, 0.3 );
		this.addChild( centerView );

	}

	onHelp(e){
		e.stopPropagation();
		this.emitter.emit( EVT_HELP );

	}

	playGame(e) {
		e.stopPropagation();

		this.emitter.emit( EVT_PLAY, 'game');
	}

	playCasual(e) {
		e.stopPropagation();

		this.emitter.emit( EVT_PLAY, 'casual' );

	}

}