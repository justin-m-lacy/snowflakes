import { Container, Text, Sprite } from "pixi.js";
import {gsap} from 'gsap'

export default class SpecialView extends Container {

	constructor( game, styleInfo ) {

		super();

		this.game = game;

		this.create( styleInfo );

		this.game.emitter.on('new-special', this.onSpecial, this );

		this.showTween = gsap.fromTo( this, {alpha:0},
			{paused:true, alpha:1, duration:1, onReverseComplete:(t)=>t.visible=false, onReverseCompleteParams:[this]} );

	}

	onSpecial( flake ) {

		if ( flake == null ) {

			this.visible = false;
			this.showTween.reverse();

		} else {

			const clip = flake.clip;
			if ( !clip ) return;
			const tex = clip.texture;
			if ( !tex) return;

			if (!this.snowflake ) {
				this.mkFlakeHolder( tex );
			} else {
				this.snowflake.texture = tex;
			}
			this.visible = true;
			this.showTween.play();

		}

	}

	mkFlakeHolder( tex ) {

		this.snowflake = new Sprite(tex);
		this.snowflake.position.set( this.field.x + this.field.width + 12 );
		this.addChild( this.snowflake);

	}

	create( styleInfo ) {

		this.field = new Text( 'special:', styleInfo );
		this.addChild( this.field );

		this.snowflake = null;

	}

}