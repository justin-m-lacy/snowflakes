import { Container, Text, Graphics } from "pixi.js";
import gsap from "gsap";
import { MakeBg, MakeText, MakeSmText } from "./uiGroup";
import { MultiPane } from "pixiwixi";

export default class HelpView extends MultiPane {

	constructor( game, padding ){

		super( game.app );

		this.padding = padding;

		this.lastY = 0;

		this.width = game.screen.width;
		this.height = game.screen.height;

		MakeBg( this, this.width, this.height );

		this.initRules();

		this.showIndex(0);

	}

	initRules() {

		var screen = new Container();

		let r = makeBlock( null, 'Create Snowflakes to keep your cheer up during the night.' );

		this.addContentY( r, 0, this.padding, screen );

		r = makeBlock( null, 'Finding special snowflakes gives burst of winter cheer.');

		this.addContentY( r, 0, this.padding, screen );

		r = makeBlock( null, 'Magic snowflakes increase shooting stars.');

		this.addContentY( r, 0, this.padding, screen );

		r = this.makeBlock( null, 'Shooting stars give extra cheer and increase magic snowflakes.');
		this.addContentY( r, 0, this.padding, screen );

		r = this.makeBlock( null, 'Gloom flakes make winter gloomy. Get rid of them right away.');

		this.addContentY( r, 0, this.padding, screen );

		this.center( screen );
		this.addView( screen );

	}

	makeBlock( mainTex, subTex, graphic, maxWidth ) {

		let p = new Container();

		var lastY = 0;
		var textX = 0;

		if ( graphic ) {
			graphic.position.set( 0, 0 );
			p.addChild( graphic );
			textX = graphic.width + this.padding;
		}

		if ( mainTex ) {

			this.addContentY( MakeText(mainTex), textX, 0, p );
			lastY = p.height;

		}
		if ( subTex ) {
			this.addContentY( MakeSmText( subTex ), textX, lastY + this.padding, p );
			lastY = p.height;
		}

		return p;

	}

	show(){
		gsap.to( this, {alpha:1, duration:1} );
	}

}