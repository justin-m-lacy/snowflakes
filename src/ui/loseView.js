import { MakeText, TextButton, MakeBg, MakeLgText, MakeSmText } from "./uiGroup";
import { Pane } from "pixiwixi";
import { EVT_MENU } from "../components/stats";
import { Container } from "pixi.js";

export default class LoseView extends Pane {

	constructor( game, padding  ){

		super( game.app );

		this.padding = padding;
		this.emitter = game.emitter;

		this.width = game.screen.width;
		this.height = game.screen.height;

		this.bg = MakeBg( this, game.screen.width, game.screen.height, 0, 0.7 );

		let t = MakeLgText( 'Defeat' );
		this.center( t, 0.5, 0.2 );
		this.addChild(t);

		let p = new Container();
		let it = MakeSmText( 'You succumbed to winter gloom.');
		this.addContentY( it, 0, padding, p );

		let btn = TextButton('menu', this.onRestart, this );
		this.addContentY( btn, btn+btn.width/2, 2*padding, p );

		this.addContentY( p, (game.screen.width-p.width)/2, padding );

	}

	onRestart(e){
		e.stopPropagation();

		this.emitter.emit( EVT_MENU );
		this.destroy();

	}

}