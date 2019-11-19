import { Game } from "../../gibbon";
import SnowFactory from "./create/snowFactory";
import * as PIXI from 'pixi.js';

export default class SnowGame extends Game {

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

		this.stage.on('click', this.createFlake, this );

		let s = this.factory.createFlake( new PIXI.Point(100,100));
		this.objectLayer.addChild(s );

		this.start();

	}

	/**
	 *
	 * @param {InteractionEvent} evt
	 */
	createFlake( evt ){

		let pt = evt.data.global;
		console.log(pt);
		let s = this.factory.createFlake(pt);

		this.objectLayer.addChild(s);
	}

	snowClicked(s) {
	}

}