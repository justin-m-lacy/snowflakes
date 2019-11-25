import { Container, Text } from "pixi.js";
import { MakeText, TextButton } from "./uiGroup";

export default class LoseView extends Container {

	constructor( game ){

		super();

		this.emitter = game.emitter;

		let t = new MakeText('You got frozed.' );
		this.addChild( t );

		let btn = new TextButton('Restart', this.onRestart, this );
		this.addChild( btn );

	}

	onRestart(){

		this.emitter.emit('restart');
		this.destroy();

	}

}