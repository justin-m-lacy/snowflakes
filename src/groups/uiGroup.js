import { Group } from "gibbon.js";
import { CounterFld } from 'pixiwixi';

const TEXT_COLOR = 0xffffff;
const FONT_NAME = 'Snowburst One'; // thin, large
//const FONT_NAME = 'Mountains of Christmas'; // slightly cramped?
//const FONT_NAME = 'Delius Swash Caps'; // overly simple?

const PADDING = 12;

export default class UIGroup extends Group {

	get counter(){return this._counter;}

	constructor( game, layer ){

		super( game, layer );

		this.view = this.game.screen;

		this._counter = new CounterFld( 'snow', 0, { fontFamily:FONT_NAME, fill:TEXT_COLOR });

		this._counter.showCount = true;
		this._counter.y = this.view.top + PADDING;
		this._counter.x = this.view.right - 200;
		//this._counter.anchor.set(1,0);

		layer.addChild( this._counter );

		game.emitter.on('snow-count', this.onCount, this );

	}

	onCount( count ){
		this._counter.update(count);
	}

}