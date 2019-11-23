import Gibbon, { Game, GameObject } from "gibbon.js";
import SnowFactory from "./create/snowFactory";
import * as PIXI from 'pixi.js';
import {Point} from 'pixi.js';
import SnowGroup from "./groups/snowGroup";
import StarGroup from "./groups/starGroup";
import BackSnow from "./components/backSnow";
import Sky from "./components/sky";
import Stats from "./components/stats";
import FlakeSpawner from "./components/flakeSpawner";

export default class SnowGame extends Game {

	/**
	 * @property {SnowGroup} flakes
	 */
	get flakes() {return this._flakes; }
	set flakes(v) { this._flakes =v;}

	/**
	 * @property {Stats} stats
	 */
	get stats() { return this._stats; }

	/**
	 * @property {Point} wind
	 */
	get wind(){ return this._wind; }
	set wind(v) { this._wind = v}

	/**
	 * @property {GameObject} root - root object
	 * for shared values/systems.
	 */
	get root(){ return this._root; }
	set root(v) { this._root = v}

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

		this.initSky();

		this.wind = new Point();

		this.root = new GameObject( new PIXI.Container() );
		this.addObject( this.root );

		this.root.add( BackSnow );
		this._stats = this.root.add( Stats );

		this.flakes = new SnowGroup( this );
		this.objectLayer.addChild( this.flakes.clip );

		this.stars = new StarGroup(this);
		this.backgroundLayer.addChild( this.stars.clip );

		this.loader.load( (loader,resources)=>this.assetsLoaded(loader,resources) );

		this.emitter.on( 'snow-clicked', this.snowClicked, this );

	}

	initSky(){

		let s = new PIXI.Container();
		this.backgroundLayer.addChild( s );

		this.sky = this.instantiate( s );
		this.sky.add( Sky );

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

		this.start();

	}

	/**
	 *
	 * @param {InteractionEvent} evt
	 */
	stageClicked(evt){

		this.stats.clicks++;
		this.flakes.createFlake(evt.data.global);

	}



	snowClicked(s) {
	}

}