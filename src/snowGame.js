import Gibbon, { Game } from "../../gibbon";
import SnowFactory from "./create/snowFactory";
import * as PIXI from 'pixi.js';
import {Point} from 'pixi.js';
import SnowGroup from "./groups/snowGroup";
import StarGroup from "./groups/starGroup";

export default class SnowGame extends Game {

	/**
	 * @property {SnowGroup} flakes
	 */
	get flakes() {return this._flakes; }
	set flakes(v) { this._flakes =v;}

	/**
	 * Construction done in init() to allow Game to be a shared export
	 * but initialized from index.js.
	 * @param {PIXI.Application} app - PIXI Application.
	 */
	constructor( app ) {

		super(app);

		this.enableWheel();
		this.wheelScale = 3;

		this.factory = new SnowFactory( this );

	}

	init() {

		super.init();

		this.loader.load( (loader,resources)=>this.assetsLoaded(loader,resources) );

		this.emitter.on( 'snow-clicked', this.snowClicked, this );

	}

	/**
	 *
	 * @param {PIXI.loaders.Loader} loader
	 * @param {Object} resources
	 */
	assetsLoaded( loader, resources ) {

		console.log('ASSETS LOADED');

		this.stage.interactive = true;

		this.stage.on('click', this.stageClicked, this );

		this.flakes = new SnowGroup( this );
		this.objectLayer.addChild( this.flakes.clip );

		this.stars = new StarGroup(this);
		this.backgroundLayer.addChild( this.stars.clip );

		this.flakes.createFlake( new PIXI.Point(100,100));

		this.start();

	}

	/**
	 *
	 * @param {InteractionEvent} evt
	 */
	stageClicked(evt){
		this.flakes.createFlake(evt.data.global);
	}



	snowClicked(s) {
	}

}