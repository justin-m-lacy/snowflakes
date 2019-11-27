import { MakeText, TextButton, MakeSmText, MakeBg, MakeLgText } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU, EVT_RESUME } from "../components/stats";

export default class WinView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, game.screen.width, game.screen.height );

		let t = MakeLgText( 'Victory!' );
		this.center( t, 0.45, 0.3 );
		this.addChild( t );

		let sub = MakeSmText( 'You made it through the gloomy night. Time for bed.');
		this.addContentY( sub, t.x, padding );

		let btn = TextButton('main menu', this.onMenu, this );
		this.addContentY( btn, t.x, 2*padding );

		btn = TextButton( 'continue', this.onResume, this );
		this.addContentY( btn, t.x, 2*padding );

		sub = MakeSmText( 'continue playing for high score' );
		this.addContentY( sub, t.x, padding );

	}

	onResume(e) {
		e.stopPropagation();

		this.emitter.emit( EVT_RESUME );
		this.destroy();
	}

	onMenu(e){
		e.stopPropagation();

		this.emitter.emit( EVT_MENU );
		this.destroy();

	}

}