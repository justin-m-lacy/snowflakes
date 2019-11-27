import { Container } from "pixi.js";
import { EVT_STAT, EVT_CHEER, EVT_PAUSE } from "../components/stats";
import { lerpColor } from "gibbon.js/utils/colorUtils";
import { CHEER_COLOR, TextButton, FontStyle } from "./uiGroup";
import SpecialView from './specialView';
import CounterField from "pixiwixi/src/counterFld";

export default class GameUI extends Container {

	constructor( game, padding ){

		super( game );

		this.game = game;
		this.view = this.game.screen;
		this.padding = padding;

		//this.btnHelp = TextButton( 'help', this.onHelp, this );
		this.btnPause = TextButton( 'pause', this.onPause, this );
		this.btnPause.position.set( padding, padding );
		this.addChild( this.btnPause );


		this._special = new SpecialView( game, FontStyle, padding/2 );
		this._special.position.set( (this.view.width - this._special.width)/2 -64, this.view.top + padding );
		this.addChild( this._special );

		/**
		 * @property {number} lastTop - top of last visible stat.
		 * stats added below as they become visible.
		 */
		this.lastY = this.view.top + padding;

		/**
		 * @property {.<string,CounterFld>} statViews - counters by event-type.
		 */
		this.statViews = {};
		this.mkStatViews();
		this.cheerView = this.mkStatView( 'cheer', true );
		this.cheerView.y = this.statViews.snow.y + this.statViews.snow.height + padding;

		this.lastY = this.cheerView.y + this.cheerView.height + padding;

		game.on( EVT_STAT, this.onStat, this );
		game.on( EVT_CHEER, this.onCheer, this );

	}

	onPause() {
		this.game.emitter.emit( EVT_PAUSE );
	}

	showCheer(){this.cheerView.visible = true; }

	hideCheer(){
		this.cheerView.visible = false;
	}

	onCheer( amt ) {
		this.cheerView.update(amt);
		this.cheerView.tint = lerpColor( 0xffffff, CHEER_COLOR, amt/100 );
	}

	onStat( stat, count ) {

		let fld = this.statViews[stat];

		if ( fld ) {

			if ( !fld.visible ) {

				fld.y = this.lastY;
				this.lastY += fld.height + this.padding;
				fld.visible = true;

			}
			fld.update(count);

		}// else console.warn('missing stat: ' + stat );

	}

	mkStatViews() {

		let visStats = ['snow'];
		let len = visStats.length;
		for( let i = 0; i < len; i++ ) {

			this.statViews[ visStats[i] ] = this.mkStatView( visStats[i] );

		}

	}

	mkStatView( stat, showCount=true ){

		var counter = this.statViews[stat] = new CounterField( stat, 0, FontStyle );
		counter.showCount = showCount;
		counter.position.set( this.view.right-200, this.lastY );
		counter.visible = true;

		this.addChild( counter );

		return counter;

	}

}