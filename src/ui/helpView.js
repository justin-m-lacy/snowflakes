import { Container, Text, Graphics } from "pixi.js";
import gsap from "gsap";
import { MakeBg, MakeText } from "./uiGroup";
import { Pane } from "pixiwixi";

export default class HelpView extends Pane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;

		this.lastY = 0;

		MakeBg( this, 400, 700, 0, 0.5 );



	}

	addSnowRule(){

		const t = MakeText( 'Spread snowflakes to prepare for winter.' );
		this.addSection( t );

	}

	addSpecialRule(){

		let t = MakeText( 'Catch the special snowflakes to advance.' );
		this.addSection( t );

	}

	addCometRule() {

		const t = MakeText( 'Catching shooting stars increases other effects' );
		this.addSection( t );

	}

	show(){
		gsap.to( this, {alpha:1, duration:1} );
	}

	addSection( mc ) {

		this.addChild(mc);
		mc.y = this.lastY;
		this.lastY += mc.height + this.padding;

	}

}