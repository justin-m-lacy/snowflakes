import { Group } from "gibbon.js";
import { CounterFld } from 'pixiwixi';
import SpecialView from "../ui/specialView";
import { StatEvents } from "../components/stats";

const TEXT_COLOR = 0xffffff;
const FONT_NAME = 'Snowburst One'; // thin, large
//const FONT_NAME = 'Mountains of Christmas'; // slightly cramped?
//const FONT_NAME = 'Delius Swash Caps'; // overly simple?

const PADDING = 24;

const Styles = {
	fontFamily:FONT_NAME, fill:TEXT_COLOR
};

export default class UIGroup extends Group {

	get counter(){return this._counter;}

	constructor( game, layer ){

		super( game, layer );

		this.view = this.game.screen;


		this._special = new SpecialView( game, Styles, PADDING/2 );

		/**
		 * @property {.<string,CounterFld>} statViews - counters by event-type.
		 */
		this.statViews = {};

		this._special.position.set( this.view.left + PADDING, this.view.top + PADDING );


		//this._counter.anchor.set(1,0);

		layer.addChild( this._counter );
		layer.addChild( this._special );

		game.emitter.on( 'stat', this.onStat, this );

	}

	mkStatsViews() {

		var top = new Point( this.view.right - 200, this.view.top + PADDING );

		let len = StatEvents.length;
		for( let i = 0; i < len; i++ ) {

			var stat = StatEvents[i];
			var counter = new CounterFld( stat, 0, Styles );
			counter.showCount = true;
			counter.position.set( top.x, top.y );
			top.y += counter.height + PADDING;

			this.clip.addChild( counter );

		}

	}

	onStat( stat, count ) {

		let fld = this.statViews[stat];
		if ( !fld ) console.warn('missing stat: ' + stat );
		else {
			fld.update(count);
		}

	}

}