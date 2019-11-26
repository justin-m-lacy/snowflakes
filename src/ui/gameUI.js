import { Container } from "pixi.js";
import { EVT_STAT, EVT_COLD } from "../components/stats";
import { lerpColor } from "gibbon.js/utils/colorUtils";
import { COLD_COLOR, TextButton } from "./uiGroup";

export default class GameUI extends Container {

	constructor( game, padding ){

		super( game );

		this.view = this.game.screen;
		this.padding = padding;

		this.btnHelp = TextButton( 'help', this.onHelp, this );

		this._special = new SpecialView( game, UiStyle, padding/2 );
		this._special.position.set( (this.view.width - this._special.width)/2 -64, this.view.top + padding );
		this.clip.addChild( this._special );

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
		this.coldView = this.mkStatView( 'cold', true );
		this.coldView.y = this.statViews.snow.y + this.statViews.snow.height + padding;

		this.lastY = this.coldView.y + this.coldView.height + padding;

		game.emitter.on( EVT_STAT, this.onStat, this );
		game.emitter.on( EVT_COLD, this.onCold, this );

	}

	onHelp(){
		this.game.ui.showHelp();
	}

	onCold( amt ) {
		this.coldView.update(amt);
		this.coldView.tint = lerpColor( 0xffffff, COLD_COLOR, amt/100 );
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

}