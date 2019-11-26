import { MakeText, TextButton } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU } from "../components/stats";

export default class WinView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		let t = new MakeText( 'you has won' );
		this.addContentY( t, padding, padding );

		let btn = new TextButton('menu', this.onRestart, this );
		this.addContentY( btn, padding, padding );

		btn = new TextButton( 'continue', this.onCont, this );
		this.addContentY( btn, padding, padding );

	}

	onCont() {
		this.destroy();
	}

	onRestart(){

		this.emitter.emit( EVT_MENU );
		this.destroy();

	}

}