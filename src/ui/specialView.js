import { Container, Text, Sprite } from "pixi.js";
import {gsap} from 'gsap'
import { BASE_SCALE } from "../create/snowFactory";

export default class SpecialView extends Container {

	constructor( game, styleInfo, padding=0 ) {

		super();

		this.game = game;

		this.create( styleInfo );

		this.padding = padding;

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
		this.snowflake.scale.set(  0.48 );
		this.snowflake.anchor.set( 0, 0 );
		this.snowflake.position.set( this.field.x + this.field.width + this.padding, this.field.y + ( this.field.height - this.snowflake.height)/2 );
		this.addChild( this.snowflake);

	}

	create( styleInfo ) {

		this.field = new Text( 'special:', styleInfo );
		this.addChild( this.field );

		this.snowflake = null;

	}

}