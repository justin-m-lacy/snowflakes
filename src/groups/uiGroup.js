import { Group } from "gibbon.js";
import { CounterFld } from 'pixiwixi';
import SpecialView from "../ui/specialView";
import { StatEvents } from "../components/stats";
import { Point } from "pixi.js";

const TEXT_COLOR = 0xffffff;
const FONT_NAME = 'Snowburst One'; // thin, large
//const FONT_NAME = 'Mountains of Christmas'; // slightly cramped?
//const FONT_NAME = 'Delius Swash Caps'; // overly simple?

const PADDING = 24;

const Styles = {
	fontFamily:FONT_NAME, fill:TEXT_COLOR,
	fontSize:24
};

export default class UIGroup extends Group {

	get counter(){return this._counter;}

	constructor( game, layer ){

		super( game, layer );

		this.view = this.game.screen;

		this._special = new SpecialView( game, Styles, PADDING/2 );
		this._special.position.set( this.view.left + PADDING, this.view.top + PADDING );
		layer.addChild( this._special );

		/**
		 * @property {number} lastTop - top of last visible stat.
		 * stats added below as they become visible.
		 */
		this.lastTop = this.view.top + PADDING;

		/**
		 * @property {.<string,CounterFld>} statViews - counters by event-type.
		 */
		this.statViews = {};
		this.mkStatsViews();

		game.emitter.on( 'stat', this.onStat, this );

	}

	mkStatsViews() {


		let len = StatEvents.length;
		for( let i = 0; i < len; i++ ) {

			var stat = StatEvents[i];
			var counter = this.statViews[stat] = new CounterFld( stat, 0, Styles );
			counter.showCount = false;
			counter.position.set( this.view.right-200, this.lastTop );
			counter.visible = false;

			this.clip.addChild( counter );

		}
		this.statViews.snow.showCount = true;

		this.lastTop += this.statViews.snow.y;

	}

	onStat( stat, count ) {

		let fld = this.statViews[stat];
		if ( !fld ) console.warn('missing stat: ' + stat );
		else {
			if ( !fld.visible ) {

				fld.y = this.lastTop;
				this.lastTop += fld.height + PADDING;
				fld.visible = true;

			}
			fld.update(count);
		}

	}

}