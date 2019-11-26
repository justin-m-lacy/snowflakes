import { Group } from "gibbon.js";
import { CounterFld } from 'pixiwixi';
import { Point, Graphics, Text } from "pixi.js";
import WinView from "./winView";
import LoseView from "./loseView";
import HelpView from "./helpView";
import GameUI from "./gameUI";
import MenuView from "./menuView";

export const COLD_COLOR = 0x0091ff;

const TEXT_COLOR = 0xffffff;
const BASE_COLOR = 0xf5f6f7;
const HILITE_COLOR = 0xffffff;
const PANE_ALPHA = 0.4;

const FONT_NAME = 'Snowburst One'; // thin, large
//const FONT_NAME = 'Mountains of Christmas'; // slightly cramped?

const PADDING = 24;

const UiStyle = {
	fontFamily:FONT_NAME, fill:TEXT_COLOR,
	fontSize:24
};

const SubStyle = Object.assign( {}, UiStyle );
SubStyle.fontSize = 16;

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

export const MakeBg = ( dest, width, height, color=0, alpha=PANE_ALPHA ) => {

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

	}

	centerPane(pane){
		pane.position.set( (this.view.width - pane.width)/2, (this.view.height-pane.height)/2 );
	}

	showMenu() {

		if ( !this.mainMenu ) this.mainMenu = new MenuView( this.game, PADDING );
		this.clip.addChild( this.mainMenu );
		this.mainMenu.visible = true;
		this.centerPane( this.mainMenu );

	}

	hideMenu() {

		this.mainMenu.visible = false;
		this.clip.removeChild( this.mainMenu );

	}

	showWin() {

		let winPane = new WinView( this.game, PADDING );
		this.clip.addChild( winPane );
		this.centerPane( winPane );

	}

	showLose() {

		let losePane = new LoseView( this.game, PADDING );
		this.clip.addChild( losePane );
		this.centerPane( losePane );

	}

	showHelp(){

		if ( !this.helpView ) {
			this.helpView = new HelpView( this.game, PADDING );
		}
		this.addChild( this.helpView );

	}

	showGameView() {

		if ( !this.gameView ) {
			this.gameView = new GameUI( this.game, PADDING );
			this.addChild( this.gameView );
		}
		this.gameView.visible = true;

	}

	hideGameView() {

		if ( this.gameView ) {
			this.gameView.visible = false;
		}

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

}