import { Container, Text, Graphics } from "pixi.js";
import gsap from "gsap";
import { MakeBg, MakeText } from "./uiGroup";
import { MultiPane } from "pixiwixi";

export default class HelpView extends MultiPane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;

		this.lastY = 0;

		this.width = game.screen.width;
		this.height = game.screen.height;

		MakeBg( this, this.width, this.height );



	}

	addSnowRule(){

		const t = MakeText( 'Make snowflakes to keep cheery during the night.' );
		this.addSection( t );

	}

	addSpecialRule(){

		let t = MakeText( 'Catch the special snowflakes to advance.' );
		this.addSection( t );

	}

	addMagicRule() {

		let t = MakeText( 'Magic snowflakes have magical effects.');
		this.addSection(t);

	}

	addCometRule() {

		const t = MakeText( 'Catch shooting stars increases other effects' );
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