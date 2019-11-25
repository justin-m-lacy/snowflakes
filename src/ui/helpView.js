import { Container, Text, Graphics } from "pixi.js";
import gsap from "gsap";
import { MakeBg } from "./uiGroup";

export default class HelpView extends Container {

	constructor( Style, PADDING ){

		super();

		this.PADDING = PADDING;

		this.Style = Style;

		this.lastY = 0;

		MakeBg( this, 400, 700, 0, 0.5 );



	}

	show(){

		gsap.to( this, {alpha:1, duration:1} );
	}

	addSection( mc ) {

		this.addChild(mc);
		mc.y = this.lastY;
		this.lastY += mc.height + this.PADDING;

	}

	addSnowRule(){

		const t = new Text( 'Spread snowflakes to prepare for winter.', this.Style );
		this.addSection( t );

	}

	addSpecialRule(){

		let t = new Text( 'Catch the special snowflakes to advance.', this.Style );
		this.addSection( t );

	}

	addCometRule() {

		const t = new Text('Catching shooting stars increases other effects', this.Style );
		this.addSection( t );

	}

}