import { Group } from "gibbon.js";
import { CounterFld } from 'pixiwixi';
import SpecialView from "./specialView";
import { StatEvents, EVT_STAT, EVT_COLD } from "../components/stats";
import { Point, Graphics, Text } from "pixi.js";
import { lerpColor } from "gibbon.js/utils/colorUtils";
import WinView from "./winView";
import LoseView from "./loseView";
import HelpView from "./helpView";

export const COLD_COLOR = 0x0091ff;

const TEXT_COLOR = 0xffffff;
const BASE_COLOR = 0xf5f6f7;
const HILITE_COLOR = 0xffffff;

const FONT_NAME = 'Snowburst One'; // thin, large
//const FONT_NAME = 'Mountains of Christmas'; // slightly cramped?

const PADDING = 24;

const UiStyle = {
	fontFamily:FONT_NAME, fill:TEXT_COLOR,
	fontSize:24
};

const SubStyle = Object.assign( {fontSize:16 }, UiStyle );

export const MakeHiliter = (targ) => {
	return gsap.to( targ, { duration:0.5, tint:HILITE_COLOR } );
}

export const MakeClose = () => {

}

export const MakeText = (text )=>{

	let t = new Text( text, UiStyle );
	t.tint = TEXT_COLOR;

	return t;

}

export const MakeSubText = (text)=>{

	let t = new Text( text, SubStyle );
	t.tint = TEXT_COLOR;
	return t;

}

export const TextButton = (text, fn, context)=>{

	var t = MakeText(text);
	t.interactive = true;

	if ( fn ) t.on('click', fn, context );

	return t;

}

export const MakeBg = ( dest, width, height, color, alpha  ) => {

	var g = new Graphics();
	g.beginFill( color, alpha );
	g.drawRect( 0, 0, width, height );
	g.endFill();
	g.cacheAsBitmap = true;

	dest.addChild(g);

	return g;

}

export default class UIGroup extends Group {

	get counter(){return this._counter;}

	constructor( game, layer ){

		super( game, layer );

		this.view = this.game.screen;

		this.mkHelpButton();

		this._special = new SpecialView( game, UiStyle, PADDING/2 );
		this._special.position.set( (this.view.width - this._special.width)/2 -64, this.view.top + PADDING );
		layer.addChild( this._special );

		/**
		 * @property {number} lastTop - top of last visible stat.
		 * stats added below as they become visible.
		 */
		this.lastY = this.view.top + PADDING;

		/**
		 * @property {.<string,CounterFld>} statViews - counters by event-type.
		 */
		this.statViews = {};
		this.mkStatViews();
		this.coldView = this.mkStatView( 'cold', true );
		this.coldView.y = this.statViews.snow.y + this.statViews.snow.height + PADDING;

		this.lastY = this.coldView.y + this.coldView.height + PADDING;

		game.emitter.on( EVT_STAT, this.onStat, this );
		game.emitter.on( EVT_COLD, this.onCold, this );

	}

	showMenu() {

		if ( !this.mainMenu ) this.mainMenu = new MenuView();
		this.clip.addChild( this.mainMenu );
		this.mainMenu.visible = true;

	}

	hideMenu() {

		this.mainMenu.visible = false;
		this.clip.removeChild( this.mainMenu );

	}

	showWin() {

		let winPane = new WinView( this.game, PADDING );
		this.clip.addChild( winPane );

	}

	showLose() {

		let losePane = new LoseView( this.game, PADDING );
		this.clip.addChild( losePane );

	}

	showHelp(){

		if ( !this.helpView ) {
			this.helpView = new HelpView( this.game, PADDING );
		}
		this.addChild( this.helpView );

	}

	showGameView() {
	}

	hideGameView() {
	}

	mkHelpButton() {

		var b = MakeText( 'help' );
		b.position.set( PADDING )

		this.btnHelp = b;

		this.clip.addChild(b);

	}

	mkStatViews() {

		let visStats = ['snow'];
		let len = visStats.length;
		for( let i = 0; i < len; i++ ) {

			this.statViews[ visStats[i] ] = this.mkStatView( visStats[i] );

		}

	}

	mkStatView( stat, showCount=true ){

		var counter = this.statViews[stat] = new CounterFld( stat, 0, UiStyle );
		counter.showCount = showCount;
		counter.position.set( this.view.right-200, this.lastY );
		counter.visible = true;

		this.clip.addChild( counter );

		return counter;

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
				this.lastY += fld.height + PADDING;
				fld.visible = true;

			}
			fld.update(count);

		}// else console.warn('missing stat: ' + stat );

	}

}