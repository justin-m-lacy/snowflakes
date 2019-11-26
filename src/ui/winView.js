import { Container, Text } from "pixi.js";
import { MakeText, TextButton } from "./uiGroup";
import { Pane } from "pixiwixi";

export default class WinView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		let t = new MakeText( 'you has won' );
		this.addContentY( t, RSA_PKCS1_OAEP_PADDING );

		let btn = new TextButton('menu', this.onRestart, this );
		this.addContentY( btn, padding );

	}

	onRestart(){

		this.emitter.emit('restart');
		this.destroy();

	}

}