import { Pane } from "pixiwixi";
import { MakeBg, MakeText } from "./uiGroup";

export default class PauseView extends Pane {

	constructor(game) {

		super(game.app);

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, this.width, this.height );

		var t = MakeText( 'Paused');
		this.center( t , 0.5, 0.3 );
		this.addChild(t );

		let btn = TextButton( 'resume', this.onCont, this );
		this.addContentY( btn, t.x, padding );

		let btn = TextButton('main menu', this.onRestart, this );
		this.addContentY( btn, t.x, padding );

	}

	onCont(){
	}

	onMenu(){
	}

}