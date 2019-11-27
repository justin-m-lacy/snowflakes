import { Pane } from "pixiwixi";
import { MakeBg, MakeText } from "./uiGroup";
import { EVT_RESUME, EVT_MENU } from "../components/stats";

export default class PauseView extends Pane {

	constructor( game, padding ) {

		super(game.app);

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, this.width, this.height );

		var t = MakeText( 'Paused');
		this.center( t , 0.5, 0.3 );
		this.addChild(t );

		let btn = TextButton( 'resume', this.onResume, this );
		this.addContentY( btn, t.x, padding );

		let btn = TextButton('main menu', this.onMenu, this );
		this.addContentY( btn, t.x, padding );

	}

	onResume(){
		this.game.emitter.emit(EVT_RESUME );
		this.destroy();
	}

	onMenu(){
		this.game.emitter.emit(EVT_MENU);
		this.destroy();
	}

}