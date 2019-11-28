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

		let btn = TextButton('back', this.onClose, this );
		btn.position.set( btn.width/2 + 3*padding, btn.height/2 + 3*padding );
		this.addChild(btn);

		this.initRules( game.factory );

		this.showIndex(0);


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

		let r = this.makeBlock( 'Snowflakes', ['Create Snowflakes to keep your cheer up during the night.',
								'Find special snowflakes for a large boost of cheer.'], factory.flakeDisplay( p ) );

		this.addContentY( r, 0, this.padding, screen );

		//r = this.makeBlock( null, 'Find special snowflakes for a large boost of cheer.');
		//this.addContentY( r, 0, 0, screen );

		let flake = factory.flakeDisplay(p);
		flake.tint = MAGIC_COLOR;
		r = this.makeBlock( 'Magic Snowflakes', [
			'Magic snowflakes give bursts of snow and increase the chance of shooting stars.',
			'Shooting stars bring extra cheer when caught and increase the power of magic snowflakes.'], flake );

		//r = this.makeBlock( null, 'Shooting stars bring extra cheer when caught and increase the power of magic snowflakes.');
		//this.addContentY( r, 0, this.padding, screen );

		this.addContentY( r, 0, 2*this.padding, screen );

		flake = factory.flakeDisplay(p);
		flake.tint = GLOOM_COLOR;
		r = this.makeBlock( 'Gloom Flakes', 'Gloom flakes make winter gloomy. Get rid of them right away.', flake );
		this.addContentY( r, 0, this.padding, screen );

		this.center( screen, 0.5, 0.3 );
		this.addView( screen );

	}

	makeBlock( mainTex, subTex, graphic, maxWidth ) {

		let p = new Container();

		var textX = graphic ? graphic.width + this.padding : this.padding;

		if ( mainTex ) {

			this.addContentY( MakeText(mainTex), textX, 0, p );

		}
		if ( subTex ) {

			if ( Array.isArray(subTex) ) {

				for( let i = 0; i <subTex.length; i++ ) {
					this.addContentY( MakeSmText(subTex[i]), textX, this.padding, p );
				}

			} else this.addContentY( MakeSmText( subTex ), textX, this.padding, p );

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