import { Container, Text, Graphics, Point } from "pixi.js";
import gsap from "gsap";
import { MakeBg, MakeText, MakeSmText, TextButton, MAGIC_COLOR, GLOOM_COLOR } from "./uiGroup";
import { MultiPane } from "pixiwixi";

export default class HelpView extends MultiPane {

	constructor( game, padding ){

		super( game.app );

		this.game = game;
		this.padding = padding;

		this.lastY = 0;

		this.maxWidth = 0.8*game.screen;

		this.width = game.screen.width;
		this.height = game.screen.height;

		MakeBg( this, this.width, this.height );


		this.initRules( game.factory );

		this.showIndex(0);

		let btn = TextButton('close', this.onClose, this );
		//btn.position.set( padding, padding );
		this.addContentY( btn );


	}

	onClose(e){

		e.stopPropagation();
		this.game.ui.hideHelp();

	}

	/**
	 *
	 * @param {SnowFactory} factory
	 */
	initRules( factory ) {

		var screen = new Container();
		var p = new Point();

		let r = this.makeBlock( 'Snowflakes', 'Create Snowflakes to keep your cheer up during the night.', factory.flakeDisplay( p ) );

		this.addContentY( r, 0, this.padding, screen );

		r = this.makeBlock( null, 'Finding the special snowflake gives a large cheer boost.');

		this.addContentY( r, 0, this.padding, screen );

		let flake = factory.flakeDisplay(p);
		flake.tint = MAGIC_COLOR;
		r = this.makeBlock( null, 'Magic snowflakes increase shooting stars.', flake );

		this.addContentY( r, 0, this.padding, screen );

		r = this.makeBlock( null, 'Shooting stars give extra cheer and increase magic snowflakes.');
		this.addContentY( r, 0, this.padding, screen );

		flake = factory.flakeDisplay(p);
		flake.tint = GLOOM_COLOR;
		r = this.makeBlock( null, 'Gloom flakes make winter gloomy. Get rid of them right away.', flake );

		this.addContentY( r, 0, this.padding, screen );

		this.center( screen );
		this.addView( screen );

	}

	makeBlock( mainTex, subTex, graphic, maxWidth ) {

		let p = new Container();

		var textX = graphic ? graphic.width + this.padding : this.padding;

		if ( mainTex ) {

			this.addContentY( MakeText(mainTex), textX, 0, p );

		}
		if ( subTex ) {
			this.addContentY( MakeSmText( subTex ), textX, this.padding, p );
		}

		if ( graphic ) {
			graphic.position.set( graphic.width/2, graphic.height/2 );
			p.addChild( graphic );
			textX = graphic.width + this.padding;
		}

		return p;

	}

	show(){
		gsap.to( this, {alpha:1, duration:1} );
	}

}