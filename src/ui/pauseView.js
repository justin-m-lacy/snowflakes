import { Pane } from "pixiwixi";
import { MakeBg, MakeText, TextButton, MakeLgText } from "./uiGroup";
import { EVT_RESUME, EVT_MENU, EVT_REPORT } from "../components/stats";

export default class PauseView extends Pane {

	constructor( game, padding ) {

		super(game.app);

		this.game = game;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, this.width, this.height, 0, 0.7 );

		var t = MakeLgText( 'Paused');
		this.center( t , 0.5, 0.3 );
		this.addChild(t );

		let btn = TextButton( 'resume', this.onResume, this );
		this.addContentY( btn, t.x, 2*padding );

		btn = TextButton('main menu', this.onMenu, this );
		this.addContentY( btn, t.x, padding );

	}

	onResume(e){
		e.stopPropagation();

		this.game.emitter.emit(EVT_RESUME );
		this.destroy();
	}

	onMenu(e){
		e.stopPropagation();

		this.game.emitter.emit( EVT_REPORT );
		this.game.emitter.emit(EVT_MENU);
		this.destroy();
	}

}