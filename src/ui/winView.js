import { MakeText, TextButton, MakeSmText, MakeBg, MakeLgText } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU, EVT_RESUME } from "../components/stats";
import { Container } from "pixi.js";

export default class WinView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		var maxWidth = 800;

		this.bg = MakeBg( this, game.screen.width, game.screen.height, 0, 0.7 );

		var p = new Container();

		let t = MakeLgText( 'Victory!' );
		this.addContentY( t, 200, 0, p );

		let sub = MakeSmText( 'You made it through the gloomy night. Now consider going to bed.', {wordWrapWidth:maxWidth } );
		this.addContentY( sub, 0, padding, p );

		let btn = TextButton( 'continue', this.onResume, this );
		this.addContentY( btn, btn.width/2, 2*padding, p );

		sub = MakeSmText( 'continue playing for higher score' );
		this.addContentY( sub, 0, padding, p );

		btn = TextButton('main menu', this.onMenu, this );
		this.addContentY( btn, btn.width/2, 2*padding, p );

		this.center( p, 0.5, 0.45 );
		this.addChild( p );

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