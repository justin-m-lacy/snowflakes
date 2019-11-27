import { MakeText, TextButton, MakeSubText } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU, EVT_RESUME } from "../components/stats";

export default class WinView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, game.screen.width, game.screen.height );

		let t = MakeText( 'you has won' );
		this.center( t, 0.5, 0.3 );
		this.addChild( t );

		let sub = MakeSubText( 'You made it through the gloomy night. Time for bed.');
		this.addContentY( sub, t.x, padding );

		let btn = TextButton('main menu', this.onMenu, this );
		this.addContentY( btn, t.x, padding );

		btn = TextButton( 'continue', this.onResume, this );
		this.addContentY( btn, t.x, padding );

		sub = MakeSubText( 'continue playing for high score' );
		this.addContentY( sub, t.x, padding );

	}

	onResume() {
		this.game.emitter.emit( EVT_RESUME );
		this.destroy();
	}

	onMenu(){

		this.emitter.emit( EVT_MENU );
		this.destroy();

	}

}