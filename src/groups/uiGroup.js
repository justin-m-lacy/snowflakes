import { Group } from "gibbon.js";
import { CounterFld } from 'pixiwixi';
import SpecialView from "../ui/specialView";

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

		this._counter = new CounterFld( 'snow', 0, Styles );
		this._special = new SpecialView( game, Styles, PADDING/2 );

		this._special.position.set( this.view.left + PADDING, this.view.top + PADDING );

		this._counter.showCount = true;
		this._counter.position.set( this.view.right - 200, this.view.top + PADDING );
		//this._counter.anchor.set(1,0);

		layer.addChild( this._counter );
		layer.addChild( this._special );

		game.emitter.on('mk-flake', this.onCount, this );

	}

	onCount( count ){
		this._counter.update(count);
	}

}