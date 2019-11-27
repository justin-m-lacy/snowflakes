import { MakeText, TextButton, MakeBg, MakeLgText, MakeSmText } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU } from "../components/stats";

export default class LoseView extends Pane {

	constructor( game, padding  ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, game.screen.width, game.screen.height );

		let t = MakeLgText( 'Defeat' );
		this.center( t, 0.5, 0.3 );
		this.addChild(t);

		let it = MakeSmText( 'You succumbed to winter gloom.');
		this.addContentY( it, t.x, padding );

		let btn = TextButton('menu', this.onRestart, this );
		this.addContentY( btn, t.x, 2*padding );

	}

	onRestart(){

		this.emitter.emit( EVT_MENU );
		this.destroy();

	}

}