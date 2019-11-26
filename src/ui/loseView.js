import { Container, Text } from "pixi.js";
import { MakeText, TextButton } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU } from "../components/stats";

export default class LoseView extends Pane {

	constructor( game, padding  ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		let t = new MakeText( 'You got frozed.' );
		this.addContentY( t, padding, padding );

		let btn = new TextButton('menu', this.onRestart, this );
		this.addContentY( btn, padding, padding );

	}

	onRestart(){

		this.emitter.emit( EVT_MENU );
		this.destroy();

	}

}