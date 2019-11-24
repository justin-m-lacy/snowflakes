import { Container, Text, Sprite } from "pixi.js";

export default class SpecialView extends Container {

	constructor( game, styleInfo ) {

		super();

		this.game = game;

		this.create( styleInfo );

		this.game.emitter.on('new-special', this.onSpecial, this );

	}

	onSpecial( flake ) {

		if ( flake == null ) {

			this.visible = false;

		} else {

			const clip = flake.clip;
			if ( !clip ) return;
			const tex = clip.texture;
			if ( !tex) return;

			if (!this.snowflake ) {
				this.snowflake = new Sprite( tex );
			} else {
				this.snowflake.texture = tex;
			}
		}

	}

	create( styleInfo ) {

		this.field = new Text( 'special:', styleInfo );
		this.addChild( this.field );

		this.snowflake = null;

	}

}