import { Game } from "../../gibbon";

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

	}

	init() {

		super.init();
		this.objectLayer.addChild( planetLayer );

		this.ui = new UiManager( this );

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
	}

	snowClicked(s) {
	}

}