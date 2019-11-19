import { Game, Group } from "../../gibbon";
import SnowFactory from "./create/snowFactory";
import * as PIXI from 'pixi.js';

export default class SnowGame extends Game {

	/**
	 * @property {Group} flakes
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

		this.flakes = new Group( this, new PIXI.Container() );
		this.objectLayer.addChild( this.flakes.clip );

		let s = this.createFlake( new PIXI.Point(100,100));

		this.start();

	}

	/**
	 *
	 * @param {InteractionEvent} evt
	 */
	stageClicked(evt){
		this.createFlake(evt.data.global);
	}


	/**
	 *
	 * @param {Point} pt
	 */
	createFlake( pt ){

		let s = this.factory.createFlake(pt);
		this.flakes.addChild(s);
	}

	snowClicked(s) {
	}

}